# extract_service.py (Fixed Ollama Call)

import os
import json
import re
import fitz  # PyMuPDF
import pytesseract
# from pdf2image import convert_from_path
import tempfile
from werkzeug.utils import secure_filename
from flask import request

from more_itertools import chunked

from ..utils.functions import remove_special_chars  # pip install more-itertools
from ..utils.vector_store import ensure_collection_exists

from ..services.websocket.ws import WebsocketService
from .gpt_service import call_ollama
# from src.utils.vector_store import store_document_chunks, store_extracted_rules
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue


from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from uuid import uuid4
from src.services.websocket.ws import WebsocketService
from src.services.gpt_service import OllamaEmbedder
from qdrant_client.http.exceptions import UnexpectedResponse
from qdrant_client.models import VectorParams, Distance
import os

qdrant = QdrantClient(host="localhost", port=6333)

# Initialize collections
qdrant_collection_chunks = "framework_chunks"
qdrant_collection_rules = "framework_rules"

embedder = OllamaEmbedder()

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ensure_collection_exists("framework_chunks")
ensure_collection_exists("framework_rules")


class ExtractService:
    def __init__(self, sessionID):
        self.session = sessionID
        self.ws = WebsocketService()
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.upload_folder = os.getenv("UPLOAD_FOLDER", os.path.join(
            os.path.dirname(__file__), "../uploads"))
        self.output_folder = os.getenv("OUTPUT_FOLDER", os.path.join(
            os.path.dirname(__file__), "../cloud_outputs"))
        self.upload_folder = os.path.abspath(self.upload_folder)
        self.output_folder = os.path.abspath(self.output_folder)
        os.makedirs(self.upload_folder, exist_ok=True)
        os.makedirs(self.output_folder, exist_ok=True)

    def extract_text_with_ocr(self, filepath):
        doc = fitz.open(filepath)
        extracted_text = []

        for i, page in enumerate(doc):
            text = page.get_text().strip()
            if len(text) > 20:
                extracted_text.append(text)
            else:
                print(f"📸 OCR fallback for page {i+1}")
                # self.ws.send_progress_update(f"📸 OCR fallback for page {i+1}")

                # # Render page as image using PyMuPDF
                # pix = page.get_pixmap(dpi=300)
                # img_bytes = pix.tobytes("png")
                # img = Image.open(io.BytesIO(img_bytes))

                # # Run OCR
                # ocr_text = pytesseract.image_to_string(img).strip()
                # extracted_text.append(ocr_text)

        final_text = "\n".join(extracted_text).strip()
        word_count = len(final_text.split())

        self.ws.send_progress_update(
            session=self.session,
            message=f"📄 Total words: {word_count}")
        return final_text

    def process_document(self, request):
        if not request.form.get("model"):
            return {"error": "No model selected"}, 400
        if not request.form.get("framework"):
            return {"error": "No model selected"}, 400
        if not request.files.get("file"):
            return {"error": "No file uploaded"}, 400

        print("📥 Upload received")

        self.ws.send_progress_update(
            session=self.session,
            message="📥 Upload received"
        )
        self.model = request.form.get("model")
        self.framework = request.form.get("framework")
        self.file = request.files.get("file")

        filename = f"{remove_special_chars(self.model)}_{secure_filename(self.file.filename)}"
        filepath = os.path.join(self.upload_folder, filename)
        doc_id = os.path.splitext(filename)[0]
        json_path = os.path.join(self.output_folder, f"{doc_id}.json")

        self.file.save(filepath)
        print(f"📄 File saved at {filepath}")

        self.ws.send_progress_update(
            session=self.session,
            message="📄 File saved at {filepath}"
        )

        print("🧾 Extracting full text from PDF...")

        self.ws.send_progress_update(
            session=self.session,
            message="🧾 Extracting full text from PDF..."
        )
        full_text = self.extract_text_with_ocr(filepath)

        print("🧠 Storing chunks to Qdrant...")
        self.ws.send_progress_update(
            session=self.session,
            message="🧠 Storing chunks to Qdrant..."
        )
        self.store_document_chunks(full_text, doc_id)

        from src.utils.vector_store import search_chunks_and_rules
        rules = []
        print("📑 Extracting rules from stored chunks...")
        self.ws.send_progress_update(
            session=self.session,
            message="📑 Extracting rules from stored chunks..."
        )
        chunks_only = search_chunks_and_rules(
            "Extract security and compliance rules", doc_id, top_k=30)

        max_token_limit = 6000
        combined = []
        current_token_count = 0
        max_token_limit = 6000
        combined = []
        current_token_count = 0

        for chunk in chunks_only:
            chunk_text = chunk["content"]
            token_estimate = int(len(chunk_text.split()) * 1.3)
            if current_token_count + token_estimate <= max_token_limit:
                combined.append(chunk_text)
                current_token_count += token_estimate
            else:
                break
        for chunk in chunks_only:
            chunk_text = chunk["content"]
            token_estimate = int(len(chunk_text.split()) * 1.3)
            if current_token_count + token_estimate <= max_token_limit:
                combined.append(chunk_text)
                current_token_count += token_estimate
            else:
                break

        combined_text = "\n".join(combined)
        combined_text = "\n".join(combined)

        rules = self.extract_compliance_rules_from_text(
            combined_text, framework=doc_id)

        self.ws.send_progress_update(
            session=self.session,
            message=f"📊 Extracted {len(rules)} rules."
        )

        if rules:
            print("🛡️ Storing rules to Qdrant...")
            self.store_extracted_rules(rules, doc_id)
            print(f"💾 Saving rules JSON to: {json_path}")
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(rules, f, indent=2)
            self.create_terraform_template(combined_text)
        print("✅ Processing completed.")
        self.ws.send_progress_update(
            session=self.session,
            message="✅ Processing completed, rules_saved."
        )
        return {"message": "✅ Uploaded and processed", "rules_saved": f"{doc_id}.json"}

    def extract_compliance_rules_from_text(self, text, framework="Custom"):
        try:
            self.ws.send_progress_update(
                session=self.session,
                message=f"Extracting rules from text sing model: {self.model}")
            # Step 1: Summarize chunks
            system_prompt_1 = "You are a document summarization assistant. Summarize key actionable security and compliance concepts."
            user_prompt_1 = f"""
    Summarize the following document into bullet points highlighting rules, requirements, or obligations:

    {text}
    """
            summary = call_ollama(
                system_prompt_1, user_prompt_1, model=self.model)
    {text}
    """
            summary = call_ollama(
                system_prompt_1, user_prompt_1, model=self.model)

            with open(f"debug_summary_{framework}_{remove_special_chars(self.model)}.txt", "w", encoding="utf-8") as f:
                f.write(summary)

            # Step 2: Extract rules from the summary
            system_prompt_2 = "You are a cybersecurity compliance rule extraction AI."
            user_prompt_2 = f"""
    You are a cybersecurity compliance rule extraction AI.
            # Step 2: Extract rules from the summary
            system_prompt_2 = "You are a cybersecurity compliance rule extraction AI."
            user_prompt_2 = f"""
    You are a cybersecurity compliance rule extraction AI.

    Your job is to extract clear, cloud-agnostic security compliance rules from the summary of a security document. These rules should be specific, actionable best practices.
    Your job is to extract clear, cloud-agnostic security compliance rules from the summary of a security document. These rules should be specific, actionable best practices.

    Here are a few examples:
    Here are a few examples:

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

    Now extract more rules from the following summary and return them as a valid JSON array (no explanations or formatting):

    {summary}
    """
            response = call_ollama(
                system_prompt_2, user_prompt_2, model=self.model)

            with open(f"debug_ollama_output_{framework}.txt", "w", encoding="utf-8") as f:
                f.write(response)

            print("📥 Ollama response preview:\n", response[:300])

            match = re.search(r"(\{.*\}|\[.*\])", response, re.DOTALL)
            if not match:
                raise ValueError("❌ No JSON found in Ollama response")

            json_blob = match.group(0)
            parsed = json.loads(json_blob)

            if isinstance(parsed, list):
                return [dict(rule=rule.get("rule", ""), category=rule.get("category", ""), framework=framework)
                        for rule in parsed if "rule" in rule]
            elif isinstance(parsed, dict) and "rules" in parsed:
                return [dict(rule=rule.get("rule", ""), category=rule.get("category", ""), framework=framework)
                        for rule in parsed["rules"] if "rule" in rule]
            else:
                raise ValueError("❌ Unexpected JSON structure")

        except Exception as e:
            print("❌ Ollama rule extraction failed:", e)
            return []

    def create_terraform_template(self, text, framework="Custom"):
        self.ws.send_progress_update(
            session=self.session,
            message="Creating tf template"
        )
        try:
            # Step 1: Summarize chunks
            system_prompt_1 = "Generate a terraform template, without additional explanations. add a variables block and map" \
                "to the terraform body"
            user_prompt_1 = f"""
                From the following rules, generate the terraform template for the following services: VM, storage and databases
                in azure.
                            
            # azure-blanket-iac/
            # ├── main.tf
            # ├── variables.tf
            # ├── outputs.tf
            # ├── modules/
            # │   ├── security-monitoring/
            # │   │   ├── main.tf
            # │   │   ├── variables.tf
            # │   │   └── outputs.tf
            # │   ├── data-encryption/
            # │   │   ├── main.tf
            # │   │   ├── variables.tf
            # │   │   └── outputs.tf
            # │   ├── access-management/
            # │   │   ├── main.tf
            # │   │   ├── variables.tf
            # │   │   └── outputs.tf
            # │   └── disaster-recovery/
            # │       ├── main.tf
            # │       ├── variables.tf
            # │       └── outputs.tf
            # └── README.md
            #
                {text}
                """
            response = call_ollama(
                system_prompt_1, user_prompt_1, model="codeup")

            tf_filename = f"tf_template.txt"
            tf_path = os.path.join(self.output_folder, tf_filename)

            with open(tf_path, "w", encoding="utf-8") as f:
                f.write(response)

            print(f"📥 Ollama tf response preview: {response}")
            self.ws.send_progress_update(
                session=self.session,
                message=f"📥 Terraform template saved to: {tf_path}")

        except Exception as e:
            print("❌ Ollama rule extraction failed:", e)
            return []

    def store_document_chunks(self, text, doc_id):
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        self.chunk_size = 800
        self.chunk_overlap = 100
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap)
        chunks = splitter.split_text(text)
        # print(f"📄 Splitting into {len(chunks)} chunks")

        self.ws.send_progress_update(
            session=self.session,
            message=f"📄 Splitting into {len(chunks)} chunks"
        )

        points = []
        totalChunks = len(chunks)

        for i, chunk in enumerate(chunks, start=1):
            embedding = embedder.embed(chunk)  # Now returns single embedding
            msg = f"Chunk: {i} of {totalChunks}"
            self.ws.send_progress_update(
                session=self.session,
                message=msg,
                current_page=i,
                total_pages=len(chunks),
            )

            if embedding:
                # ws.send_progress_update(
                #     message=f"Generating embedding for chunk {i + 1}/{len(chunks)}...",
                #     progress=(i + 1) / len(chunks)
                # )
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
                qdrant.upsert(
                    collection_name=qdrant_collection_chunks,
                    points=batch
                )

    def store_extracted_rules(self, rules, doc_id):
        points = []
        for i, rule in enumerate(rules):

            rule_text = rule.get("rule")
            if rule_text:
                # Now returns single embedding
                embedding = embedder.embed(rule_text)
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
            qdrant.upsert(collection_name="framework_rules", points=points)

    def query_similar_rules(self, query, doc_id, top_k=10):
        embedding = embedder.embed(query)  # Now returns single embedding
        if not embedding:
            return []

        results = qdrant.search(
            collection_name=qdrant_collection_rules,
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(
                    key="doc_id", match=MatchValue(value=doc_id))]
            )
        )
        return [{"score": r.score, "content": r.payload.get("rule")} for r in results]

    def search_chunks_and_rules(self, query, doc_id, top_k=30):
        embedding = embedder.embed(query)  # Now returns single embedding
        if not embedding:
            return []

        chunk_results = qdrant.search(
            collection_name=qdrant_collection_chunks,
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(
                    key="doc_id", match=MatchValue(value=doc_id))]
            )
        )

        rule_results = qdrant.search(
            collection_name=qdrant_collection_rules,
            query_vector=embedding,
            limit=top_k,
            query_filter=Filter(
                must=[FieldCondition(
                    key="doc_id", match=MatchValue(value=doc_id))]
            )
        )

        combined = [
            {"score": r.score, "content": r.payload.get(
                "chunk") or r.payload.get("rule")}
            for r in (chunk_results + rule_results)
        ]
        return sorted(combined, key=lambda x: -x["score"])[:top_k]


    def get_available_doc_ids():
        # Qdrant has no built-in list for unique doc_ids, so simulate by scanning all payloads
        hits = qdrant.scroll(
            collection_name=qdrant_collection_chunks, limit=1000)[0]
        return list(set([pt.payload.get("doc_id") for pt in hits if pt.payload.get("doc_id")]))

    @staticmethod
    def list_documents():
        output_folder = os.getenv("OUTPUT_FOLDER", os.path.join(
            os.path.dirname(__file__), "../cloud_outputs"))
        if not os.path.exists(output_folder):
            print("⚠️ cloud_outputs folder not found.")
            return []
        return [f.replace(".json", "") for f in os.listdir(output_folder) if f.endswith(".json")]
