# gpt_service.py (Ollama + HF Embeddings)

from flask import json
import requests
from transformers import AutoTokenizer, AutoModel
import torch
import os

from ..services.websocket.ws import WebsocketService

# 🔁 Renamed for clarity: This calls Ollama running Gemma 2B
def call_ollama(system_prompt: str, user_prompt: str, temperature: float = 0.05, model: str = "gemma:2b") -> str:
    prompt = f"{system_prompt.strip()}\n\n{user_prompt.strip()}"
    OLLAMA_API_URL = os.getenv("OLLAMA_API_URL")
    try:
        response = requests.post(f"{OLLAMA_API_URL}/api/generate", json={
            "model": model,
            "prompt": prompt,
            "stream": False,
            "temperature": temperature
        })
        response.raise_for_status()
        content = response.json().get("response", "").strip()
        if not content:
            raise ValueError("Ollama returned empty response.")
        return content
    except Exception as e:
        print(f"❌ Ollama API call error: {e}")
        return "I'm sorry, I couldn't generate a response at the moment."


# ✅ Local transformer-based embedding for Qdrant
# class SimpleEmbedding:
#     def __init__(self, model_name="sentence-transformers/all-MiniLM-L6-v2"):
#         self.tokenizer = AutoTokenizer.from_pretrained(model_name)
#         self.model = AutoModel.from_pretrained(model_name)

#     def encode(self, text):
#         inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True)
#         with torch.no_grad():
#             outputs = self.model(**inputs)
#             embeddings = outputs.last_hidden_state.mean(dim=1)
#             return embeddings[0].tolist()

# embed_model = SimpleEmbedding()

# def get_embedding(text: str):
#     try:
#         return embed_model.encode(text)
#     except Exception as e:
#         print(f"❌ Embedding error: {e}")
#         return None

import requests
from typing import List

class OllamaEmbedder:
    def __init__(self, host: str = "http://localhost:11434", model: str = "gemma:2b") -> None:
        self.host = host
        self.model = model
        self.session = requests.Session()
        self.ws = WebsocketService()

    def list_models(self) -> List[str]:
        """List available models on the Ollama server"""
        response = self.session.get(f"{self.host}/api/tags")
        response.raise_for_status()
        return [m['name'] for m in response.json().get("models", [])]

    def embed(self, text: str | List[str]) -> List[float] | List[List[float]]:
        """Generate embeddings for text or list of texts"""
        url = f"{self.host}/api/embeddings"

        # Handle single text
        if isinstance(text, str):
            payload = {
                "model": self.model,
                "prompt": text
            }
            response = self.session.post(url, json=payload)
            response.raise_for_status()
            return response.json()["embedding"]

        # Handle list of texts
        embeddings = []
        for t in text:
            payload = {
                "model": self.model,
                "prompt": t
            }
            response = self.session.post(url, json=payload)
            response.raise_for_status()
            embeddings.append(response.json()["embedding"])
        return embeddings

    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """Split long text into overlapping chunks"""
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk = words[i:i + chunk_size]
            chunks.append(" ".join(chunk))
        return chunks
