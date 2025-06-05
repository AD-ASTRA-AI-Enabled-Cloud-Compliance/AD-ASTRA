import uuid, requests

def generate_ollama_embeddings(chunks, model="nomic-embed-text"):
    embedded_chunks = []
    for chunk in chunks:
        res = requests.post("http://localhost:11434/api/embeddings",
            json={"model": model, "prompt": chunk})
        if res.status_code == 200:
            data = res.json()
            embedded_chunks.append({
                "file_name": str(uuid.uuid4()) + ".txt",
                "text": chunk,
                "embedding": data["embedding"]
            })
    return embedded_chunks
