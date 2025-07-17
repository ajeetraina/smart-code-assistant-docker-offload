# Setup Guide: Smart Code Assistant Docker Offload Demo

This guide walks you through setting up and running the Smart Code Assistant demo to showcase Docker Offload capabilities.

## 🛠️ Prerequisites

### Required Software
- **Docker Desktop 4.43.0+** with Docker Offload feature
- **Git** for cloning the repository
- **8GB+ RAM** for local development
- **GPU (Optional)** for local large model testing

### Docker Offload Setup
1. Ensure Docker Desktop is updated to version 4.43.0 or later
2. Enable Docker Offload in Settings > Beta Features
3. Have a Docker Hub account for cloud resources

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/ajeetraina/smart-code-assistant-docker-offload.git
cd smart-code-assistant-docker-offload
```

### 2. Phase 1: Local Development (Small Model)

```bash
# Start the local development environment
docker-compose -f docker-compose.local.yml up --build

# Wait for services to start (usually 2-3 minutes)
# The backend will download the small model (~220MB) on first run

# Open your browser to http://localhost:3000
```

**What to expect:**
- Small model (CodeT5-small) running on CPU
- Basic code completion capabilities
- Fast response times (1-2 seconds)
- Limited context understanding (512 tokens)

### 3. Phase 2: Docker Offload (Large Model)

```bash
# Start Docker Offload with GPU support
docker offload start --gpu

# Verify GPU access
docker run --rm --gpus all nvidia/cuda:12.4.0-runtime-ubuntu22.04 nvidia-smi

# Deploy with Docker Offload
docker-compose -f docker-compose.local.yml -f docker-compose.offload.yml up --build

# The application is still available at http://localhost:3000
```

**What to expect:**
- Large model (CodeLlama-7B) running on NVIDIA L4 GPU
- Advanced code generation capabilities
- Slightly slower response times (3-5 seconds) due to network
- Extended context understanding (4096+ tokens)

## 📈 Testing the Demo

### Scenario 1: Basic Code Completion (Local)
1. Navigate to the **Code Completion** tab
2. Enter: `def fibonacci(`
3. Click **Complete Code**
4. Observe fast, basic completion

### Scenario 2: Advanced Code Generation (Docker Offload)
1. Switch to **Code Generation** tab
2. Enter prompt: "Create a React component for a shopping cart with state management"
3. Click **Generate Code**
4. Observe comprehensive, context-aware code generation

### Performance Comparison
The interface shows real-time metrics:
- Response time differences
- Token generation rates
- Model and environment information
- GPU utilization (when available)

## 🔍 Troubleshooting

### Common Issues

**Backend fails to start:**
```bash
# Check Docker memory allocation
docker system info | grep -i memory

# Increase Docker Desktop memory to 8GB+ in Settings
```

**Model download fails:**
```bash
# Clear Docker volumes and retry
docker-compose down -v
docker-compose -f docker-compose.local.yml up --build
```

**Docker Offload not working:**
```bash
# Check Docker Offload status
docker offload status

# Restart Docker Offload session
docker offload stop
docker offload start --gpu
```

**GPU not detected:**
```bash
# Verify NVIDIA drivers
nvidia-smi

# Check Docker GPU support
docker run --rm --gpus all nvidia/cuda:12.4.0-runtime-ubuntu22.04 nvidia-smi
```

### Debug Commands

```bash
# View backend logs
docker-compose logs -f api

# Check system resources
docker system df
docker stats

# Test API endpoints directly
curl http://localhost:8000/health
curl http://localhost:8000/info
```

## 📊 Performance Benchmarks

### Expected Performance

| Metric | Local (Small) | Docker Offload (Large) |
|--------|---------------|------------------------|
| Model Size | 220MB | 7-34GB |
| Startup Time | 30-60s | 2-3 minutes |
| Response Time | 1-2s | 3-5s |
| Memory Usage | 2-4GB RAM | 15-23GB GPU VRAM |
| Context Length | 512 tokens | 4096+ tokens |
| Code Quality | Basic completion | Advanced generation |

### Hardware Requirements

**Local Development:**
- 8GB+ RAM
- 4-core CPU
- 10GB disk space

**Docker Offload:**
- Network connection
- Docker Hub account
- Auto-provisioned NVIDIA L4 GPU (23GB VRAM)

## 🎓 Learning Objectives

After completing this demo, you'll understand:

1. **When to use local development:**
   - Rapid prototyping and iteration
   - Basic code assistance
   - Limited resource workloads
   - Offline development

2. **When to scale to Docker Offload:**
   - Large model inference
   - GPU-intensive workloads
   - Team collaboration with mixed hardware
   - Production-scale AI applications

3. **Docker Offload benefits:**
   - Zero infrastructure management
   - Automatic GPU provisioning
   - Seamless local workflow integration
   - Cost-effective cloud scaling

## 📚 Additional Resources

- [Docker Offload Documentation](https://docs.docker.com/offload/)
- [Model Performance Comparison](./benchmarks.md)
- [Extending the Demo](./EXTENDING.md)
- [Production Deployment](./PRODUCTION.md)

## 🎆 Next Steps

1. Try different model sizes and configurations
2. Implement custom code generation prompts
3. Add monitoring and observability
4. Deploy to production with Docker Offload
5. Explore other AI/ML workloads

---

*For questions or issues, please open a GitHub issue or contact [@ajeetraina](https://github.com/ajeetraina)*