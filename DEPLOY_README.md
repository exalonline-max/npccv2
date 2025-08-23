Deployment notes — Hetzner VPS

Required GitHub secrets (Settings → Secrets → Actions):
- DEPLOY_SSH_KEY: private SSH key that has access to the VPS (no passphrase recommended for CI). Keep the public key on the VPS in ~/.ssh/authorized_keys for the deploy user.
- DEPLOY_USER: the SSH user on the VPS (e.g., ubuntu or your user)
- DEPLOY_HOST: the VPS public IP or hostname
- DEPLOY_PATH: absolute path to the repo on the VPS (e.g., /home/ubuntu/npccv2)

How the workflow works
- On push to `main`, GitHub Actions will start an SSH agent with the private key, SSH to the VPS, pull the latest code, and run `docker compose up -d --remove-orphans`.

Pre-deploy checklist on the VPS
1) Add the public key for your CI user to `~DEPLOY_USER/.ssh/authorized_keys`.
2) Clone the repo and create `.env` with production values.
3) Ensure Docker & docker compose plugin are installed (see `scripts/bootstrap-hetzner.sh`).
4) Ensure the `DEPLOY_PATH` points to the repo root on the VPS.

Triggering a deploy
- Push to `main` or merge a PR into main. The workflow will run and attempt to update the VPS.

Security notes
- Keep the private key secret in GitHub.
- Do not expose Postgres port publicly; use firewall rules (ufw) or a reverse proxy.
