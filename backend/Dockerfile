FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend
ENV PYTHONPATH=/app/backend
EXPOSE 8080
CMD ["gunicorn", "backend.app:create_app()", "-b", "0.0.0.0:8080", "--worker-class", "gthread"]
