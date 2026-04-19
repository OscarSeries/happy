#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$REPO/scripts/logs"
mkdir -p "$LOG_DIR"

if [ -f "$LOG_DIR/auth-server.pid" ]; then
  PID=$(cat "$LOG_DIR/auth-server.pid")
  if kill -0 "$PID" 2>/dev/null; then
    echo "auth-server already running (PID $PID)"
    exit 0
  fi
fi

HAPPY_SERVER_URL=http://localhost:3005 nohup node "$REPO/scripts/auth-server.mjs" > "$LOG_DIR/auth-server.log" 2>&1 &
echo $! > "$LOG_DIR/auth-server.pid"

for i in $(seq 1 5); do
  lsof -ti :3006 > /dev/null 2>&1 && break
  sleep 1
done

echo "Started (PID $(cat "$LOG_DIR/auth-server.pid"))"
