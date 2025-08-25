#!/bin/sh
set -e

if ! command -v flyctl >/dev/null 2>&1; then
  echo "flyctl is required. Install it first: https://fly.io/docs/hands-on/install-flyctl/"
  exit 1
fi

echo "Creating Fly Postgres cluster 'npccv2-db' (interactive)..."
flyctl postgres create --name npccv2-db --region iad

echo "When the DB is ready, run: flyctl postgres attach --app npccv2-backend npccv2-db"
