#!/bin/bash
HAPPY_SERVER_URL=http://localhost:3005 node "$(dirname "$0")/auth-server.mjs"
