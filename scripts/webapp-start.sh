#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$REPO/scripts/logs"
SESSION="jappy-orig-webapp"
mkdir -p "$LOG_DIR"

if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "already running"
  exit 0
fi

tmux new-session -d -s "$SESSION" \
  "cd $REPO/packages/happy-app && EXPO_PUBLIC_HAPPY_SERVER_URL=http://100.79.113.9:3005 pnpm web"

for i in $(seq 1 15); do
  lsof -ti :8081 > /dev/null 2>&1 && break
  sleep 1
done

echo "webapp started in tmux '$SESSION' (port 8081)"
