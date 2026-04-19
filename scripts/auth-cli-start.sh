#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
SESSION="jappy-orig-auth-cli"

if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "already running"
  exit 0
fi

tmux new-session -d -s "$SESSION" \
  "HAPPY_SERVER_URL=http://localhost:3005 HAPPY_HOME_DIR=~/.happy-dev happy-dev auth login --mobile; tmux kill-session -t $SESSION"

echo "happy-dev auth login started in tmux '$SESSION'"
echo "앱에서 승인하면 자동 종료됩니다"
