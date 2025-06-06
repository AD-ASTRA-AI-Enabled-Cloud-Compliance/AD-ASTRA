from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
import docx
import fitz
import json

COLLECTION_NAME = "cricket_docs"
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
qdrant = QdrantClient(host="localhost", port=6333)

def chunk_text(text, chunk_size=500):
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

def extract_text(file):
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
