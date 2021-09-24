#!/bin/sh

SCREEN='Capture screen'

if [ -z "$1" ]; then
  OUTPUT=$(ffmpeg -f avfoundation -list_devices true -i - 2>&1 | grep "$SCREEN")
  if [ "$(echo "$OUTPUT" | grep -c ^)" -gt 1 ]; then
    echo 'Please select the input device by entering its [index] number:' >&2
    echo "$OUTPUT" >&2
    read -r INDEX
  fi
else
  INDEX=$1
fi

echo 'Starting mjpeg-server on 127.0.0.1:9000 ...' >&2
exec mjpeg-server -a 127.0.0.1:9000 -- ffmpeg \
  -loglevel error \
  -probesize 32 \
  -fpsprobesize 0 \
  -analyzeduration 0 \
  -fflags nobuffer \
  -f avfoundation \
  -capture_cursor 1 \
  -r "${FPS:-15}" \
  -pixel_format yuyv422 \
  -i "${INDEX:-$SCREEN}" \
  -f mpjpeg \
  -q "${QUALITY:-2}" \
  -
