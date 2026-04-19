#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
SESSION="jappy-orig-claude"

if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "already running"
  exit 0
fi

tmux new-session -d -s "$SESSION" \
  "HAPPY_SERVER_URL=http://localhost:3005 HAPPY_HOME_DIR=~/.happy-dev happy-dev"

echo "happy-dev started in tmux session '$SESSION'"
