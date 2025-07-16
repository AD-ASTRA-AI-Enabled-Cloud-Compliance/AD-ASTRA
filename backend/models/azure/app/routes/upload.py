from fastapi import APIRouter, UploadFile, File
from services.vector_store import extract_text, chunk_text, embedding_model, qdrant, COLLECTION_NAME
from qdrant_client.models import PointStruct
import uuid

upload_router = APIRouter()

@upload_router.post("/upload")
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
