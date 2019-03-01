#!/usr/bin/env python3

import cgi
import os
import signal
import smtplib
from email.message import EmailMessage
from http import HTTPStatus
from http.server import HTTPServer, SimpleHTTPRequestHandler

SERVER_PORT = int(os.getenv('SERVER_PORT', '8080'))
SMTP_HOST = os.getenv('SMTP_HOST', 'localhost:1025')
SENDER = os.getenv('SENDER', 'Tom Bombadil <tom@example>')
SENT_URL = '/sent.html'
HTML_DIR = os.path.dirname(__file__) + '/html'


class MailRequestHandler(SimpleHTTPRequestHandler):

    def send_mail(self, **kwargs):
        msg = EmailMessage()
        msg['From'] = SENDER
        msg['To'] = kwargs.get('recipient', '')
        msg['Subject'] = kwargs.get('subject', '')
        msg.set_content(kwargs.get('content', ''))
        s = smtplib.SMTP(SMTP_HOST)
        s.send_message(msg)
        s.quit()

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
            self.send_mail(
                recipient=form.getfirst('recipient', ''),
                subject=form.getfirst('subject', ''),
                content=form.getfirst('content', '')
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
