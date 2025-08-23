mkcert-based local HTTPS for dev

This project can optionally serve the frontend (Vite) and backend (Flask) over HTTPS in the dev compose setup.

Quick steps (macOS):

1. Install mkcert and nss if needed:

   brew install mkcert
   mkcert -install

2. Create the `dev_certs` directory at the repo root and generate a cert for `*.lvh.me` and `lvh.me`:

   mkdir -p dev_certs
   mkcert -cert-file dev_certs/dev.crt -key-file dev_certs/dev.key "lvh.me" "*.lvh.me" "localhost"

3. Start the dev services (docker compose will mount the certs):

   docker compose up frontend-dev backend-dev

Notes:
- The dev compose mounts `./dev_certs` into `/certs` in both frontend-dev and backend-dev. When the files `dev.crt` and `dev.key` exist, both Vite and Flask will be started with HTTPS using those files.
- Browsers will trust the cert because `mkcert -install` adds the local CA to your system keychain.
- The frontend proxy and FRONTEND_ORIGIN have been switched to use https://... when certs are present.

If you prefer not to use mkcert, simply run the dev services normally; they will fall back to HTTP.
