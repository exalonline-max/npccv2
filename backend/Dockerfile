FROM python:3.11-slim
WORKDIR /app

# install dependencies
COPY requirements.txt ./
# ensure gunicorn is available for the CMD
RUN pip install --no-cache-dir gunicorn && \
	pip install --no-cache-dir -r requirements.txt

# copy app into a backend package directory so `import backend.app` works
COPY . /app/backend

ENV PYTHONUNBUFFERED=1

EXPOSE 5001

CMD ["gunicorn", "-b", "0.0.0.0:5001", "backend.app:app", "--workers", "2"]
