# Updated by Harsimran Kaur
# Changed methods ensure_collection_exists to static method
# Added batch  processing for summarization
# Added MongoDB storage for summaries
# Changed the way rules are extracted, providing aggregated summary as input to extract_compliance_rules_from_text method



import os
import json
import re
import fitz  # PyMuPDF
import pytesseract
import tempfile
from werkzeug.utils import secure_filename
from flask import request
from more_itertools import chunked
from pymongo import MongoClient
from datetime import datetime
from pymongo import MongoClient
from datetime import datetime

from ..utils.functions import remove_special_chars  # pip install more-itertools
from .websocket.ServiceWebsocket import WebsocketService
from .gpt_service import call_ollama
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from uuid import uuid4
from src.services.gpt_service import OllamaEmbedder
from qdrant_client.http.exceptions import UnexpectedResponse

class ExtractService:
    def __init__(self, sessionID):
        self.session = sessionID
        self.ws = WebsocketService()
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.upload_folder = os.getenv("UPLOAD_FOLDER", os.path.join(self.base_dir, "../input_files/uploads"))
        self.output_folder = os.getenv("OUTPUT_FOLDER", os.path.join(self.base_dir, "../output_files/json_rules_output"))
        os.makedirs(self.upload_folder, exist_ok=True)
        os.makedirs(self.output_folder, exist_ok=True)
        self.summary_folder = os.path.join(self.base_dir, "../output_files/document_summaries")
        os.makedirs(self.summary_folder, exist_ok=True)

        # Set up Qdrant client
        qdrant_host = os.getenv("QDRANT_HOST")
        qdrant_port = int(os.getenv("QDRANT_PORT", "6333"))
        self.qdrant = QdrantClient(host=qdrant_host, port=qdrant_port)
        
        # Initialize embedder
        self.embedder = OllamaEmbedder()

        # Collection names as instance variables
        self.collection_chunks = "framework_chunks"
        self.collection_rules = "framework_rules"
        self.collection_logs = "qdrant_collection_processing_logs"

        # Ensure collections exist
        self.ensure_collection_exists(self.collection_chunks)
        self.ensure_collection_exists(self.collection_rules)
        self.ensure_collection_exists(self.collection_logs)

        # MongoDB setup
        mongo_uri = os.getenv("MONGO_URI")
        self.mongo_client = MongoClient(mongo_uri)
        self.mongo_db = self.mongo_client["Skylock"]
        self.mongo_collection = self.mongo_db["Framework_Document_Summary"]

    @staticmethod
    def ensure_collection_exists(collection_name, size=2048):
        # Need to create a client since we can't use self
        qdrant_host = os.getenv("QDRANT_HOST")
        qdrant_port = int(os.getenv("QDRANT_PORT", "6333"))
        qdrant = QdrantClient(host=qdrant_host, port=qdrant_port)

        try:
            qdrant.get_collection(collection_name)
            print(f"✅ Collection '{collection_name}' already exists.")
        except UnexpectedResponse:
            print(f"📦 Creating missing collection: {collection_name}")
            qdrant.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=size, distance=Distance.COSINE)
            )

    def extract_text_with_ocr(self, filepath):
        doc = fitz.open(filepath)
        extracted_text = []
        for i, page in enumerate(doc):
            text = page.get_text().strip()
            if len(text) > 20:
                extracted_text.append(text)
            else:
                print(f"📸 OCR fallback for page {i+1}")
        final_text = "\n".join(extracted_text).strip()
        self.ws.send_progress_update(session=self.session, message=f"📄 Total words: {len(final_text.split())}")
        return final_text

    def extract_compliance_rules_from_text(self, final_summary, framework="Custom"):
        try:
            self.ws.send_progress_update(
                session=self.session,
                message=f"Extracting rules from text using model: {self.model}"
            )

            system_prompt = "You are a cybersecurity compliance rule extraction AI."
            user_prompt = f"""
    You are a cybersecurity compliance rule extraction AI.

    Your job is to extract clear, cloud-agnostic security compliance rules from a summary of a security document. These rules should be specific, actionable best practices.

    Here are a few examples (output must be a valid JSON array, with no extra text):

    [
    {{
        "rule": "Encrypt all sensitive data at rest and in transit.",
        "category": "Data Protection",
        "framework": "{framework}"
    }},
    {{
        "rule": "Limit access to patient records using role-based permissions.",
        "category": "Identity and Access Management",
        "framework": "{framework}"
    }}
    ]

    Now extract as many rules as you can (ideally more than 15) from the following summary and return ONLY a valid JSON array.
    Do NOT include any explanations, markdown, or extra text before or after the array.

    SUMMARY:
    {final_summary}
"""
            response = call_ollama(system_prompt, user_prompt, model=self.model)

            # with open(f"debug_ollama_output_{framework}.txt", "w", encoding="utf-8") as f:
            #     f.write(response)
            # with open(f"debug_ollama_output_{framework}.txt", "w", encoding="utf-8") as f:
            #     f.write(response)

