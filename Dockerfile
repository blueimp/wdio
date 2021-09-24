FROM alpine:3.14

RUN apk --no-cache add \
  tini \
  nodejs \
  npm \
  ffmpeg \
  android-tools \
  && npm install -g \
  npm@latest \
  # Clean up obsolete files:
  && rm -rf \
  /tmp/* \
  /root/.npm

WORKDIR /usr/lib/wdio
COPY package.json package-lock.json ./
RUN npm install --production \
  # Clean up obsolete files:
  && rm -rf \
  /tmp/* \
  /root/.npm
# Set NODE_PATH to be able to require installed packages:
ENV NODE_PATH=/usr/lib/wdio/node_modules
# Extend path to be able to run installed binaries:
ENV PATH=$PATH:/usr/lib/wdio/node_modules/.bin

COPY bin/wait-for-hosts.sh /usr/local/bin/wait-for-hosts

WORKDIR /app

# Avoid permission issues with host mounts by assigning a user/group with
# uid/gid 1000 (usually the ID of the first user account on GNU/Linux):
RUN adduser -D -u 1000 wdio
USER wdio

ENTRYPOINT ["tini", "-g", "--", "wait-for-hosts", "--", "wdio"]
