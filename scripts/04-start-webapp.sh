#!/bin/bash
cd "$(dirname "$0")/../packages/happy-app"
EXPO_PUBLIC_HAPPY_SERVER_URL=http://100.79.113.9:3005 pnpm web
