# Simple SmolLM2 Chatbot with Mac GPU Support

A clean, simple chatbot interface powered by SmolLM2 running locally on your Mac with GPU acceleration via Docker Model Runner.

## 🚀 Quick Start

### Prerequisites

1. **Docker Desktop 4.43+** with Model Runner enabled
2. **Mac with Apple Silicon** (M1/M2/M3) for optimal GPU performance
3. **At least 8GB RAM** available

### Step 1: Pull SmolLM2 Model

```bash
# Pull the optimized SmolLM2 model for Mac
docker model pull ai/smollm2:1.7B-Q8_0
```

### Step 2: Clone and Start

```bash
# Clone this repository
git clone https://github.com/ajeetraina/smart-code-assistant-docker-offload.git
cd smart-code-assistant-docker-offload

# Start the application
docker-compose up --build
```

### Step 3: Access the Chat

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
│  Frontend   │───▶│   Backend   │───▶│ Docker Model    │
│ (React/TS)  │    │ (FastAPI)   │    │ Runner (SmolLM2)│
│ Port: 3000  │    │ Port: 8080  │    │ Auto-managed    │
└─────────────┘    └─────────────┘    └─────────────────┘
```

## ⚡ What's Different

### ✅ **Added - Simple & Working**
- **Clean chatbot UI** - Just messages, input, and send button
- **SmolLM2 integration** - Local Mac GPU acceleration  
- **Real-time streaming** - Tokens appear as they're generated
- **Proper Docker Models** - Uses official Compose models syntax
- **Auto-configuration** - Docker injects model URLs automatically

### ❌ **Removed - Complex Demo Stuff**
- Performance metrics dashboards
- Docker Offload comparison charts
- System information cards  
- Example prompt sidebars
- Decision guides about local vs cloud
- Complex tabs and navigation

## 🔧 Configuration

### Docker Compose Models

The `docker-compose.yml` uses the official Docker Compose models specification:

```yaml
services:
  backend:
    models:
      - llm

models:
  llm:
    model: ai/smollm2:1.7B-Q8_0
    context_size: 4096
    runtime_flags:
      - "--threads=8"
      - "--ctx-size=4096"
```

Docker automatically injects these environment variables into the backend:
- `LLM_URL` - URL to access the model
- `LLM_MODEL` - Model identifier

### Model Options

Change the model by updating `docker-compose.yml`:

```yaml
models:
  llm:
    model: ai/smollm2:1.7B-Q8_0  # Fast, recommended
    # model: ai/smollm2:1.7B-Q4_0  # Smaller size
    # model: ai/llama3.2:1B-Q8_0   # Alternative
```

## 🎨 Features

- **Clean Interface** - Simple chat with no clutter
- **Real-time Streaming** - Watch responses generate token by token  
- **Mac GPU Acceleration** - Optimized for Apple Silicon
- **Model Status** - Visual connection status indicator
- **Error Handling** - Graceful fallbacks and clear error messages
- **Health Monitoring** - `/health` endpoint for service status

## 🚨 Troubleshooting

### Model Not Loading

```bash
# Check if model is available
docker model list

# Re-pull if needed
docker model pull ai/smollm2:1.7B-Q8_0

# Check if Model Runner is working
docker model info ai/smollm2:1.7B-Q8_0
```

### Connection Issues

```bash
# Check backend health
curl http://localhost:8080/health

# Check model info endpoint
curl http://localhost:8080/api/model-info

# Check Docker Compose services
docker-compose ps
```

### Performance Issues

- **Slow responses**: Ensure Mac GPU is being utilized
- **Memory errors**: Close other applications to free up RAM  
- **Docker issues**: Restart Docker Desktop

## 📊 Development

For development with hot reloading:

```bash
# Frontend (in frontend/)
npm install
npm run dev  # Port 3000

# Backend (in backend/)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080
```

## 🎯 What This Achieves

This transforms the repository from a **complex Docker Offload demonstration** into a **simple, functional chatbot** that:

✅ Actually works with local AI models  
✅ Uses proper Docker Compose models syntax  
✅ Provides a clean user experience  
✅ Runs SmolLM2 with Mac GPU acceleration  
✅ Streams responses in real-time  
✅ Has proper error handling  

Perfect for developers who want a clean AI coding assistant without technical complexity!

## 📄 License

MIT License - feel free to modify and distribute!