# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY server.py .
COPY blog_scraper.py .
COPY ai_rewriter.py .
COPY content_manager.py .
COPY create_post.py .
COPY create_insta_post.py .
COPY visitors.json .

# Create directories for data
RUN mkdir -p scraped_content rewritten_content

# Expose port 5000
EXPOSE 5000

# Set environment variable for production
ENV PYTHONUNBUFFERED=1

# Run the application
CMD ["python", "server.py"]
