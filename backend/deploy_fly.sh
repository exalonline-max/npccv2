#!/bin/sh
# Simple helper: build the image and deploy with flyctl
set -e

if ! command -v flyctl >/dev/null 2>&1; then
  echo "flyctl not found. Install from https://fly.io/docs/hands-on/install-flyctl/"
  exit 1
fi

cd "$(dirname "$0")"

echo "Building and deploying to Fly.io..."
flyctl deploy --config fly.toml

echo "Deployed. Run: flyctl logs -a npccv2-backend -f"
