from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
from sentence_transformers import SentenceTransformer
from serpapi import GoogleSearch
from dotenv import load_dotenv
import openai
import os
import uuid
import json
import docx
import fitz  # PyMuPDF for PDF
load_dotenv()



# === FastAPI setup ===
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Environment Variables ===
QDRANT_HOST = "localhost"
QDRANT_PORT = 6333
COLLECTION_NAME = "cricket_docs"
SERPAPI_KEY = os.getenv("SERPAPI_API_KEY")

openai.api_key = os.getenv("OPENAI_API_KEY")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
qdrant = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

# === Request Model ===
class Question(BaseModel):
    question: str

# === Utility: Chunk text ===
def chunk_text(text, chunk_size=500):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

# === Utility: Read document and extract text ===
def extract_text(file: UploadFile):
    ext = file.filename.lower()
    if ext.endswith(".pdf"):
        doc = fitz.open(stream=file.file.read(), filetype="pdf")
        return "\n".join(page.get_text() for page in doc)
    elif ext.endswith(".docx"):
        doc = docx.Document(file.file)
        return "\n".join(p.text for p in doc.paragraphs)
    elif ext.endswith(".json"):
        return json.dumps(json.load(file.file))
    else:
        return file.file.read().decode("utf-8")

# === Upload Endpoint ===
@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    text = extract_text(file)
    chunks = chunk_text(text)
    vectors = embedding_model.encode(chunks)

    points = [
        PointStruct(id=str(uuid.uuid4()), vector=vec.tolist(), payload={"text": chunk})
        for chunk, vec in zip(chunks, vectors)
    ]
    qdrant.upsert(collection_name=COLLECTION_NAME, points=points)
    return {"status": "success"}

# === Search DB + Web (SerpAPI) ===
def retrieve_context(question):
    # 1. Search from vector DB
    q_vec = embedding_model.encode(question).tolist()
    q_results = qdrant.search(collection_name=COLLECTION_NAME, query_vector=q_vec, limit=3)
    doc_chunks = [r.payload["text"] for r in q_results]

    # 2. Web search using SerpAPI
    search = GoogleSearch({"q": question, "api_key": SERPAPI_KEY})
    result = search.get_dict()
    web_snippets = [
        entry.get("snippet") for entry in result.get("organic_results", [])[:2] if "snippet" in entry
    ]
    return doc_chunks + web_snippets

# === Ask Agent ===
@app.post("/ask")
def ask_agent(query: Question):
    context = retrieve_context(query.question)

    messages = [
        {"role": "system", "content": "You are Cric AI, an expert cricket assistant."},
        {"role": "user", "content": f"""User asked: {query.question}
Context:
{chr(10).join(context)}

Let's reason step-by-step in this format:
Thought:
Action:
Observation:
Thought:
Final Answer:"""}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-1106",
        messages=messages,
        temperature=0.2,
        max_tokens=800
    )

    return {"answer": response["choices"][0]["message"]["content"]}
