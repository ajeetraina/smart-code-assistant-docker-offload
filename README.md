# Smart Code Assistant: Docker Offload Demo

A progressive web application demonstrating the power of **Docker Offload** by showcasing the transition from local small language models to cloud-powered large language models for AI-powered code assistance.

## 🎯 Project Overview

This project illustrates the practical decision-making process for when to use local development vs Docker Offload, specifically for AI/ML workloads:

- **Phase 1**: Local development with small, CPU-efficient models (< 1GB)
- **Phase 2**: Scale to Docker Offload with large, GPU-accelerated models (> 7GB)

## 🔧 Architecture

### Local Development (Small Model)
- **Model**: CodeT5-small (220MB)
- **Hardware**: CPU, 4GB RAM
- **Use Case**: Basic code completion, syntax help
- **Response Time**: 1-2 seconds

### Docker Offload (Large Model)  
- **Model**: CodeLlama-34B (19GB)
- **Hardware**: NVIDIA L4 GPU, 23GB VRAM
- **Use Case**: Advanced code generation, explanation, refactoring
- **Response Time**: 3-5 seconds (includes network)

## 📊 Decision Matrix

### Use Local When:
- Model size < 7B parameters
- Development/testing phase
- Quick iterations and debugging
- Sufficient local hardware
- Offline requirements

### Use Docker Offload When:
- Model size > 13B parameters  
- Need GPU acceleration (CUDA workloads)
- Local machine lacks GPU/VRAM
- Production-scale inference
- Team has mixed hardware capabilities

## 🚀 Quick Start

### Prerequisites
- Docker Desktop 4.43.0+
- Docker Offload enabled (for Phase 2)

### Phase 1: Local Development
```bash
# Clone the repository
git clone https://github.com/ajeetraina/smart-code-assistant-docker-offload.git
cd smart-code-assistant-docker-offload

# Start with small model locally
docker-compose -f docker-compose.local.yml up --build

# Visit http://localhost:3000
```

### Phase 2: Scale to Docker Offload
```bash
# Start Docker Offload session with GPU
docker offload start --gpu

# Deploy large model to cloud
docker-compose -f docker-compose.local.yml -f docker-compose.offload.yml up --build

# Same interface, now with GPU-accelerated large model
```

## 🏗️ Project Structure

```
├── frontend/                 # React web application
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── backend/                  # FastAPI Python backend
│   ├── app/
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.local.yml  # Local development setup
├── docker-compose.offload.yml # Docker Offload configuration
└── README.md
```

## 📈 Performance Comparison

| Metric | Local (Small) | Docker Offload (Large) |
|--------|---------------|------------------------|
| Startup Time | 5 seconds | 30 seconds |
| Memory Usage | 2GB RAM | 23GB GPU VRAM |
| Code Quality | Basic completions | Advanced generation |
| Context Understanding | 512 tokens | 4096+ tokens |
| Response Accuracy | 70% | 95% |

## 🎮 Demo Scenarios

### Scenario 1: Simple Autocomplete (Local)
```python
# User types: "def fibonacci("
# Local model responds: "n): return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)"
```

### Scenario 2: Complex Code Generation (Docker Offload)
```javascript
// User asks: "Create a React component with state management for a shopping cart"
// Large model generates complete component with hooks, context, and TypeScript
```

## 🔍 System Information

The web interface shows real-time information about:
- Current model size (small/large)
- Execution environment (local/docker-offload)
- GPU availability and usage
- Response performance metrics

## 🐛 Troubleshooting

### Common Issues:
1. **Local model fails to start**: Ensure Docker has enough memory allocated (4GB+)
2. **GPU not detected in Docker Offload**: Verify `docker offload start --gpu` was used
3. **Slow responses**: Check network connectivity for Docker Offload mode

### Debug Commands:
```bash
# Check Docker Offload status
docker offload status

# Verify GPU access
docker run --rm --gpus all nvidia/cuda:12.4.0-runtime-ubuntu22.04 nvidia-smi

# Check system resources
docker system df
```

## 📚 Learn More

- [Docker Offload Documentation](https://docs.docker.com/offload/)
- [When to Use Docker Offload vs Local Development](./docs/decision-guide.md)
- [Performance Benchmarks](./docs/benchmarks.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

