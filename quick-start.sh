#!/bin/bash

# Smart Code Assistant Docker Offload Demo - One-Click Quick Start
# This script sets up and runs the demo with minimal user interaction

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
   ____                       _      ____          _        
  / ___| _ __ ___   __ _ _ __| |_   / ___|___   __| | ___   
  \___ \| '_ ` _ \ / _` | '__| __| | |   / _ \ / _` |/ _ \  
   ___) | | | | | | (_| | |  | |_  | |__| (_) | (_| |  __/  
  |____/|_| |_| |_|\__,_|_|   \__|  \____\___/ \__,_|\___|  
                                                           
   _             _     _              _                    
  / \   ___ ___(_)___| |_ __ _ _ __ | |_                   
 /   \ / __/ __| / __| __/ _` | '_ \| __|                  
/ /^\ \\__ \__ \ \__ \ || (_| | | | | |_                   
\/   \/|___/___/_|___/\__\__,_|_| |_|\__|                  
                                                         
        Docker Offload Demo Quick Start                 
EOF
echo -e "${NC}"

echo -e "${BLUE}[INFO]${NC} Starting Smart Code Assistant Docker Offload Demo..."
echo ""

# Check prerequisites
echo -e "${BLUE}[INFO]${NC} Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Docker not found. Please install Docker Desktop 4.43.0+"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Docker daemon not running. Please start Docker Desktop"
    exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} Prerequisites check passed"

# Ask user what they want to do
echo ""
echo -e "${BLUE}[INFO]${NC} What would you like to do?"
echo "1. Start with Local Development (small model, CPU)"
echo "2. Start with Docker Offload (large model, GPU) - requires Docker Offload setup"
echo "3. Just show me the instructions"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo -e "${BLUE}[INFO]${NC} Starting local development environment..."
        echo -e "${YELLOW}[NOTE]${NC} This will download a small model (~220MB) and start the services"
        echo ""
        
        # Start local environment
        if command -v make &> /dev/null; then
            make local
        else
            docker-compose -f docker-compose.local.yml up --build -d
        fi
        
        echo ""
        echo -e "${GREEN}[SUCCESS]${NC} Local environment started!"
        echo ""
        echo -e "${BLUE}Next steps:${NC}"
        echo "  1. Open http://localhost:3000 in your browser"
        echo "  2. Try basic code completion (e.g., 'def fibonacci(')"
        echo "  3. Compare with Docker Offload later using 'make offload'"
        echo ""
        ;;
        
    2)
        echo -e "${BLUE}[INFO]${NC} Checking Docker Offload availability..."
        
        if ! docker offload version &> /dev/null; then
            echo -e "${RED}[ERROR]${NC} Docker Offload not available"
            echo "Please enable Docker Offload in Docker Desktop Settings > Beta Features"
            exit 1
        fi
        
        echo -e "${BLUE}[INFO]${NC} Starting Docker Offload environment..."
        echo -e "${YELLOW}[NOTE]${NC} This will download a large model (~4GB) and provision GPU resources"
        echo -e "${YELLOW}[NOTE]${NC} First startup may take 3-5 minutes"
        echo ""
        
        # Start Docker Offload
        docker offload start --gpu || true
        
        if command -v make &> /dev/null; then
            make offload
        else
            docker-compose -f docker-compose.local.yml -f docker-compose.offload.yml up --build -d
        fi
        
        echo ""
        echo -e "${GREEN}[SUCCESS]${NC} Docker Offload environment started!"
        echo ""
        echo -e "${BLUE}Next steps:${NC}"
        echo "  1. Open http://localhost:3000 in your browser"
        echo "  2. Try advanced code generation (e.g., 'Create a React shopping cart')"
        echo "  3. Compare performance metrics with local development"
        echo ""
        ;;
        
    3)
        echo ""
        echo -e "${BLUE}=== Manual Setup Instructions ===${NC}"
        echo ""
        echo -e "${GREEN}1. Local Development:${NC}"
        echo "   make local                    # Start with small model (CPU)"
        echo "   # or"
        echo "   docker-compose -f docker-compose.local.yml up --build"
        echo ""
        echo -e "${GREEN}2. Docker Offload:${NC}"
        echo "   docker offload start --gpu    # Start Docker Offload session"
        echo "   make offload                  # Deploy large model (GPU)"
        echo "   # or"
        echo "   docker-compose -f docker-compose.local.yml -f docker-compose.offload.yml up --build"
        echo ""
        echo -e "${GREEN}3. Useful Commands:${NC}"
        echo "   make help                     # Show all available commands"
        echo "   make health                   # Check service status"
        echo "   make logs                     # View application logs"
        echo "   make test                     # Run functionality tests"
        echo "   make stop                     # Stop all services"
        echo ""
        echo -e "${GREEN}4. Access the Application:${NC}"
        echo "   Frontend:  http://localhost:3000"
        echo "   Backend:   http://localhost:8000"
        echo "   API docs:  http://localhost:8000/docs"
        echo ""
        exit 0
        ;;
        
    *)
        echo -e "${RED}[ERROR]${NC} Invalid choice"
        exit 1
        ;;
esac

# Wait for services to be ready
echo -e "${BLUE}[INFO]${NC} Waiting for services to be ready..."
count=0
max_attempts=60

while [ $count -lt $max_attempts ]; do
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        break
    fi
    sleep 2
    ((count+=2))
    echo -n "."
done

echo ""

if [ $count -ge $max_attempts ]; then
    echo -e "${YELLOW}[WARNING]${NC} Services are taking longer than expected to start"
    echo "Check the logs with: make logs"
else
    echo -e "${GREEN}[SUCCESS]${NC} Services are ready!"
fi

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${BLUE}🚀 Your Smart Code Assistant is now running at:${NC}"
echo "   http://localhost:3000"
echo ""
echo -e "${BLUE}📖 What you can do:${NC}"
echo "  • Try code completion examples in the interface"
echo "  • Compare local vs Docker Offload performance"
echo "  • Check real-time performance metrics"
echo "  • Explore different model capabilities"
echo ""
echo -e "${BLUE}📚 Learn more:${NC}"
echo "  • Setup Guide: docs/SETUP.md"
echo "  • Decision Guide: docs/decision-guide.md"
echo "  • Performance Benchmarks: docs/benchmarks.md"
echo ""
echo -e "${BLUE}💡 Pro tip:${NC} Run 'make help' to see all available commands"
echo ""
echo "Happy coding! 🐳✨"