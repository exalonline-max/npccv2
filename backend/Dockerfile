FROM python:3.11-slim

WORKDIR /app

# Install minimal build deps and cleanup lists
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency manifest and install
COPY requirements.txt pyproject.toml /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
# Copy source into a temporary app path, then ensure a /app/backend package
# exists so the gunicorn invocation `backend.app:app` can import the package
# regardless of whether the build context was the repo root or the backend folder.
COPY . /app

# If the build context was the backend folder (running `cd backend && flyctl deploy`),
# files will be at /app/* (not inside a `backend/` directory). If the repo root was the
# build context, /app/backend will already exist. Only move files into /app/backend when
# it does not already exist to avoid creating /app/backend/backend.
RUN if [ -d /app/backend ]; then \
            echo "/app/backend exists: skipping move"; \
        else \
            mkdir -p /app/backend && for f in /app/*; do \
                if [ "$f" != "/app/backend" ]; then \
                    mv "$f" /app/backend/ || true; \
                fi; \
            done; \
        fi

# Default PORT; Fly sets this at runtime
ENV PORT=5001
EXPOSE ${PORT}

# Use a shell form so $PORT expands. Bind to backend.app:app
CMD ["sh", "-c", "exec gunicorn backend.app:app -b 0.0.0.0:${PORT} --workers 2 --log-level info"]
