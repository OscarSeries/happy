#!/bin/bash
LOG_DIR="$(cd "$(dirname "$0")" && pwd)/logs"
PID_FILE="$LOG_DIR/auth-server.pid"
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  kill "$PID" 2>/dev/null && rm -f "$PID_FILE" && echo "stopped" || echo "not running"
else
  lsof -ti :3006 | xargs kill -9 2>/dev/null && echo "stopped" || echo "not running"
fi
