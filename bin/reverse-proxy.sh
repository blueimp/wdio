#!/bin/sh

cd "$(dirname "$0")/.."

source .env
HOST=${SERVER_HOST:?}
PORT=${SERVER_PORT:?}

TMPFILE=$(mktemp)

sed "s/127.0.0.1:4444/$HOST:$PORT/;s/:3333/:$PORT/" etc/nginx.conf > "$TMPFILE"

exec nginx -c "$TMPFILE"
