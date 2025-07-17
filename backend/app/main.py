from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn
import httpx
import json
import os
from typing import Optional, AsyncGenerator

# Request/response models
class ChatRequest(BaseModel):
    message: str
    stream: bool = True

class ChatResponse(BaseModel):
    response: str

# Initialize FastAPI app
app = FastAPI(title="Smart Code Assistant with Docker Offload", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration - Docker injects these via long syntax configuration
MODEL_URL = os.getenv("MODEL_RUNNER_URL", "http://host.docker.internal:12434/engines/llama.cpp/v1/")
MODEL_NAME = os.getenv("MODEL_RUNNER_MODEL", "ai/smollm2:1.7B-Q8_0")
API_KEY = os.getenv("API_KEY", "dockermodelrunner")

# Determine model characteristics for optimization
def get_model_info(model_name: str):
    """Extract model information from name for optimization"""
    model_name_lower = model_name.lower()
    
    if "1.7b" in model_name_lower or "1b" in model_name_lower:
        return {
            "size": "small",
            "max_tokens": 1000,
            "timeout": 30.0,
            "model_display": model_name.replace("ai/", "").replace(":1.7B-Q8_0", " 1.7B")
        }
    elif "7b" in model_name_lower:
        return {
            "size": "medium", 
            "max_tokens": 1500,
            "timeout": 45.0,
            "model_display": model_name.replace("ai/", "").replace(":7B-Q4_0", " 7B")
        }
    elif "14b" in model_name_lower or "30b" in model_name_lower:
        return {
            "size": "large",
            "max_tokens": 2000, 
            "timeout": 60.0,
            "model_display": model_name.replace("ai/", "").replace(":14B-Q4_K_M", " 14B")
        }
    else:
        return {
            "size": "unknown",
            "max_tokens": 1000,
            "timeout": 30.0,
            "model_display": model_name.replace("ai/", "")
        }

MODEL_INFO = get_model_info(MODEL_NAME)

@app.get("/")
async def root():
    return {
        "message": "Smart Code Assistant with Docker Offload is running!", 
        "model": MODEL_NAME,
        "model_display": MODEL_INFO["model_display"],
        "model_size": MODEL_INFO["size"],
        "endpoint": MODEL_URL
    }

@app.get("/health")
async def health_check():
    try:
        # Check if model runner is accessible
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{MODEL_URL.rstrip('/')}/models",
                headers={"Authorization": f"Bearer {API_KEY}"},
                timeout=5.0
            )
            if response.status_code == 200:
                return {
                    "status": "healthy", 
                    "model_runner": "connected", 
                    "model": MODEL_NAME,
                    "model_display": MODEL_INFO["model_display"],
                    "model_size": MODEL_INFO["size"],
                    "endpoint": MODEL_URL
                }
            else:
                return {"status": "degraded", "model_runner": "disconnected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

async def stream_chat_response(message: str) -> AsyncGenerator[str, None]:
    """Stream response from the configured model via Docker Model Runner"""
    try:
        payload = {
            "model": MODEL_NAME,
            "messages": [
                {
                    "role": "system", 
                    "content": f"You are a helpful coding assistant running with {MODEL_INFO['model_display']} model. Provide clear, concise answers to programming questions."
                },
                {"role": "user", "content": message}
            ],
            "stream": True,
            "max_tokens": MODEL_INFO["max_tokens"],
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient(timeout=MODEL_INFO["timeout"]) as client:
            async with client.stream(
                "POST",
                f"{MODEL_URL}chat/completions",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json"
                },
                json=payload
            ) as response:
                if response.status_code != 200:
                    yield f"data: {json.dumps({'error': f'Model runner error: {response.status_code}'})}\n\n"
                    return

                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = line[6:]  # Remove "data: " prefix
                        if data.strip() == "[DONE]":
                            break
                        try:
                            parsed = json.loads(data)
                            if "choices" in parsed and len(parsed["choices"]) > 0:
                                delta = parsed["choices"][0].get("delta", {})
                                content = delta.get("content", "")
                                if content:
                                    # Send the content chunk to frontend
                                    yield f"data: {json.dumps({'content': content})}\n\n"
                        except json.JSONDecodeError:
                            continue
    except Exception as e:
        yield f"data: {json.dumps({'error': f'Streaming error: {str(e)}'})}\n\n"

@app.post("/api/chat")
async def chat_stream(request: ChatRequest):
    """
    Stream chat response from the configured model
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    if request.stream:
        return StreamingResponse(
            stream_chat_response(request.message),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )
    else:
        # Non-streaming response (fallback)
        try:
            payload = {
                "model": MODEL_NAME,
                "messages": [
                    {
                        "role": "system", 
                        "content": f"You are a helpful coding assistant running with {MODEL_INFO['model_display']} model. Provide clear, concise answers to programming questions."
                    },
                    {"role": "user", "content": request.message}
                ],
                "stream": False,
                "max_tokens": MODEL_INFO["max_tokens"],
                "temperature": 0.7
            }
            
            async with httpx.AsyncClient(timeout=MODEL_INFO["timeout"]) as client:
                response = await client.post(
                    f"{MODEL_URL}chat/completions",
                    headers={
                        "Authorization": f"Bearer {API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json=payload
                )
                
                if response.status_code == 200:
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    return ChatResponse(response=content)
                else:
                    raise HTTPException(status_code=500, detail=f"Model runner error: {response.status_code}")
                    
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error communicating with model: {str(e)}")

@app.get("/api/model-info")
async def get_model_info():
    """Get information about the current model"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{MODEL_URL.rstrip('/')}/models",
                headers={"Authorization": f"Bearer {API_KEY}"},
                timeout=5.0
            )
            if response.status_code == 200:
                models = response.json()
                return {
                    "current_model": MODEL_NAME,
                    "model_display": MODEL_INFO["model_display"],
                    "model_size": MODEL_INFO["size"],
                    "endpoint": MODEL_URL,
                    "max_tokens": MODEL_INFO["max_tokens"],
                    "available_models": models.get("data", []),
                    "status": "connected"
                }
            else:
                return {"error": "Could not fetch model info", "status": "disconnected"}
    except Exception as e:
        return {"error": str(e), "status": "error"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)