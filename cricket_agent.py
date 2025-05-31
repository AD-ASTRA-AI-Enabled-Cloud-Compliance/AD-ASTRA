from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AzureOpenAI
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import numpy as np
import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
# ==== Setup FastAPI ====
app = FastAPI()

# ==== Allow frontend to call backend ====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==== Configuration ====
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_DEPLOYMENT_NAME = os.getenv("AZURE_DEPLOYMENT_NAME")
QDRANT_HOST = os.getenv("QDRANT_HOST")
QDRANT_PORT = int(os.getenv("QDRANT_PORT"))
COLLECTION_NAME = "cricket_docs"

# ==== Initialize Azure OpenAI (updated version) ====
client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version="2024-12-01-preview",
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
)

# ==== Initialize Qdrant client ====
qdrant = QdrantClient(QDRANT_HOST, port=QDRANT_PORT)

# ==== Embedding model ====
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# ==== Pydantic model ====
class Query(BaseModel):
    question: str

# ==== Vector search function ====
def get_relevant_chunks(query, top_k=5):
    vector = embedding_model.encode(query).tolist()
    hits = qdrant.search(collection_name=COLLECTION_NAME, query_vector=vector, limit=top_k)
    return [hit.payload["text"] for hit in hits if "text" in hit.payload]

# ==== Ask agent route ====
@app.post("/ask")
def ask_agent(query: Query):
    docs = get_relevant_chunks(query.question)

    messages = [
        {"role": "system", "content": "You are a cricket expert AI."},
        {"role": "user", "content": f"Context:\n{chr(10).join(docs)}\n\nQuestion: {query.question}"}
    ]

    response = client.chat.completions.create(
        model=AZURE_DEPLOYMENT_NAME,
        messages=messages,
        temperature=0.7,
        max_tokens=300
    )

    return {"answer": response.choices[0].message.content} 
