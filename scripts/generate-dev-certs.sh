#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="$(pwd)/dev_certs"
mkdir -p "$OUT_DIR"

if ! command -v mkcert >/dev/null 2>&1; then
  echo "mkcert not found. Install with: brew install mkcert" >&2
  exit 2
fi

echo "Installing mkcert root CA (may prompt for permission)..."
mkcert -install

echo "Generating certs into $OUT_DIR"
mkcert -cert-file "$OUT_DIR/dev.crt" -key-file "$OUT_DIR/dev.key" "lvh.me" "*.lvh.me" "localhost"

echo "Done. You can now run: docker compose up frontend-dev backend-dev"
