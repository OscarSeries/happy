#!/bin/bash
tmux kill-session -t "jappy-orig-webapp" 2>/dev/null
lsof -ti :8081 | xargs kill -9 2>/dev/null || true
echo "stopped"
