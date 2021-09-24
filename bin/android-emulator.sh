#!/bin/sh

#
# Starts an Android virtual device with a writeable filesystem.
# If the -hosts option is provided, replaces /etc/hosts on the device with the
# given hosts file.
# If the -return option is given, returns to the caller when the emulator is
# ready, otherwise waits for the emulator process to stop.
# If no emulator -avd option is given, starts the first AVD in the list.
# If no existing AVD is available, creates a new one.
#
# Usage: ./android-emulator.sh [-hosts file] [-return] [-- emulator options]
#
# Copyright 2019, Sebastian Tschan
# https://blueimp.net
#
# Licensed under the MIT license:
# https://opensource.org/licenses/MIT
#

set -e

DEVICE_ID='pixel'
SYSTEM_IMAGE='system-images;android-[0-9]*;google_apis;x86\>'
SDCARD='512M'

if [ -z "$ANDROID_HOME" ]; then
  echo 'Error: ANDROID_HOME is not defined.' >&2
  exit 1
fi

adb() {
  "$ANDROID_HOME/platform-tools/adb" "$@"
}

emulator() {
  "$ANDROID_HOME/emulator/emulator" "$@"
}

avdmanager() {
  "$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager" "$@"
}

sdkmanager() {
  "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" "$@"
}

normalize() {
  echo "$1" | sed 's/[^a-z A-Z 0-9._-]/-/g'
}

get_avd() {
  emulator -list-avds | head -n 1
}

get_image() {
  sdkmanager --list | grep -o "$SYSTEM_IMAGE" | tail -1
}

download_image() {
  sdkmanager "$1"
}

create_avd() {
  echo 'Downloading system image ...'
  download_image "$1"
  echo 'System image downloaded.'
  echo 'Creating Android Virtual Device ...'
  avdmanager create avd \
    --name "$(normalize "$DEVICE_ID-${1#*;}")" \
    --package "$1" \
    --device "$DEVICE_ID" \
    --sdcard "$SDCARD"
  echo 'Virtual Device created.'
}

has_arg() {
  while test $# -gt 0; do
    test "$1" = "$ARG" && return 0
    shift
  done
  return 1
}

has_system_prop() {
  test "$(adb shell getprop "$1" | tr -d '\r')" = "$2"
}

wait_for_device() {
  echo 'Waiting for device to be ready ...'
  adb wait-for-device
  while ! has_system_prop sys.boot_completed 1; do
    sleep 1
  done
  echo 'Device ready.'
}

update_hosts_file() {
  adb root
  wait_for_device
  adb remount
  adb push "$1" /etc/hosts
  adb unroot
  wait_for_device
}

if [ "$1" = -hosts ]; then
  HOSTS_FILE=$2
  shift 2
fi

if [ "$1" = -return ]; then
  RETURN=true
  shift
fi

if [ "$1" = -- ]; then
  shift
fi

if ! ARG=-avd has_arg "$@"; then
  if [ -z "$(get_avd)" ]; then
    create_avd "$(get_image)"
  fi
  set -- -avd "$(get_avd)" "$@"
fi

if [ -n "$HOSTS_FILE" ]; then
  set -- -writable-system "$@"
fi

emulator "$@" & PID=$!

wait_for_device

if [ -n "$HOSTS_FILE" ]; then
  update_hosts_file "$HOSTS_FILE"
fi

if [ "$RETURN" = true ]; then
  exit
fi

wait "$PID"
