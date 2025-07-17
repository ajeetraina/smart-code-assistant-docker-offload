# Smart Code Assistant with Docker Offload

A clean AI coding assistant that seamlessly scales from local models to powerful cloud models using Docker Offload capabilities.

## 🚀 Quick Start

### Prerequisites

1. **Docker Desktop 4.43+** with Model Runner enabled
2. **Mac with Apple Silicon** (M1/M2/M3) for optimal local GPU performance
3. **At least 8GB RAM** available

### Local Development (Small Model)

Start with fast local SmolLM2 for development:

```bash
# Pull the small local model
docker model pull ai/smollm2:1.7B-Q8_0

# Start locally
docker-compose up --build
```

### Docker Offload (Large Model)

Scale up to powerful 14B model with Docker Offload:

```bash
# Pull the large offload model
docker model pull ai/qwen2.5-coder:14B-Q4_K_M

# Start with offload override
docker-compose -f docker-compose.yml -f docker-compose.offload.yml up --build
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

## 🏗️ Architecture

### Local Mode
```
┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
│  Frontend   │───▶│   Backend   │───▶│   SmolLM2 1.7B │
│ (React/TS)  │    │ (FastAPI)   │    │   Local Mac GPU │
│ Port: 3000  │    │ Port: 8080  │    │   Fast & Light  │
└─────────────┘    └─────────────┘    └─────────────────┘
```

### Docker Offload Mode
```
┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
│  Frontend   │───▶│   Backend   │───▶│ Qwen2.5-Coder  │
│ (React/TS)  │    │ (FastAPI)   │    │     14B Model   │
│ Port: 3000  │    │ Port: 8080  │    │ Docker Offload  │
└─────────────┘    └─────────────┘    └─────────────────┘
```

## ⚡ Model Comparison

| Aspect | Local (SmolLM2) | Docker Offload (Qwen2.5) |
|--------|-----------------|---------------------------|
| **Model Size** | 1.7B parameters | 14B parameters |
| **Memory Usage** | ~2GB RAM | ~8.5GB |
| **Speed** | Very Fast | Fast |
| **Code Quality** | Good | Excellent |
| **Context Size** | 4,096 tokens | 15,000 tokens |
| **Best For** | Quick dev tasks | Complex code generation |

## 🔧 Docker Compose Configuration

### Base Configuration (`docker-compose.yml`)
```yaml
services:
  backend:
    models:
      - qwen3-small

models:
  qwen3-small:
    model: ai/smollm2:1.7B-Q8_0
    context_size: 4096
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

## 🎨 Features

### Smart Mode Detection
- **Automatic Detection** - Frontend shows current mode (Local/Offload)
- **Visual Indicators** - Different icons and colors for each mode
- **Model Information** - Displays current model name and size
- **Status Monitoring** - Real-time connection status

### Real-time Streaming
- **Token Streaming** - Watch responses generate in real-time
- **Error Handling** - Graceful fallbacks and clear error messages
- **Dynamic Timeouts** - Adjusted based on model size

### Clean Interface
- **No Clutter** - Simple chat interface without demo complexity
- **Responsive Design** - Works on different screen sizes
- **Performance Indicators** - Shows local vs offload mode clearly

## 🔄 Development Workflow

### 1. Start Local for Development
```bash
# Fast iteration with small model
docker-compose up --build
```

### 2. Test with Offload for Production
```bash
# Scale up when you need more power
docker-compose -f docker-compose.yml -f docker-compose.offload.yml up --build
```

### 3. Switch Models Easily
Change models by updating the compose files:

**Local Options:**
- `ai/smollm2:1.7B-Q8_0` - Fastest (recommended)
- `ai/smollm2:1.7B-Q4_0` - Smaller size
- `ai/llama3.2:1B-Q8_0` - Alternative

**Offload Options:**
- `ai/qwen2.5-coder:14B-Q4_K_M` - Coding specialist
- `ai/qwen3:30B-A3B-Q4_K_M` - Maximum power
- `ai/llama3.1:70B-Q4_K_M` - General purpose

## 🚨 Troubleshooting

### Model Not Loading
```bash
# Check available models
docker model list

# Pull required model
docker model pull ai/smollm2:1.7B-Q8_0
docker model pull ai/qwen2.5-coder:14B-Q4_K_M

# Verify model info
docker model info ai/smollm2:1.7B-Q8_0
```

### Connection Issues
```bash
# Check backend health
curl http://localhost:8080/health

# Check model info
curl http://localhost:8080/api/model-info

# Check services
docker-compose ps
```

### Performance Issues
- **Local Mode**: Ensure Mac GPU utilization
- **Offload Mode**: Monitor memory usage (8GB+ recommended)
- **General**: Restart Docker Desktop if needed

## 🎯 When to Use What

### Use Local Mode When:
- ✅ Quick development and testing
- ✅ Simple code completion and syntax help
- ✅ Working offline or with limited resources
- ✅ Fast iteration cycles needed

### Use Docker Offload When:
- 🚀 Complex code generation and architecture
- 🚀 Large context code analysis
- 🚀 Advanced refactoring and optimization
- 🚀 Production-quality code assistance

## 📊 Environment Variables

Docker automatically injects different variables based on mode:

**Local Mode:**
- `QWEN3_SMALL_URL` - Auto-injected model endpoint
- `QWEN3_SMALL_MODEL` - Auto-injected model name

**Offload Mode:**
- `MODEL_RUNNER_URL` - Custom endpoint variable
- `MODEL_RUNNER_MODEL` - Custom model variable

The backend automatically detects and uses the appropriate variables.

## 🎯 What This Achieves

This implementation demonstrates the **true power of Docker Offload**:

✅ **Start Small** - Begin development with fast local models  
✅ **Scale Seamlessly** - Move to powerful cloud models when needed  
✅ **Same Interface** - No code changes required  
✅ **Smart Detection** - Automatic mode detection and optimization  
✅ **Production Ready** - Handles both development and production workloads  

Perfect for developers who want to **start fast locally** and **scale up intelligently** when more AI power is needed!

## 📄 License

MIT License - feel free to modify and distribute!