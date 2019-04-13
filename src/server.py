#!/usr/bin/env python3

import cgi
import ntpath
import os
import signal
import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from http import HTTPStatus
from http.server import HTTPServer, SimpleHTTPRequestHandler

SERVER_PORT = int(os.getenv('SERVER_PORT', '8080'))
SMTP_HOST = os.getenv('SMTP_HOST', 'localhost:1025')
SENDER = os.getenv('SENDER', 'Tom Bombadil <tom@example>')
SENT_URL = '/sent.html'
HTML_DIR = os.path.dirname(__file__) + '/html'


class MailRequestHandler(SimpleHTTPRequestHandler):

    def send_mail(self, **kwargs):
        msg = MIMEMultipart()
        msg['From'] = SENDER
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
                'CONTENT_TYPE': self.headers['Content-Type'],
            }
        )

    def do_POST(self):
        if self.path != '/':
            self.send_error(HTTPStatus.METHOD_NOT_ALLOWED)
            return None
        try:
            form = self.get_form_data()
            if 'attachments' in form:
                if type(form['attachments']) is list:
                    attachments = form['attachments']
                else:
                    attachments = [form['attachments']]
            else:
                attachments = []
            self.send_mail(
                recipient=form.getfirst('recipient', ''),
                subject=form.getfirst('subject', ''),
                content=form.getfirst('content', ''),
                attachments=attachments
            )
            self.send_response(HTTPStatus.FOUND)
            self.send_header('Location', SENT_URL)
            self.end_headers()
        except Exception as err:
            self.send_error(
                HTTPStatus.BAD_GATEWAY,
                'Failed to send mail',
                str(err)
            )


def handle_exit(sig, frame): raise(SystemExit)


signal.signal(signal.SIGTERM, handle_exit)
signal.signal(signal.SIGINT, handle_exit)

try:
    os.chdir(HTML_DIR)
    server = HTTPServer(('', SERVER_PORT), MailRequestHandler)
    server.serve_forever()
except SystemExit:
    server.socket.close()
