#!/bin/sh

echo 'Starting geckodriver on 127.0.0.1:3333 ...' >&2
geckodriver -p 3333 & pid_geckodriver=$!

NGINX_CONF="$(cd "$(dirname "$0")/../etc"; pwd)/nginx.conf"

echo 'Starting nginx on 127.0.0.1:4444 ...' >&2
nginx -c "$NGINX_CONF" & pid_nginx=$!

trap "kill $pid_nginx; kill $pid_geckodriver; exit" INT TERM

wait
