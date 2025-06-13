# extract_service.py (Fixed Ollama Call)

import os
import json
import re
import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_path
import tempfile
from werkzeug.utils import secure_filename
from flask import request

from ..services.websocket.ws import WebsocketService
from .gpt_service import call_ollama
from src.utils.vector_store import store_document_chunks, store_extracted_rules
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


class ExtractService:
    def __init__(self):
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
        text = []

        for i in range(len(doc)):
            page_text = doc[i].get_text().strip()
            if len(page_text) > 20:
                text.append(page_text)
            else:
                print(f"📸 OCR fallback for page {i+1}")
                with tempfile.TemporaryDirectory() as path:
                    images = convert_from_path(
                        filepath, first_page=i+1, last_page=i+1, output_folder=path)
                    if images:
                        ocr_text = pytesseract.image_to_string(images[0])
                        text.append(ocr_text)

        final_text = "\n".join(text).strip()
        word_count = len(final_text.split())

        self.ws.send_progress_update(
            f"📄 Total words: {word_count}"
        )
        return "\n".join(text)

    def process_document(self, request):
        if not request.form.get("model"):
            return {"error": "No model selected"}, 400
        if not request.files.get("file"):
            return {"error": "No file uploaded"}, 400

        print("📥 Upload received")
        self.ws.send_progress_update(
            "📥 Upload received"
        )
        self.model = request.form.get("model")
        self.file = request.files.get("file")

        filename = secure_filename(self.file.filename)
        filepath = os.path.join(self.upload_folder, filename)
        doc_id = os.path.splitext(filename)[0]
        json_path = os.path.join(self.output_folder, f"{doc_id}.json")

        self.file.save(filepath)
        print(f"📄 File saved at {filepath}")
        self.ws.send_progress_update(
            f"📄 File saved at {filepath}"
        )

        print("🧾 Extracting full text from PDF...")
        self.ws.send_progress_update(
            "🧾 Extracting full text from PDF..."
        )
        full_text = self.extract_text_with_ocr(filepath)

        print("🧠 Storing chunks to Qdrant...")
        self.ws.send_progress_update(
            "🧠 Storing chunks to Qdrant..."
        )
        store_document_chunks(full_text, doc_id)

        from src.utils.vector_store import search_chunks_and_rules
        rules = []
        print("📑 Extracting rules from stored chunks...")
        self.ws.send_progress_update(
            "📑 Extracting rules from stored chunks..."
        )
        chunks_only = search_chunks_and_rules(
            "Extract security and compliance rules", doc_id, top_k=30)

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

        combined_text = "\n".join(combined)

        rules = self.extract_compliance_rules_from_text(
            combined_text, framework=doc_id)
        print(f"📊 Extracted {len(rules)} rules.")

        self.ws.send_progress_update(
            f"📊 Extracted {len(rules)} rules."
        )

        if rules:
            print("🛡️ Storing rules to Qdrant...")
            store_extracted_rules(rules, doc_id)
            print(f"💾 Saving rules JSON to: {json_path}")
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(rules, f, indent=2)
            self.create_terraform_template(combined_text)
        print("✅ Processing completed.")
        self.ws.send_progress_update(
            "✅ Processing completed."
        )
        return {"message": "✅ Uploaded and processed", "rules_saved": f"{doc_id}.json"}

    def extract_compliance_rules_from_text(self, text, framework="Custom"):
        try:
            self.ws.send_progress_update(f"Using model: {self.model}")
            # Step 1: Summarize chunks
            system_prompt_1 = "You are a document summarization assistant. Summarize key actionable security and compliance concepts."
            user_prompt_1 = f"""
    Summarize the following document into bullet points highlighting rules, requirements, or obligations:

    {text}
    """
            summary = call_ollama(
                system_prompt_1, user_prompt_1, model=self.model)

            with open(f"debug_summary_{framework}.txt", "w", encoding="utf-8") as f:
                f.write(summary)

            # Step 2: Extract rules from the summary
            system_prompt_2 = "You are a cybersecurity compliance rule extraction AI."
            user_prompt_2 = f"""
    You are a cybersecurity compliance rule extraction AI.

    Your job is to extract clear, cloud-agnostic security compliance rules from the summary of a security document. These rules should be specific, actionable best practices.

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
            "Creating tf template"
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
                system_prompt_1, user_prompt_1, model=self.model)

            tf_filename = f"tf_{self.model}_template.tf"
            tf_path = os.path.join(self.output_folder, tf_filename)
            
            with open(tf_path, "w", encoding="utf-8") as f:
                f.write(response)

            print(f"📥 Ollama tf response preview: {response}")
            self.ws.send_progress_update(
                f"📥 Terraform template saved to: {tf_path}", tf=response)

        except Exception as e:
            print("❌ Ollama rule extraction failed:", e)
            return []

    @staticmethod
    def list_documents():
        output_folder = os.getenv("OUTPUT_FOLDER", os.path.join(
            os.path.dirname(__file__), "../cloud_outputs"))
        if not os.path.exists(output_folder):
            print("⚠️ cloud_outputs folder not found.")
            return []
        return [f.replace(".json", "") for f in os.listdir(output_folder) if f.endswith(".json")]
