#!/bin/bash

# Smart Code Assistant Docker Offload Demo - Setup Script
# This script helps you get started with the demo environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║               Smart Code Assistant                        ║
║           Docker Offload Demo Setup                      ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

print_status "Starting setup process..."

# Check if running on supported OS
print_status "Checking operating system..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="Windows"
else
    OS="Unknown"
fi
print_success "Detected OS: $OS"

# Check Docker installation
print_status "Checking Docker installation..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    print_success "Docker found: $DOCKER_VERSION"
    
    # Check Docker version
    if docker version --format '{{.Server.Version}}' | grep -E '^(2[4-9]|[3-9][0-9])\.' &> /dev/null; then
        print_success "Docker version is compatible"
    else
        print_warning "Docker version might be too old. Recommended: 24.0+"
    fi
else
    print_error "Docker not found. Please install Docker Desktop 4.43.0+"
    exit 1
fi

# Check Docker Compose
print_status "Checking Docker Compose..."
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f4 | cut -d',' -f1)
    print_success "Docker Compose found: $COMPOSE_VERSION"
elif docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version --short)
    print_success "Docker Compose (plugin) found: $COMPOSE_VERSION"
    alias docker-compose='docker compose'
else
    print_error "Docker Compose not found"
    exit 1
fi

# Check Docker daemon
print_status "Checking Docker daemon..."
if docker info &> /dev/null; then
    print_success "Docker daemon is running"
else
    print_error "Docker daemon is not running. Please start Docker Desktop"
    exit 1
fi

# Check available memory
print_status "Checking system resources..."
if [[ "$OS" == "macOS" ]]; then
    TOTAL_RAM=$(sysctl -n hw.memsize | awk '{print int($1/1024/1024/1024)}')  
elif [[ "$OS" == "Linux" ]]; then
    TOTAL_RAM=$(free -g | awk '/^Mem:/{print $2}')
else
    TOTAL_RAM="Unknown"
fi

if [[ "$TOTAL_RAM" != "Unknown" ]] && [[ $TOTAL_RAM -ge 8 ]]; then
    print_success "System RAM: ${TOTAL_RAM}GB (sufficient)"
elif [[ "$TOTAL_RAM" != "Unknown" ]]; then
    print_warning "System RAM: ${TOTAL_RAM}GB (minimum 8GB recommended)"
else
    print_warning "Could not determine system RAM"
fi

# Check Docker Offload
print_status "Checking Docker Offload availability..."
if command -v docker-offload &> /dev/null || docker offload version &> /dev/null 2>&1; then
    OFFLOAD_VERSION=$(docker offload version 2>/dev/null | head -1 || echo "Available")
    print_success "Docker Offload found: $OFFLOAD_VERSION"
    OFFLOAD_AVAILABLE=true
else
    print_warning "Docker Offload not available (optional for local development)"
    print_status "To enable Docker Offload:"
    echo "  1. Update Docker Desktop to 4.43.0+"
    echo "  2. Enable in Settings > Beta Features"
    echo "  3. Restart Docker Desktop"
    OFFLOAD_AVAILABLE=false
fi

# Check network connectivity
print_status "Checking network connectivity..."
if ping -c 1 google.com &> /dev/null; then
    print_success "Network connectivity available"
else
    print_warning "Network connectivity issues detected"
fi

# Check available disk space
print_status "Checking disk space..."
if [[ "$OS" == "macOS" ]] || [[ "$OS" == "Linux" ]]; then
    AVAILABLE_SPACE=$(df -h . | awk 'NR==2 {print $4}' | sed 's/G.*//')
    if [[ $AVAILABLE_SPACE -ge 10 ]]; then
        print_success "Available disk space: ${AVAILABLE_SPACE}GB (sufficient)"
    else
        print_warning "Available disk space: ${AVAILABLE_SPACE}GB (minimum 10GB recommended)"
    fi
fi

# Setup options
echo ""
print_status "Setup Options:"
echo "1. Local Development (CPU, small model)"
echo "2. Docker Offload (GPU, large model)" 
echo "3. Both environments"
echo "4. Skip setup (just validation)"
echo ""
read -p "Choose setup option (1-4): " SETUP_CHOICE

case $SETUP_CHOICE in
    1)
        print_status "Setting up local development environment..."
        make local
        ;;
    2)
        if [[ "$OFFLOAD_AVAILABLE" == "true" ]]; then
            print_status "Setting up Docker Offload environment..."
            make offload
        else
            print_error "Docker Offload not available. Please set it up first."
            exit 1
        fi
        ;;
    3)
        print_status "Setting up both environments (starting with local)..."
        make local
        if [[ "$OFFLOAD_AVAILABLE" == "true" ]]; then
            echo ""
            read -p "Start Docker Offload environment now? (y/n): " START_OFFLOAD
            if [[ "$START_OFFLOAD" == "y" ]] || [[ "$START_OFFLOAD" == "Y" ]]; then
                make stop
                make offload
            fi
        fi
        ;;
    4)
        print_status "Skipping automatic setup"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Final status
echo ""
print_success "Setup complete!"
echo ""
print_status "Next steps:"
echo "  • Open http://localhost:3000 in your browser"
echo "  • Try the example prompts in the interface"
echo "  • Check docs/SETUP.md for detailed instructions"
echo "  • Run 'make help' for available commands"
echo ""
print_status "Useful commands:"
echo "  make health  - Check service status"
echo "  make logs    - View application logs"
echo "  make test    - Run functionality tests"
echo "  make stop    - Stop all services"
echo ""
print_success "Happy coding with Docker Offload! 🚀"