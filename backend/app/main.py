from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import torch
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import time
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Smart Code Assistant API",
    description="AI-powered code assistance with local and Docker Offload support",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration from environment variables
MODEL_SIZE = os.getenv('MODEL_SIZE', 'small').lower()
USE_GPU = os.getenv('USE_GPU', 'false').lower() == 'true'
MODEL_NAME = os.getenv('MODEL_NAME', 'Salesforce/codet5-small')
MAX_TOKENS = int(os.getenv('MAX_TOKENS', '100'))
TORCH_DTYPE = os.getenv('TORCH_DTYPE', 'float32')

# Global variables for model and tokenizer
model_pipeline = None
model_info = {
    "model_size": MODEL_SIZE,
    "gpu_enabled": USE_GPU,
    "model_name": MODEL_NAME,
    "max_tokens": MAX_TOKENS,
    "device": "unknown",
    "gpu_available": False,
    "torch_dtype": TORCH_DTYPE
}

class CodeRequest(BaseModel):
    code: str
    prompt: Optional[str] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = 0.7

class CodeResponse(BaseModel):
    completion: str
    model_info: dict
    response_time: float
    tokens_generated: int

def initialize_model():
    """Initialize the model based on configuration"""
    global model_pipeline, model_info
    
    try:
        # Determine device
        device = -1  # CPU by default
        gpu_available = torch.cuda.is_available()
        
        if USE_GPU and gpu_available:
            device = 0
            device_name = "cuda (Docker Offload)"
            logger.info(f"GPU detected: {torch.cuda.get_device_name(0)}")
        else:
            device_name = "cpu (local)"
            logger.info("Using CPU for inference")
        
        model_info.update({
            "device": device_name,
            "gpu_available": gpu_available,
            "gpu_name": torch.cuda.get_device_name(0) if gpu_available else "None"
        })
        
        logger.info(f"Initializing {MODEL_SIZE} model: {MODEL_NAME}")
        
        if MODEL_SIZE == 'small':
            # Small model for local development
            model_pipeline = pipeline(
                'text-generation',
                model=MODEL_NAME,
                device=device,
                trust_remote_code=True
            )
        else:
            # Large model for Docker Offload
            torch_dtype = torch.float16 if TORCH_DTYPE == 'float16' else torch.float32
            
            model_pipeline = pipeline(
                'text-generation',
                model=MODEL_NAME,
                device=device,
                torch_dtype=torch_dtype,
                trust_remote_code=True
            )
        
        logger.info("Model initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize model: {str(e)}")
        # Fallback to a simple model
        try:
            model_pipeline = pipeline(
                'text-generation',
                model='gpt2',
                device=-1  # Force CPU
            )
            model_info["model_name"] = "gpt2 (fallback)"
            logger.info("Fallback model (GPT-2) initialized")
        except Exception as fallback_error:
            logger.error(f"Fallback model also failed: {str(fallback_error)}")
            raise

@app.on_event("startup")
async def startup_event():
    """Initialize model on startup"""
    initialize_model()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model_pipeline is not None,
        **model_info
    }

@app.get("/info")
async def get_system_info():
    """Get detailed system information"""
    return {
        **model_info,
        "torch_version": torch.__version__,
        "cuda_available": torch.cuda.is_available(),
        "cuda_version": torch.version.cuda if torch.cuda.is_available() else None,
        "gpu_count": torch.cuda.device_count() if torch.cuda.is_available() else 0
    }

@app.post("/complete", response_model=CodeResponse)
async def complete_code(request: CodeRequest):
    """Generate code completion"""
    if model_pipeline is None:
        raise HTTPException(status_code=500, detail="Model not initialized")
    
    start_time = time.time()
    
    try:
        # Prepare input
        input_text = request.code
        if request.prompt:
            input_text = f"{request.prompt}\n{request.code}"
        
        max_tokens = request.max_tokens or MAX_TOKENS
        
        # Generate completion
        if MODEL_SIZE == 'small':
            # Simple completion for small models
            result = model_pipeline(
                input_text,
                max_length=len(input_text.split()) + max_tokens,
                num_return_sequences=1,
                temperature=request.temperature,
                do_sample=True,
                pad_token_id=model_pipeline.tokenizer.eos_token_id
            )
            completion = result[0]['generated_text'][len(input_text):]
        else:
            # Advanced generation for large models
            prompt = f"Complete this code:\n```\n{input_text}\n```\n\nCompletion:"
            result = model_pipeline(
                prompt,
                max_new_tokens=max_tokens,
                temperature=request.temperature,
                do_sample=True,
                return_full_text=False
            )
            completion = result[0]['generated_text']
        
        response_time = time.time() - start_time
        tokens_generated = len(completion.split())
        
        return CodeResponse(
            completion=completion.strip(),
            model_info=model_info,
            response_time=response_time,
            tokens_generated=tokens_generated
        )
        
    except Exception as e:
        logger.error(f"Error generating completion: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@app.post("/generate")
async def generate_code(request: CodeRequest):
    """Generate code from natural language prompt"""
    if model_pipeline is None:
        raise HTTPException(status_code=500, detail="Model not initialized")
    
    start_time = time.time()
    
    try:
        # For code generation from natural language
        prompt = f"Generate code for: {request.prompt or request.code}\n\nCode:"
        
        max_tokens = request.max_tokens or MAX_TOKENS
        
        result = model_pipeline(
            prompt,
            max_new_tokens=max_tokens,
            temperature=request.temperature,
            do_sample=True,
            return_full_text=False
        )
        
        response_time = time.time() - start_time
        completion = result[0]['generated_text']
        tokens_generated = len(completion.split())
        
        return CodeResponse(
            completion=completion.strip(),
            model_info=model_info,
            response_time=response_time,
            tokens_generated=tokens_generated
        )
        
    except Exception as e:
        logger.error(f"Error generating code: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)