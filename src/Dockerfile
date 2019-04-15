FROM python:alpine

# Install itsdangerous for secure client-side sessions:
RUN pip3 install itsdangerous && rm -rf /root/.cache

# Disable buffering to view logs via docker:
ENV PYTHONUNBUFFERED=1

COPY server.py /srv/

USER nobody

CMD ["/srv/server.py"]
