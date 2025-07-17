from pydantic import BaseModel
from typing import Optional, Dict, Any
from enum import Enum

class ModelSize(str, Enum):
    SMALL = "small"
    LARGE = "large"

class DeviceType(str, Enum):
    CPU = "cpu"
    CUDA = "cuda"
    MPS = "mps"  # Apple Silicon

class CodeRequest(BaseModel):
    code: str
    prompt: Optional[str] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = 0.7
    model_size: Optional[ModelSize] = None

class CodeResponse(BaseModel):
    completion: str
    model_info: Dict[str, Any]
    response_time: float
    tokens_generated: int
    
class SystemInfo(BaseModel):
    model_size: ModelSize
    gpu_enabled: bool
    gpu_available: bool
    device: str
    model_name: str
    max_tokens: int
    torch_version: str
    cuda_available: bool
    cuda_version: Optional[str]
    gpu_count: int
    gpu_name: Optional[str] = None

class HealthStatus(BaseModel):
    status: str
    model_loaded: bool
    model_size: ModelSize
    gpu_enabled: bool
    gpu_available: bool
    device: str