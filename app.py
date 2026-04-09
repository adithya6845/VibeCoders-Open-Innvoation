from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from medical_ai_service import query_medical_ai

app = FastAPI(title="Medical AI API")

# Add CORS middleware to allow the frontend to connect to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

class ChatRequest(BaseModel):
    user_message: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # Pass the user's message to the medical AI service
    answer = query_medical_ai(request.user_message)
    return {"reply": answer}
