from fastapi import FastAPI
from pydantic import BaseModel

from src.langgraph_rag import ask_rag
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Phase 1 RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/ask")
def ask_question(request: ChatRequest):
    answer = ask_rag(request.question)

    return {
        "question": request.question,
        "answer": answer,
    }