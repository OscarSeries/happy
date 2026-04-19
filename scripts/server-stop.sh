#!/bin/bash
REPO="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$REPO/scripts/logs/server.pid"

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  kill -9 "$PID" 2>/dev/null
  rm -f "$PID_FILE"
fi

pkill -9 -f "standalone.ts" 2>/dev/null || true
lsof -ti :3005 | xargs kill -9 2>/dev/null || true
lsof -ti :9090 | xargs kill -9 2>/dev/null || true
sleep 1
echo "stopped"