#             print("📥 Ollama response preview:\n", response[:300])

            matches = re.findall(r"\[.*\]", response, re.DOTALL)
            if not matches:
                raise ValueError("❌ No JSON array found in Ollama response")
            json_blob = matches[0]
            matches = re.findall(r"\[.*\]", response, re.DOTALL)
            if not matches:
                raise ValueError("❌ No JSON array found in Ollama response")
            json_blob = matches[0]
            parsed = json.loads(json_blob)

            return [
                dict(
                    rule=rule.get("rule", ""),
                    category=rule.get("category", ""),
                    framework=framework
                )
                for rule in parsed if "rule" in rule
            ]

        except Exception as e:
            print("❌ Ollama rule extraction failed:", e)
            return []
        
        
# Summarization helper
    def summarize_batch(self, text):
        system_prompt = "You are a compliance summarization AI."
        user_prompt = f"""
You will be given a section of a cybersecurity or compliance document.
Your job is to extract only actionable compliance concepts, requirements, obligations, or best practices.
Respond ONLY with a numbered bullet list. 
Do NOT include titles, markdown headers, or any text before or after the list.
If the text contains no actionable content, write "No actionable content found."

DOCUMENT SECTION:

{text}
"""
        summary = call_ollama(system_prompt, user_prompt, model=self.model)  # <-- Pass model here
        return summary.strip()
    
    # def process_document(self, request):
    #     if not request.form.get("model") or not request.form.get("framework") or not request.files.get("file"):
    #         return {"error": "Missing required fields"}, 400

    #     self.model = request.form.get("model")
    #     self.framework = request.form.get("framework")
    #     self.file = request.files.get("file")

    #     filename = f"{remove_special_chars(self.model)}_{secure_filename(self.file.filename)}"
    #     filepath = os.path.join(self.upload_folder, filename)
    #     doc_id = os.path.splitext(filename)[0]
    #     json_path = os.path.join(self.output_folder, f"{doc_id}.json")

    #     self.file.save(filepath)
    #     self.ws.send_progress_update(session=self.session, message=f"📄 File saved at {filepath}")
    #     full_text = self.extract_text_with_ocr(filepath)

    #     self.ws.send_progress_update(session=self.session, message="🧠 Storing chunks to Qdrant...")
    #     self.store_document_chunks(full_text, doc_id)

    #     # --- updated by harsimran # old logic need to be removed ---
    #     # from src.utils.vector_store import search_chunks_and_rules
    #     # chunks_only = search_chunks_and_rules("Extract security and compliance rules", doc_id, top_k=30)

    #     chunks_only = get_all_chunks_by_doc_id(doc_id)  # <-- new working scroll-based logic

    #     max_token_limit = 6000
    #     combined = []
    #     current_token_count = 0

    #     for chunk in chunks_only:
    #         chunk_text = chunk.get("chunk", "")
    #         token_estimate = int(len(chunk_text.split()) * 1.3)
    #         if current_token_count + token_estimate <= max_token_limit:
    #             combined.append(chunk_text)
    #             current_token_count += token_estimate
    #         else:
    #             break

    #     combined_text = "\n".join(combined)
    #     rules = self.extract_compliance_rules_from_text(combined_text, framework=doc_id)

    #     self.ws.send_progress_update(session=self.session, message=f"📊 Extracted {len(rules)} rules.")
    #     if rules:
    #         self.store_extracted_rule   s(rules, doc_id)
    #         with open(json_path, "w", encoding="utf-8") as f:
    #             json.dump(rules, f, indent=2)
    #         self.create_terraform_template(combined_text)

    #     self.ws.send_progress_update(session=self.session, message="✅ Processing completed, rules_saved.")
    #     return {"message": "✅ Uploaded and processed", "rules_saved": f"{doc_id}.json"}

    
    def process_document(self, request):
        if not request.form.get("model") or not request.form.get("framework") or not request.files.get("file"):
            return {"error": "Missing required fields"}, 400

        self.model = request.form.get("model")
        self.framework = request.form.get("framework")
        self.file = request.files.get("file")

        filename = f"{remove_special_chars(self.model)}_{secure_filename(self.file.filename)}"
        filepath = os.path.join(self.upload_folder, filename)
        doc_id = os.path.splitext(filename)[0]
        json_path = os.path.join(self.output_folder, f"{doc_id}.json")
        summary_path = os.path.join(self.summary_folder, f"summary_{doc_id}.txt")

        print(f"Processing document: {doc_id}")  # <--- Add here

        self.file.save(filepath)
        self.ws.send_progress_update(session=self.session, message=f"📄 File saved at {filepath}")
        full_text = self.extract_text_with_ocr(filepath)

        self.ws.send_progress_update(session=self.session, message="🧠 Storing chunks to Qdrant...")
        self.store_document_chunks(full_text, doc_id)

        chunks_only = self.get_all_chunks_by_doc_id(doc_id)  # scroll-based logic
        self.ws.send_progress_update(session=self.session, message=f"✅ Retrieved {len(chunks_only)} chunks")

        # Updated by Harsimran Kaur
        rules = []
        batch_summaries = []
        current_batch = []
        current_tokens = 0
        max_token_limit = 6000
        total_chunks = len(chunks_only)
        batch_count = 0

        for idx, chunk in enumerate(chunks_only):
            chunk_text = chunk.get("chunk", "")
            token_estimate = int(len(chunk_text.split()) * 1.3)

            if current_tokens + token_estimate <= max_token_limit:
                current_batch.append(chunk_text)
                current_tokens += token_estimate
            else:
                batch_count += 1
                print(f"🔄 Processing batch {batch_count} of {total_chunks} chunks")
                self.ws.send_progress_update(session=self.session, message=f"🔄 Processing batch {batch_count}")
                combined_text = "\n".join(current_batch)
                summary = self.summarize_batch(combined_text)
                batch_summaries.append(summary)
                # rules += self.extract_compliance_rules_from_text(summary, framework=doc_id)
                current_batch = [chunk_text]
                current_tokens = token_estimate

        if current_batch:
            batch_count += 1
            print(f"🔄 Processing final batch {batch_count} of {total_chunks} chunks")
            self.ws.send_progress_update(session=self.session, message=f"🔄 Processing final batch {batch_count}")
            combined_text = "\n".join(current_batch)
            summary = self.summarize_batch(combined_text)
            batch_summaries.append(summary)
            # rules += self.extract_compliance_rules_from_text(summary, framework=doc_id)

        final_summary = "\n\n".join(batch_summaries)
        
        with open(summary_path, "w", encoding="utf-8") as f:
            f.write(final_summary)
        print(f"📝 Summary saved at: {summary_path}")

        # Save summary to MongoDB
        summary_doc = {
            "doc_id": doc_id,
            "framework": self.framework,
            "model": self.model,
            "summary": final_summary,
            "timestamp": datetime.now()
        }
        self.mongo_collection.insert_one(summary_doc)
        print(f"📝 Summary saved to MongoDB for doc_id: {doc_id}")

        rules = self.extract_compliance_rules_from_text(final_summary, framework=doc_id)
        self.ws.send_progress_update(session=self.session, message=f"📊 Extracted {len(rules)} rules.")
        if rules:
            self.store_extracted_rules(rules, doc_id)
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(rules, f, indent=2)
            print(f"💾 Rules saved at: {json_path}")

        print("✅ Processing completed.")
        self.ws.send_progress_update(session=self.session, message="✅ Processing completed, rules_ready.")
        return {
            "message": "✅ Uploaded and processed",
            "rules_saved": f"{doc_id}.json",
            "summary_saved": f"summary_{doc_id}.txt"
        }

    def store_document_chunks(self, text, doc_id):
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        self.chunk_size = 800
        self.chunk_overlap = 100
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap)
        chunks = splitter.split_text(text)
        print(f"📄 Splitting into {len(chunks)} chunks")
        
        self.ws.send_progress_update(
            session=self.session,
            message=f"📄 Splitting into {len(chunks)} chunks"
        )

        points = []
        totalChunks = len(chunks)

        for i, chunk in enumerate(chunks, start=1):
            embedding = self.embedder.embed(chunk)  # Now returns single embedding
            msg = f"Chunk: {i} of {totalChunks}"
            
            self.ws.send_progress_update(
                session=self.session,
                message=msg,
                current_page=i,
                total_pages=len(chunks),
            )

            if embedding:
                self.ws.send_progress_update(
                    message=f"Generating embedding for chunk {i + 1}/{len(chunks)}...",
                    progress=(i + 1) / len(chunks)
                )
                points.append(PointStruct(
                    id=str(uuid4()),
                    vector=embedding,
                    payload={
                        "doc_id": doc_id,
                        "chunk": chunk,
                        "chunk_id": i,
                        "framework": self.framework,
                        "chunk_size": self.chunk_size,
                        "chunk_overlap": self.chunk_overlap,
                    }
                ))

                # qdrant.upsert(
                #     collection_name=qdrant_collection_chunks, points=points)
        if points:
            # qdrant.upsert(
            #     collection_name=qdrant_collection_chunks, points=points)

            BATCH_SIZE = 200  # Adjust depending on size of each point
            for batch in chunked(points, BATCH_SIZE):
                self.qdrant.upsert(
                    collection_name=self.collection_chunks,
                    points=batch
                )

    def store_extracted_rules(self, rules, doc_id):
        points = []
        for i, rule in enumerate(rules):

            rule_text = rule.get("rule")
            if rule_text:
                # Now returns single embedding
                embedding = self.embedder.embed(rule_text)
                if embedding:
                    points.append(PointStruct(
                        id=str(uuid4()),
                        vector=embedding,
                        payload={
                            "doc_id": doc_id,
                            "rule": rule_text,
                            "category": rule.get("category", ""),
                            "framework": rule.get("framework", ""),
                            "rule_id": f"{doc_id}_rule_{i}",
                            "model": self.model,
                            "framework": self.framework,
                        }
                    ))
        if points:
            self.qdrant.upsert(collection_name="framework_rules", points=points)
            print(f"📥 Stored {len(points)} rules to Qdrant for doc_id: {doc_id}")

    def query_similar_rules(self, query, doc_id, top_k=10):
        embedding = self.embedder.embed(query)  # Now returns single embedding
        if not embedding:
            return []

        results = self.qdrant.search(
            collection_name=self.collection_rules,
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(
                    key="doc_id", match=MatchValue(value=doc_id))]
            )
        )
        return [{"score": r.score, "content": r.payload.get("rule")} for r in results]

    def search_chunks_and_rules(self, query, doc_id, top_k=30):
        embedding = self.embedder.embed(query)  # Now returns single embedding
        if not embedding:
            return []

        chunk_results = self.qdrant.search(
            collection_name=self.collection_chunks,
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(
                    key="doc_id", match=MatchValue(value=doc_id))]
            )
        )

        rule_results = self.qdrant.search(
            collection_name=self.qdrant_collection_rules,
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(
                    key="doc_id", match=MatchValue(value=doc_id))]
            )
        )

