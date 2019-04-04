#!/bin/sh

#
# Waits for the given host(s) to be available before executing a given command.
# Tests for availability by using netcat to connect to the hosts via TCP.
#
# Usage:
# ./wait-for-hosts.sh [-q] [-t seconds] [host:port] [...] [-- command args...]
#
# The script accepts multiple `host:port` combinations as arguments or defined
# as WAIT_FOR_HOSTS environment variable, separating the `host:port`
# combinations via spaces.
#
# The status output can be made quiet by adding the `-q` argument or by setting
# the environment variable WAIT_FOR_HOSTS_QUIET to `1`.
#
# The default timeout of 10 seconds can be changed via `-t seconds` argument or
# by setting the WAIT_FOR_HOSTS_TIMEOUT environment variable to the desired
# number of seconds.
#
# The command defined after the `--` argument separator will be executed if all
# the given hosts are reachable.
#
# Copyright 2016, Sebastian Tschan
# https://blueimp.net
#
# Licensed under the MIT license:
# https://opensource.org/licenses/MIT
#

set -e

is_integer() {
  test "$1" -eq "$1" 2> /dev/null
}

set_timeout() {
  if ! is_integer "$1"; then
    printf 'Error: "%s" is not a valid timeout value.\n' "$1" >&2
    return 1
  fi
  TIMEOUT="$1"
}

connect_to_service() {
  nc -w 1 -z "$1" "$2"
}

quiet_echo() {
  if [ "$QUIET" -ne 1 ]; then echo "$@" >&2; fi
}

wait_for_host() {
  HOST="${1%:*}"
  PORT="${1#*:}"
  if ! is_integer "$PORT"; then
    printf 'Error: "%s" is not a valid host:port combination.\n' "$1" >&2
    return 1
  fi
  if [ "$QUIET" -ne 1 ]; then
    printf 'Waiting for %s to become available ... ' "$1" >&2
  fi
  TIME_LIMIT=$(($(date +%s)+TIMEOUT))
  while ! OUTPUT="$(connect_to_service "$HOST" "$PORT" 2>&1)"; do
    if [ "$(date +%s)" -ge "$TIME_LIMIT" ]; then
      quiet_echo 'timeout'
      if [ -n "$OUTPUT" ]; then
        quiet_echo "$OUTPUT"
      fi
      return 1
    fi
    sleep 1
  done
  quiet_echo 'done'
}

QUIET=${WAIT_FOR_HOSTS_QUIET:-0}
set_timeout "${WAIT_FOR_HOSTS_TIMEOUT:-10}"

while [ $# != 0 ]; do
  case "$1" in
    -t)
      set_timeout "$2"
      shift 2
      ;;
    -q)
      QUIET=1
      shift
      ;;
    --)
      shift
      break
      ;;
    *)
      wait_for_host "$1"
      shift
      ;;
  esac
done

for HOST in $WAIT_FOR_HOSTS; do
  wait_for_host "$HOST"
done

exec "$@"
