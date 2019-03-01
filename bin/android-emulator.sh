#!/bin/sh

#
# Starts the Android virtual device with a writeable filesystem.
# If the -hosts option is provided, replaces /etc/hosts on the device with the
# given hosts file.
# If no -avd option is given, starts the first AVD in the list.
#
# Usage: ./android-emulator.sh [-hosts file] [emulator options]
#
# Copyright 2019, Sebastian Tschan
# https://blueimp.net
#
# Licensed under the MIT license:
# https://opensource.org/licenses/MIT
#

set -e

if [ -z "$ANDROID_HOME" ]; then
  echo 'Error: ANDROID_HOME is not defined.' >&2
  exit 1
fi

# shellcheck disable=SC2139
alias emulator="$ANDROID_HOME/emulator/emulator"
# shellcheck disable=SC2139
alias adb="$ANDROID_HOME/platform-tools/adb"

# Echos first AVD listed
avd() {
  emulator -list-avds | head -n 1
}

is_boot_completed() {
  test "$(adb shell getprop sys.boot_completed | tr -d '\r')" = 1
}

has_avd_arg() {
  while test $# -gt 0; do
    test "$1" = -avd && return 0
    shift
  done
  return 1
}

update_hosts_file() {
  echo 'Waiting for device to be ready ...'
  adb wait-for-device
  while ! is_boot_completed; do
    sleep 1
  done
  adb root
  adb remount
  adb push "$1" /etc/hosts
  adb unroot
}

shutdown() {
  kill "$PID"
}

# Initiate a shutdown on SIGINT and SIGTERM:
trap 'shutdown; exit' INT TERM

if [ "$1" = -hosts ]; then
  HOSTS_FILE=$2
  shift 2
fi

if ! has_avd_arg "$@"; then
  set -- -avd "$(avd)" "$@"
fi

set -- -writable-system "$@"

emulator "$@" & PID=$!

if [ -n "$HOSTS_FILE" ]; then
  update_hosts_file "$HOSTS_FILE"
fi

wait "$PID"
