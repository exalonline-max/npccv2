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
COPY . /app

# Default PORT; Fly sets this at runtime
ENV PORT=5001
EXPOSE ${PORT}

# Use a shell form so $PORT expands. Bind to backend.app:app
CMD ["sh", "-c", "exec gunicorn backend.app:app -b 0.0.0.0:${PORT} --workers 2 --log-level info"]
