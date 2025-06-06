# gpt_service.py (Ollama + HF Embeddings)

import requests
from transformers import AutoTokenizer, AutoModel
import torch

# 🔁 Renamed for clarity: This calls Ollama running Gemma 2B
def call_ollama(system_prompt: str, user_prompt: str, temperature: float = 0.05, model: str = "gemma:2b") -> str:
    prompt = f"{system_prompt.strip()}\n\n{user_prompt.strip()}"
    try:
        response = requests.post("http://localhost:11434/api/generate", json={
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
class SimpleEmbedding:
    def __init__(self, model_name="sentence-transformers/all-MiniLM-L6-v2"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)

    def encode(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
            embeddings = outputs.last_hidden_state.mean(dim=1)
            return embeddings[0].tolist()

embed_model = SimpleEmbedding()

def get_embedding(text: str):
    try:
        return embed_model.encode(text)
    except Exception as e:
        print(f"❌ Embedding error: {e}")
        return None
