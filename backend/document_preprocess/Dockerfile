# syntax=docker/dockerfile:1
FROM python:3.10-slim-buster

# Set working directory
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of the app
COPY . .

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_PORT=3030

# Expose port (matches your dev config)
EXPOSE 3030

# Run Flask via Python entrypoint (your modular setup)
CMD ["python", "app.py"]
