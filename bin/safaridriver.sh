#!/bin/sh

if [ "$1" = -t ]; then
  BIN='/Applications/Safari Technology Preview.app/Contents/MacOS/safaridriver'
  SUFFIX=' (Safari Technology Preview)'
  shift
else
  BIN=safaridriver
  SUFFIX=
fi

echo "Starting safaridriver$SUFFIX on 127.0.0.1:3333 ..." >&2
"$BIN" -p 3333 &

NGINX_CONF="$(cd "$(dirname "$0")/../etc"; pwd)/nginx.conf"

echo 'Starting nginx on 127.0.0.1:4444 ...' >&2
nginx -c "$NGINX_CONF"
