import json, uuid
from qdrant_client import QdrantClient
from qdrant_client.http.models import VectorParams, PointStruct

def upload_embeddings_to_qdrant(json_path="embedded_chunks.json", collection_name="uploads"):
    client = QdrantClient(host="localhost", port=6333)
    with open(json_path, "r") as f:
        data = json.load(f)

    if not client.collection_exists(collection_name):
        client.recreate_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=len(data[0]["embedding"]), distance="Cosine")
        )

    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=item["embedding"],
            payload={"text": item["text"], "file_name": item["file_name"]}
        ) for item in data
    ]
    client.upsert(collection_name=collection_name, points=points)
