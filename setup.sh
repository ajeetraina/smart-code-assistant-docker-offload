#!/bin/bash
# Quick setup script for SmolLM2 Code Assistant

echo "🚀 Setting up Simple Code Assistant with SmolLM2..."

# Check if Docker Model Runner is available
echo "Checking Docker Model Runner..."
if ! docker model --help > /dev/null 2>&1; then
    echo "❌ Docker Model Runner not found. Please ensure you have Docker Desktop 4.43+ with Model Runner enabled."
    exit 1
fi

# Pull SmolLM2 model for Mac GPU
echo "📦 Pulling SmolLM2 model (optimized for Mac GPU)..."
docker model pull ai/smollm2:1.7B-Q8_0

if [ $? -eq 0 ]; then
    echo "✅ Model downloaded successfully!"
else
    echo "❌ Failed to download model. Please check your internet connection."
    exit 1
fi

echo "🔧 Starting the application..."

# Build and start services
docker-compose up --build

echo "🎉 Application is running!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8080"
echo "Health Check: http://localhost:8080/health"