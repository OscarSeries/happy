#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$REPO/scripts/logs"
mkdir -p "$LOG_DIR"

if [ -f "$LOG_DIR/server.pid" ]; then
  PID=$(cat "$LOG_DIR/server.pid")
  if kill -0 "$PID" 2>/dev/null; then
    echo "happy-server already running (PID $PID)"
    exit 0
  fi
fi

echo "Starting happy-server (standalone)..."
cd "$REPO/packages/happy-server"
unset PORT

pnpm exec tsx --env-file=.env.dev ./sources/standalone.ts migrate >> "$LOG_DIR/server.log" 2>&1

nohup pnpm exec tsx --env-file=.env.dev ./sources/standalone.ts serve >> "$LOG_DIR/server.log" 2>&1 &
echo $! > "$LOG_DIR/server.pid"

for i in $(seq 1 10); do
  lsof -ti :3005 > /dev/null 2>&1 && break
  sleep 1
done

echo "Started (PID $(cat "$LOG_DIR/server.pid"))"
