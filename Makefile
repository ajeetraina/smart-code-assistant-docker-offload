# Smart Code Assistant Docker Offload Demo
# Makefile for easy deployment and management

.PHONY: help build start stop clean logs test health local offload

# Default target
help:
	@echo "Smart Code Assistant - Docker Offload Demo"
	@echo "==========================================="
	@echo ""
	@echo "Available commands:"
	@echo "  make local     - Start local development environment (small model)"
	@echo "  make offload   - Start Docker Offload environment (large model)"
	@echo "  make build     - Build all Docker images"
	@echo "  make stop      - Stop all services"
	@echo "  make clean     - Stop and remove all containers/volumes"
	@echo "  make logs      - Follow application logs"
	@echo "  make health    - Check service health"
	@echo "  make test      - Run basic functionality tests"
	@echo "  make setup     - Initial setup and dependency check"
	@echo ""
	@echo "Quick Start:"
	@echo "  1. make setup   # Check prerequisites"
	@echo "  2. make local   # Start with local small model"
	@echo "  3. make offload # Scale to Docker Offload (after testing local)"
	@echo ""

# Setup and dependency checking
setup:
	@echo "🔍 Checking prerequisites..."
	@docker --version || (echo "❌ Docker not found. Please install Docker Desktop 4.43.0+" && exit 1)
	@docker-compose --version || (echo "❌ Docker Compose not found" && exit 1)
	@echo "✅ Docker installed: $$(docker --version)"
	@echo "✅ Docker Compose installed: $$(docker-compose --version)"
	@echo "📋 Checking Docker Offload availability..."
	@docker offload version 2>/dev/null && echo "✅ Docker Offload available" || echo "⚠️  Docker Offload not available (optional for local development)"
	@echo ""
	@echo "🎯 Prerequisites check complete!"
	@echo "   Run 'make local' to start with local development"
	@echo "   Run 'make offload' to use Docker Offload (requires setup)"

# Local development environment
local:
	@echo "🚀 Starting local development environment..."
	@echo "   Model: CodeT5-small (220MB)"
	@echo "   Runtime: CPU inference"
	@echo "   Expected startup: 30-60 seconds"
	@echo ""
	docker-compose -f docker-compose.local.yml up --build -d
	@echo ""
	@echo "🎉 Local environment started!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend API: http://localhost:8000"
	@echo "   Health check: http://localhost:8000/health"
	@echo ""
	@echo "💡 Try the example: 'def fibonacci(' for code completion"
	@echo "📊 Use 'make logs' to monitor startup progress"

# Docker Offload environment
offload:
	@echo "☁️  Starting Docker Offload environment..."
	@echo "   Model: CodeLlama-7B (4.1GB)"
	@echo "   Runtime: GPU acceleration (NVIDIA L4)"
	@echo "   Expected startup: 2-3 minutes"
	@echo ""
	@echo "🔧 Checking Docker Offload session..."
	@docker offload status || (echo "Starting Docker Offload session..." && docker offload start --gpu)
	@echo ""
	@echo "🚀 Deploying to Docker Offload..."
	docker-compose -f docker-compose.local.yml -f docker-compose.offload.yml up --build -d
	@echo ""
	@echo "🎉 Docker Offload environment started!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend API: http://localhost:8000"
	@echo "   GPU Status: Check with 'docker run --rm --gpus all nvidia/cuda:12.4.0-runtime-ubuntu22.04 nvidia-smi'"
	@echo ""
	@echo "💡 Try complex generation: 'Create a React shopping cart component'"
	@echo "📊 Use 'make logs' to monitor GPU utilization"

# Build images
build:
	@echo "🔨 Building Docker images..."
	docker-compose -f docker-compose.local.yml build
	@echo "✅ Build complete!"

# Stop services
stop:
	@echo "🛑 Stopping services..."
	docker-compose -f docker-compose.local.yml -f docker-compose.offload.yml down
	@echo "✅ Services stopped"

# Clean up everything
clean: stop
	@echo "🧹 Cleaning up containers, images, and volumes..."
	docker-compose -f docker-compose.local.yml -f docker-compose.offload.yml down -v --rmi all 2>/dev/null || true
	docker system prune -f
	@echo "✅ Cleanup complete"

# View logs
logs:
	@echo "📋 Following application logs (Ctrl+C to exit)..."
	docker-compose -f docker-compose.local.yml logs -f

# Health check
health:
	@echo "🏥 Checking service health..."
	@echo ""
	@echo "Frontend (http://localhost:3000):"
	@curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000 || echo "❌ Frontend not responding"
	@echo ""
	@echo "Backend API (http://localhost:8000/health):"
	@curl -s http://localhost:8000/health | jq . 2>/dev/null || curl -s http://localhost:8000/health || echo "❌ Backend not responding"
	@echo ""
	@echo "System Info (http://localhost:8000/info):"
	@curl -s http://localhost:8000/info | jq . 2>/dev/null || curl -s http://localhost:8000/info || echo "❌ Backend not responding"

# Basic functionality test
test:
	@echo "🧪 Running basic functionality tests..."
	@echo ""
	@echo "1. Testing backend health..."
	@curl -sf http://localhost:8000/health > /dev/null && echo "✅ Backend healthy" || echo "❌ Backend unhealthy"
	@echo ""
	@echo "2. Testing code completion..."
	@curl -sf -X POST http://localhost:8000/complete \
		-H "Content-Type: application/json" \
		-d '{"code":"def hello","max_tokens":50}' > /dev/null && \
		echo "✅ Code completion working" || echo "❌ Code completion failed"
	@echo ""
	@echo "3. Testing frontend..."
	@curl -sf http://localhost:3000 > /dev/null && echo "✅ Frontend accessible" || echo "❌ Frontend not accessible"
	@echo ""
	@echo "🎯 Basic tests complete!"

# Docker Offload specific commands
offload-status:
	@docker offload status

offload-start:
	@docker offload start --gpu

offload-stop:
	@docker offload stop

# Development helpers
dev-backend:
	@echo "🔧 Starting backend in development mode..."
	cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	@echo "🔧 Starting frontend in development mode..."
	cd frontend && npm start

# Documentation
docs:
	@echo "📚 Opening documentation..."
	@echo "Setup Guide: docs/SETUP.md"
	@echo "Decision Guide: docs/decision-guide.md"
	@echo "Benchmarks: docs/benchmarks.md"
	@echo "Repository: https://github.com/ajeetraina/smart-code-assistant-docker-offload"