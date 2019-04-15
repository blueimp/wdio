#!/usr/bin/env python3

import cgi
import ntpath
import os
import signal
import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from hashlib import scrypt
from http import HTTPStatus, cookies
from http.server import HTTPServer, SimpleHTTPRequestHandler

from itsdangerous import URLSafeTimedSerializer

SERVER_PORT = int(os.getenv('SERVER_PORT', '8080'))
SMTP_HOST = os.getenv('SMTP_HOST', 'localhost:1025')
USER_NAME = os.getenv('USER_NAME')
USER_MAIL = os.getenv('USER_MAIL', 'user@example')
USER_SALT = os.getenv('USER_SALT', '').encode() or \
    os.urandom(32).hex().encode()
USER_HASH = bytes.fromhex(os.getenv('USER_HASH', '')) or \
    scrypt('password'.encode(), salt=USER_SALT, n=2, r=8, p=1)
SECRET_KEY = os.getenv('SECRET_KEY') or os.urandom(32).hex()
SESSION_SECURE = os.getenv('SESSION_SECURE')
SESSION_MAX_AGE = int(os.getenv('SESSION_MAX_AGE', 0)) or None
HTML_DIR = os.path.dirname(__file__) + '/html'

# Monkey-patch Python 3.7 cookies module to support the SameSite attribute:
cookies.Morsel._reserved[str('samesite')] = str('SameSite')


class MailRequestHandler(SimpleHTTPRequestHandler):

    def get_sender(self):
        if USER_NAME:
            return '%s <%s>' % USER_NAME, USER_MAIL
        else:
            return USER_MAIL

    def send_mail(self, **kwargs):
        msg = MIMEMultipart()
        msg['From'] = self.get_sender()
        msg['To'] = kwargs.get('recipient', '')
        msg['Subject'] = kwargs.get('subject', '')
        msg.attach(MIMEText(kwargs.get('content', '')))
        for attachment in kwargs.get('attachments', []):
            if not attachment.filename:
                break
            part = MIMEApplication(attachment.file.read())
            if attachment.type:
                part.set_type(attachment.type)
            part.add_header(
                'Content-Disposition',
                'attachment',
                # Remove Windows directory path added by IE:
                filename=ntpath.basename(attachment.filename)
            )
            msg.attach(part)
        smtp = smtplib.SMTP(SMTP_HOST)
        smtp.send_message(msg)
        smtp.quit()

    def get_form_data(self):
        return cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={
                'REQUEST_METHOD': self.command,
                'CONTENT_TYPE': self.headers.get('content-type'),
            }
        )

    def get_attachments(self, form):
        if 'attachments' in form:
            if type(form['attachments']) is list:
                return form['attachments']
            else:
                return [form['attachments']]
        else:
            return []

    def create_cookie(self, value, max_age=None):
        cookie = cookies.SimpleCookie()
        cookie['session'] = value
        cookie['session']['path'] = '/'
        cookie['session']['httponly'] = True
        cookie['session']['samesite'] = 'Strict'
        if SESSION_SECURE:
            cookie['session']['secure'] = True
        if max_age is not None:
            cookie['session']['max-age'] = max_age
        return cookie

    def login(self, **kwargs):
        if kwargs.get('email', '') != USER_MAIL:
            return None
        # Limit password length to 1024:
        password = kwargs.get('password', '')[0:1024].encode()
        password_hash = scrypt(password, salt=USER_SALT, n=2, r=8, p=1)
        if password_hash != USER_HASH:
            return None
        auth = URLSafeTimedSerializer(SECRET_KEY).dumps({'email': USER_MAIL})
        return self.create_cookie(auth, SESSION_MAX_AGE)

    def logout(self):
        return self.create_cookie(0, 0)

    def redirect(self, location, cookie=None):
        self.send_response(HTTPStatus.FOUND)
        if cookie:
            self.send_header('Set-Cookie', cookie.output(header='', sep=''))
        self.send_header('Location', location)
        self.end_headers()

    def authenticate(self):
        try:
            cookie = cookies.SimpleCookie(self.headers.get('cookie'))
            session = cookie['session'].value
            auth = URLSafeTimedSerializer(SECRET_KEY).loads(
                session, max_age=SESSION_MAX_AGE)
            if auth['email'] != USER_MAIL:
                raise Exception('Email %s does not match %s' %
                                auth['email'], USER_MAIL)
        except Exception as err:
            self.log_error('code %d, message %s',
                           HTTPStatus.UNAUTHORIZED, str(err))
            self.redirect('/login.html')
            return False
        return True

    def handle_login(self):
        form = self.get_form_data()
        cookie = self.login(
            email=form.getfirst('email', ''),
            password=form.getfirst('password', '')
        )
        if cookie:
            self.redirect('/', cookie)
        else:
            self.send_error(
                HTTPStatus.UNAUTHORIZED,
                'Authorization failed',
                'Incorrect email or password'
            )

    def handle_logout(self):
        if not self.authenticate():
            return None
        self.redirect('/login.html', self.logout())

    def handle_mail(self):
        if not self.authenticate():
            return None
        form = self.get_form_data()
        try:
            self.send_mail(
                recipient=form.getfirst('recipient', ''),
                subject=form.getfirst('subject', ''),
                content=form.getfirst('content', ''),
                attachments=self.get_attachments(form)
            )
        except Exception as err:
            self.send_error(
                HTTPStatus.BAD_GATEWAY,
                'Sending mail failed',
                str(err)
            )
            return None
        self.redirect('/sent.html')

    def do_POST(self):
        if self.path == '/':
            self.handle_mail()
        elif self.path == '/login':
            self.handle_login()
        elif self.path == '/logout':
            self.handle_logout()
        else:
            self.send_error(HTTPStatus.METHOD_NOT_ALLOWED)

    def do_GET(self):
        if self.path != '/' or self.authenticate():
            super().do_GET()

    def do_HEAD(self):
        if self.path != '/' or self.authenticate():
            super().do_HEAD()

    # Override to add cache-control and vary headers and remove server header:
    def send_response(self, code, message=None):
        self.log_request(code)
        self.send_response_only(code, message)
        self.send_header('Date', self.date_time_string())
        if self.path == '/':
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Vary', 'Cookie')


def handle_exit(sig, frame): raise(SystemExit)


# Graceful shutdown on SIGTERM/SIGINT:
signal.signal(signal.SIGTERM, handle_exit)
signal.signal(signal.SIGINT, handle_exit)

try:
    os.chdir(HTML_DIR)
    server = HTTPServer(('', SERVER_PORT), MailRequestHandler)
    server.serve_forever()
except SystemExit:
    server.socket.close()
