from fastapi import APIRouter
from pydantic import BaseModel
from services.context import retrieve_context
from services.llm import ask_with_openai

ask_router = APIRouter()

class Question(BaseModel):
    question: str

@ask_router.post("/ask")
def ask_agent(query: Question):
    context = retrieve_context(query.question)
    return ask_with_openai(query.question, context)
