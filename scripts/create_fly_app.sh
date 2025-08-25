#!/bin/sh
set -e

if ! command -v flyctl >/dev/null 2>&1; then
  echo "flyctl is required. Install: https://fly.io/docs/hands-on/install-flyctl/"
  exit 1
fi

if [ -z "$1" ]; then
  echo "Usage: $0 <app-name> [region]
Example: $0 npccv2-backend iad"
  exit 1
fi

APP_NAME="$1"
REGION="${2:-iad}"

echo "Creating fly app '$APP_NAME' in region $REGION..."
fly apps create "$APP_NAME" --region "$REGION" || {
  echo "App creation failed or app already exists. Continuing..."
}

echo "Updating backend/fly.toml to use app = \"$APP_NAME\""
if [ -f backend/fly.toml ]; then
  # replace app line or add it
  if grep -q '^app\s*=\s*"' backend/fly.toml; then
    sed -i.bak "s/^app\s*=.*/app = \"$APP_NAME\"/" backend/fly.toml
  else
    sed -i.bak "1s;^;app = \"$APP_NAME\"\n;" backend/fly.toml
  fi
else
  cat > backend/fly.toml <<EOF
app = "$APP_NAME"

[build]
  image = ""

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
EOF
fi

echo "App creation/upsert complete. You can now deploy with: (cd backend && flyctl deploy)"
