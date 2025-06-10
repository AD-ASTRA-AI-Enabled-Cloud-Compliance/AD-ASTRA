from services.vector_store import embedding_model, qdrant, COLLECTION_NAME
from serpapi import GoogleSearch
import os

SERPAPI_KEY = os.getenv("SERPAPI_API_KEY")

def retrieve_context(question):
    q_vec = embedding_model.encode(question).tolist()
    q_results = qdrant.search(collection_name=COLLECTION_NAME, query_vector=q_vec, limit=3)
    doc_chunks = [r.payload["text"] for r in q_results]

    search = GoogleSearch({"q": question, "api_key": SERPAPI_KEY})
    result = search.get_dict()
    web_snippets = [
        entry.get("snippet") for entry in result.get("organic_results", [])[:2] if "snippet" in entry
    ]
    return doc_chunks + web_snippets
