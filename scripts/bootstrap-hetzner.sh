#!/usr/bin/env bash
set -euo pipefail

echo "Bootstrap starting — you may be prompted for sudo."

if ! command -v docker >/dev/null 2>&1; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
fi

if ! dpkg -s docker-compose-plugin >/dev/null 2>&1; then
  echo "Installing docker compose plugin..."
  sudo apt-get update
  sudo apt-get install -y docker-compose-plugin
fi

echo "Adding current user to docker group (you may need to log out/in)"
sudo usermod -aG docker $USER || true

# Add small swap if no swap exists
if ! swapon --show | grep -q '/swapfile' >/dev/null 2>&1; then
  echo "Creating 1GB swapfile..."
  sudo fallocate -l 1G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=1024
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "Bootstrap steps done. Next actions:"
echo "1) Place your repo on the VPS (git clone or scp)."
echo "   Example: git clone git@github.com:YOUR_ORG/REPO.git ~/npccv2"
echo "2) Create a .env file in the repo with production values (DATABASE_URL, SECRET_KEY, JWT_SECRET_KEY, COOKIE_DOMAIN, etc)."
echo "3) From the repo root run: docker compose up -d"

echo "If you want me to, I can prepare a GitHub Actions workflow (already added) — set secrets and push to main to trigger deploy."
