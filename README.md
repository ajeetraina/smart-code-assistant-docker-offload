# Smart Code Assistant with Docker Offload

A progressive AI coding assistant that seamlessly scales from fast local models to powerful Docker Offload models based on your needs.

## 🚀 Quick Start

### Prerequisites

1. **Docker Desktop 4.43+** with Model Runner enabled
2. **Mac with Apple Silicon** (M1/M2/M3) for optimal local performance
3. **At least 8GB RAM** available (12GB+ recommended for large models)

### Three-Tier Model System

#### 🟢 Small Model (Local GPU)
```bash
# Pull small model for fast development
docker model pull ai/smollm2:1.7B-Q8_0

# Start with small model (default)
docker-compose up --build
```

#### 🟠 Medium Model (GPU Accelerated) 
```bash
# Pull medium model for balanced performance
docker model pull ai/qwen2.5-coder:7B-Q4_0

# Override to use medium model
docker-compose up --build -e MODEL_TIER=medium
```

#### 🟣 Large Model (Docker Offload)
```bash
# Pull large model for maximum capability
docker model pull ai/qwen2.5-coder:14B-Q4_K_M

# Scale to Docker Offload
docker-compose -f docker-compose.yml -f docker-compose.offload.yml up --build
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080  
- **Health Check**: http://localhost:8080/health

## 🏗️ Progressive Architecture

### Tier 1: Local Development
```
┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
│  Frontend   │───▶│   Backend   │───▶│   SmolLM2 1.7B │
│ (React/TS)  │    │ (FastAPI)   │    │   🟢 Local GPU  │
│ Port: 3000  │    │ Port: 8080  │    │   1.5GB • Fast  │
└─────────────┘    └─────────────┘    └─────────────────┘
```

### Tier 2: GPU Accelerated  
```
┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
│  Frontend   │───▶│   Backend   │───▶│   Qwen2.5 7B   │
│ (React/TS)  │    │ (FastAPI)   │    │   🟠 GPU Accel  │
│ Port: 3000  │    │ Port: 8080  │    │   4.2GB • Smart │
└─────────────┘    └─────────────┘    └─────────────────┘
```

### Tier 3: Docker Offload
```
┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
│  Frontend   │───▶│   Backend   │───▶│  Qwen2.5 14B   │
│ (React/TS)  │    │ (FastAPI)   │    │ 🟣 Docker Offload│
│ Port: 3000  │    │ Port: 8080  │    │  8.5GB • Expert │
└─────────────┘    └─────────────┘    └─────────────────┘
```

## ⚡ Model Comparison

| Tier | Model | Size | VRAM | Context | Speed | Best For |
|------|-------|------|------|---------|-------|----------|
| 🟢 **Small** | SmolLM2 1.7B | 1.5GB | 2GB | 4K tokens | Very Fast | Quick dev, syntax help |
| 🟠 **Medium** | Qwen2.5 7B | 4.2GB | 6GB | 8K tokens | Fast | Balanced coding tasks |
| 🟣 **Large** | Qwen2.5 14B | 8.5GB | 12GB | 15K tokens | Powerful | Complex generation |

## 🔧 Docker Compose Configuration

### Base Configuration (`docker-compose.yml`)
```yaml
services:
  backend:
    models:
      qwen3-small:
        endpoint_var: MODEL_RUNNER_URL
        model_var: MODEL_RUNNER_MODEL

models:
  qwen3-small:
    model: ai/smollm2:1.7B-Q8_0
    context_size: 4096
  
  qwen3-medium:
    model: ai/qwen2.5-coder:7B-Q4_0
    context_size: 8192
    
  # qwen3-large defined in docker-compose.offload.yml
```

### Offload Override (`docker-compose.offload.yml`)
```yaml
services:
  backend:
    models: !override
      qwen3-large:
        endpoint_var: MODEL_RUNNER_URL
        model_var: MODEL_RUNNER_MODEL

models:
  qwen3-large:
    model: ai/qwen2.5-coder:14B-Q4_K_M
    context_size: 15000
```

## 🎨 Smart UI Features

### Automatic Mode Detection
- **Visual Indicators**: Different icons and colors for each tier
- **Real-time Status**: Shows current model name and performance tier  
- **Connection Monitor**: Live status of Docker Model Runner
- **Performance Info**: Displays model capabilities and context size

### Progressive Enhancement
- **Adaptive Timeouts**: Automatically adjusted based on model size
- **Dynamic Token Limits**: Optimized for each model's capabilities
- **Smart Streaming**: Efficient real-time response generation
- **Error Handling**: Graceful fallbacks with clear error messages

## 🔄 Development Workflow

### 1. Start Fast (Tier 1)
```bash
# Quick development with small model
docker-compose up --build
```

### 2. Scale Smart (Tier 2)  
```bash
# More capable model for complex tasks
# Edit docker-compose.yml to use qwen3-medium
docker-compose up --build
```

### 3. Max Power (Tier 3)
```bash
# Docker Offload for production-level AI
docker-compose -f docker-compose.yml -f docker-compose.offload.yml up --build
```

## 🎯 When to Use Each Tier

### 🟢 Use Small Model When:
- ✅ Quick development and prototyping
- ✅ Simple code completion and syntax checking
- ✅ Fast iteration cycles
- ✅ Limited local resources (8GB RAM)
- ✅ Working offline

### 🟠 Use Medium Model When:
- 🔥 Balanced performance needs
- 🔥 More complex code generation
- 🔥 Better context understanding
- 🔥 Moderate resource availability (12GB RAM)
- 🔥 Production-quality suggestions

### 🟣 Use Large Model When:
- 🚀 Maximum AI capability required
- 🚀 Complex architecture design
- 🚀 Large codebase analysis
- 🚀 Advanced refactoring tasks
- 🚀 Expert-level code generation

## 🚨 Troubleshooting

### Model Not Loading
```bash
# Check available models
docker model list

# Pull specific tier models
docker model pull ai/smollm2:1.7B-Q8_0          # Small
docker model pull ai/qwen2.5-coder:7B-Q4_0      # Medium  
docker model pull ai/qwen2.5-coder:14B-Q4_K_M   # Large

# Verify model info
docker model info ai/smollm2:1.7B-Q8_0
```

### Performance Issues
```bash
# Check system resources
docker system df
docker stats

# Monitor model runner
curl http://localhost:8080/health
curl http://localhost:8080/api/model-info
```

### Switching Between Tiers
```bash
# Stop current setup
docker-compose down

# Switch to different tier
docker-compose -f docker-compose.yml -f docker-compose.offload.yml up --build
```

## 📊 Environment Variables

Docker automatically injects model configuration:

**All Tiers:**
- `MODEL_RUNNER_URL` - Model endpoint URL
- `MODEL_RUNNER_MODEL` - Current model identifier

**Auto-Detection:**
- Backend automatically detects model size from name
- Frontend shows appropriate tier indicators
- Timeouts and limits adjust automatically

## 🎯 What This Demonstrates

This implementation showcases **progressive AI scaling**:

✅ **Start Small** - Begin with fast, lightweight models for development  
✅ **Scale Intelligently** - Move to more capable models as needs grow  
✅ **Max Performance** - Use Docker Offload for expert-level AI assistance  
✅ **Same Interface** - No code changes required between tiers  
✅ **Smart Detection** - Automatic optimization based on current model  
✅ **Production Ready** - Handles everything from dev to production workloads  

Perfect for teams that want to **start fast** and **scale seamlessly** as their AI assistance needs evolve!

## 📄 License

MIT License - feel free to modify and distribute!