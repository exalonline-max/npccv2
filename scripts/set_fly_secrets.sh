#!/bin/sh
set -e

if ! command -v flyctl >/dev/null 2>&1; then
  echo "flyctl is required. Install it first: https://fly.io/docs/hands-on/install-flyctl/"
  exit 1
fi

if [ -z "$1" ]; then
  echo "Usage: $0 <DATABASE_URL> [JWT_SECRET]"
  exit 1
fi

DATABASE_URL="$1"
JWT_SECRET="${2:-$(openssl rand -hex 32)}"

echo "Setting Fly secrets..."
flyctl secrets set DATABASE_URL="$DATABASE_URL" JWT_SECRET_KEY="$JWT_SECRET"

echo "Secrets set. Keep the JWT_SECRET_KEY stored securely if you need it later: $JWT_SECRET"
