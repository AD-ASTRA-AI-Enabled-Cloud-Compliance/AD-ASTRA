# syntax=docker/dockerfile:1

# Builder stage
FROM python:3.10.12-slim-buster as builder

WORKDIR /build

# Install pip-tools for dependency management
RUN pip install --no-cache-dir pip-tools

# Copy and process requirements
COPY requirements.txt .
RUN pip-compile requirements.txt --output-file requirements.lock

# Install dependencies with pip-tools
RUN pip install --no-cache-dir -r requirements.lock

# Final stage
FROM python:3.10.12-slim-buster

WORKDIR /app

# Add non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy only the lock file and install dependencies
COPY --from=builder /build/requirements.lock .
RUN pip install --no-cache-dir -r requirements.lock && \
    rm requirements.lock

# Copy application code
COPY . .

# Set ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set environment variables
ENV FLASK_APP=app.py \
    FLASK_RUN_PORT=3030 \
    PYTHONUNBUFFERED=1

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3030/health || exit 1

EXPOSE 3030

CMD ["python", "app.py"]
