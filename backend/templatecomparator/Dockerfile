# syntax=docker/dockerfile:experimental
FROM python:3.13-slim AS builder

WORKDIR /app
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt

FROM python:3.13-slim

WORKDIR /app
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY . .

# Add /app and /app/src to PYTHONPATH
ENV PYTHONPATH=/app:/app/src

ENV FLASK_APP=app.py
ENV FLASK_RUN_PORT=3030

EXPOSE 3030

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]
