#!/bin/sh
set -e

if ! command -v flyctl >/dev/null 2>&1; then
  echo "flyctl is required. Install: https://fly.io/docs/hands-on/install-flyctl/"
  exit 1
fi

if [ -z "$1" ]; then
  echo "Usage: $0 <app-name>"
  exit 1
fi

APP_NAME="$1"

echo "Creating deploy token for app: $APP_NAME"
OUT=$(fly tokens create deploy --app "$APP_NAME" --name github-actions --json)
TOKEN=$(echo "$OUT" | jq -r '.[0].token // .token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "Failed to parse token from fly output:" >&2
  echo "$OUT" >&2
  exit 1
fi

echo "Token created. Copy and add it to GitHub Secrets as FLY_API_TOKEN:"
echo
echo "$TOKEN"
