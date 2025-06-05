# backend/Dockerfile

FROM python:3.10-slim-bookworm

WORKDIR /app

# Install OCR and PDF packages with minimal system packages
RUN apt-get update && apt-get upgrade -y && apt-get install --no-install-recommends -y \
    poppler-utils \
    tesseract-ocr \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 3001

CMD ["python", "main.py"]
