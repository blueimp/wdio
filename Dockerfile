FROM alpine:3.9

RUN echo '@edgetesting http://dl-cdn.alpinelinux.org/alpine/edge/testing' \
  >> /etc/apk/repositories

RUN apk --no-cache add \
    nodejs \
    npm \
    ffmpeg \
    android-tools@edgetesting \
  && npm install -g \
    npm@latest \
    @wdio/cli@^5.7.2 \
    @wdio/local-runner@^5.7.2 \
    @wdio/mocha-framework@^5.7.2 \
    @wdio/spec-reporter@^5.7.2 \
    @wdio/sync@^5.7.2 \
    chai@^4.2.0 \
    mailhog@^3.0.0 \
    uuid@^3.3.2 \
    wdio-screen-commands@^1.2.0 \
    webdriverio@^5.7.2 \
  # Clean up obsolete files:
  && rm -rf \
    /tmp/* \
    /root/.npm

# Set NODE_PATH to be able to require globally installed packages:
ENV NODE_PATH=/usr/lib/node_modules

# Avoid permission issues with host mounts by assigning a user/group with
# uid/gid 1000 (usually the ID of the first user account on GNU/Linux):
RUN adduser -D -u 1000 wdio

USER wdio

WORKDIR /home/wdio

COPY bin/wait-for.sh /usr/local/bin/wait-for

ENTRYPOINT ["wait-for", "--", "wdio"]