#         combined = [
#             {"score": r.score, "content": r.payload.get(
#                 "chunk") or r.payload.get("rule")}
#             for r in (chunk_results + rule_results)
#         ]
#         return sorted(combined, key=lambda x: -x["score"])[:top_k]


    def get_available_doc_ids(self):
        # Qdrant has no built-in list for unique doc_ids, so simulate by scanning all payloads
        hits = self.qdrant.scroll(
            collection_name=self.collection_chunks, limit=1000)[0]
        return list(set([pt.payload.get("doc_id") for pt in hits if pt.payload.get("doc_id")]))

    @staticmethod
    def list_documents():
        output_folder = os.getenv("OUTPUT_FOLDER", os.path.join(
            os.path.dirname(__file__), "../cloud_outputs"))
        if not os.path.exists(output_folder):
            print("⚠️ cloud_outputs folder not found.")
            return []
        return [f.replace(".json", "") for f in os.listdir(output_folder) if f.endswith(".json")]
    
    # Retrieve all chunks
    def get_all_chunks_by_doc_id(self, doc_id):
        all_chunks = []
        scroll_offset = None
        while True:
            results, next_offset = self.qdrant.scroll(
                collection_name="framework_chunks",
                scroll_filter=Filter(
                    must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
                ),
                limit=256,
                offset=scroll_offset
            )
            all_chunks.extend([pt.payload for pt in results])
            if not next_offset:
                break
            scroll_offset = next_offset
        return all_chunks
