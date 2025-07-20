# vector_store.py (Qdrant version with class-based initialization and logic)
# vector_store.py (Qdrant version with class-based initialization and logic)

# # OLD MongoDB Setup (commented)
# # from pymongo import MongoClient
# # mongo_client = MongoClient(os.getenv("MONGODB_URI"))
# # db = mongo_client[os.getenv("MONGODB_DB", "compliance")]
# # chunks_collection = db["framework_chunks"]
# # rules_collection = db["framework_rules"]

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from qdrant_client.http.exceptions import UnexpectedResponse
from qdrant_client.http.exceptions import UnexpectedResponse
from uuid import uuid4
from src.services.websocket.ws import WebsocketService
from src.services.gpt_service import OllamaEmbedder
import os


class VectorStoreService:
    def __init__(self):
        self.qdrant = QdrantClient(host="localhost", port=6333)
        self.embedder = OllamaEmbedder()

class VectorStoreService:
    def __init__(self):
        self.qdrant = QdrantClient(host="localhost", port=6333)
        self.embedder = OllamaEmbedder()

        # Collection names
        self.collection_chunks = "framework_chunks"
        self.collection_rules = "framework_rules"
        self.collection_logs = "qdrant_collection_processing_logs"

        # Ensure all required collections exist
        self.ensure_collection_exists(self.collection_chunks)
        self.ensure_collection_exists(self.collection_rules)
        self.ensure_collection_exists(self.collection_logs)

    def ensure_collection_exists(self, collection_name, size=2048):
        try:
            self.qdrant.get_collection(collection_name)
            print(f"✅ Collection '{collection_name}' already exists.")
        except UnexpectedResponse:
            print(f"📦 Creating missing collection: {collection_name}")
            self.qdrant.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=size, distance=Distance.COSINE)
            )
        # Collection names
        self.collection_chunks = "framework_chunks"
        self.collection_rules = "framework_rules"
        self.collection_logs = "qdrant_collection_processing_logs"

        # Ensure all required collections exist
        self.ensure_collection_exists(self.collection_chunks)
        self.ensure_collection_exists(self.collection_rules)
        self.ensure_collection_exists(self.collection_logs)

    def ensure_collection_exists(self, collection_name, size=2048):
        try:
            self.qdrant.get_collection(collection_name)
            print(f"✅ Collection '{collection_name}' already exists.")
        except UnexpectedResponse:
            print(f"📦 Creating missing collection: {collection_name}")
            self.qdrant.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=size, distance=Distance.COSINE)
            )



    def query_similar_rules(query, doc_id, top_k=10):
        embedding = embedder.embed(query)
        if not embedding:
            return []
    def query_similar_rules(query, doc_id, top_k=10):
        embedding = embedder.embed(query)
        if not embedding:
            return []

        results = qdrant.search(
            collection_name=qdrant_collection_rules, 
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
            )
        )
        return [{"score": r.score, "content": r.payload.get("rule")} for r in results]
        results = qdrant.search(
            collection_name=qdrant_collection_rules, 
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
            )
        )
        return [{"score": r.score, "content": r.payload.get("rule")} for r in results]

    # --- updated by harsimran # old logic need to be removed ---
    def search_chunks_and_rules(query, doc_id, top_k=30):
        embedding = embedder.embed(query)
        if not embedding:
            return []
    # --- updated by harsimran # old logic need to be removed ---
    def search_chunks_and_rules(query, doc_id, top_k=30):
        embedding = embedder.embed(query)
        if not embedding:
            return []

        chunk_results = qdrant.search(
            collection_name=qdrant_collection_chunks,
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
            )
        )
        chunk_results = qdrant.search(
            collection_name=qdrant_collection_chunks,
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
            )
        )

        rule_results = qdrant.search(
            collection_name=qdrant_collection_rules,
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
            )
        )
        rule_results = qdrant.search(
            collection_name=qdrant_collection_rules,
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
            )
        )

        combined = [
            {"score": r.score, "content": r.payload.get("chunk") or r.payload.get("rule")}
            for r in (chunk_results + rule_results)
        ]
        return sorted(combined, key=lambda x: -x["score"])[:top_k]
        combined = [
            {"score": r.score, "content": r.payload.get("chunk") or r.payload.get("rule")}
            for r in (chunk_results + rule_results)
        ]
        return sorted(combined, key=lambda x: -x["score"])[:top_k]



    # def get_available_doc_ids():
    #     hits = qdrant.scroll(
    #         collection_name=qdrant_collection_chunks, limit=1000
    #     )[0]
    #     return list(set([pt.payload.get("doc_id") for pt in hits if pt.payload.get("doc_id")]))
    
    # def store_document_chunks(text, doc_id):
    #     ws = WebsocketService()
    #     from langchain_text_splitters import RecursiveCharacterTextSplitter
    #     splitter = RecursiveCharacterTextSplitter(
    #         chunk_size=800, chunk_overlap=100)
    #     chunks = splitter.split_text(text)
    #     print(f"📄 Splitting into {len(chunks)} chunks")

    #     points = []
    #     totalChunks = len(chunks)

    #     for i, chunk in enumerate(chunks, start=1):
    #         embedding = embedder.embed(chunk)
    #         msg = f"Chunk: {i} of {totalChunks}"
    #         # uncomment later
    #         # ws.send_progress_update(
    #         #     message=msg,
    #         #     current_page=i,
    #         #     total_pages=len(chunks),
    #         # )

    #         if embedding:
    #             points.append(PointStruct(
    #                 id=str(uuid4()),
    #                 vector=embedding,
    #                 payload={
    #                     "doc_id": doc_id,
    #                     "chunk": chunk,
    #                     "chunk_id": i
    #                 }
    #             ))
    #     if points:
    #         qdrant.upsert(collection_name=qdrant_collection_chunks, points=points)

    # def get_available_doc_ids():
    #     hits = qdrant.scroll(
    #         collection_name=qdrant_collection_chunks, limit=1000
    #     )[0]
    #     return list(set([pt.payload.get("doc_id") for pt in hits if pt.payload.get("doc_id")]))
    
    # def store_document_chunks(text, doc_id):
    #     ws = WebsocketService()
    #     from langchain_text_splitters import RecursiveCharacterTextSplitter
    #     splitter = RecursiveCharacterTextSplitter(
    #         chunk_size=800, chunk_overlap=100)
    #     chunks = splitter.split_text(text)
    #     print(f"📄 Splitting into {len(chunks)} chunks")

    #     points = []
    #     totalChunks = len(chunks)

    #     for i, chunk in enumerate(chunks, start=1):
    #         embedding = embedder.embed(chunk)
    #         msg = f"Chunk: {i} of {totalChunks}"
    #         # uncomment later
    #         # ws.send_progress_update(
    #         #     message=msg,
    #         #     current_page=i,
    #         #     total_pages=len(chunks),
    #         # )

    #         if embedding:
    #             points.append(PointStruct(
    #                 id=str(uuid4()),
    #                 vector=embedding,
    #                 payload={
    #                     "doc_id": doc_id,
    #                     "chunk": chunk,
    #                     "chunk_id": i
    #                 }
    #             ))
    #     if points:
    #         qdrant.upsert(collection_name=qdrant_collection_chunks, points=points)