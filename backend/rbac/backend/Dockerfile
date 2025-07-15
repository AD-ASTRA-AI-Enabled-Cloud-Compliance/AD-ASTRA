# Use official Python image as base
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy application files
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the correct port
EXPOSE 3010

# Set environment variables
ENV PORT=3010

# Run the Flask app using Python
CMD ["python", "main.py"]
