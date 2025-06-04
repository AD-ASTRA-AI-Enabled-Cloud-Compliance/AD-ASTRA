# extract_service.py (Updated for Full PDF Rule Extraction via Ollama + Chunking)

import os
import json
import re
import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_path
import tempfile
from werkzeug.utils import secure_filename
from flask import request
from .gpt_service import call_ollama
from src.utils.vector_store import store_document_chunks, store_extracted_rules
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "../uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "../cloud_outputs")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# 🔍 OCR fallback logic (reads full document)
def extract_text_with_ocr(filepath):
    doc = fitz.open(filepath)
    text = []

    for i in range(len(doc)):  # ✅ Read entire document now
        page_text = doc[i].get_text().strip()
        if len(page_text) > 20:
            text.append(page_text)
        else:
            print(f"📸 OCR fallback for page {i+1}")
            with tempfile.TemporaryDirectory() as path:
                images = convert_from_path(filepath, first_page=i+1, last_page=i+1, output_folder=path)
                if images:
                    ocr_text = pytesseract.image_to_string(images[0])
                    text.append(ocr_text)

    return "\n".join(text)

# 📥 Main upload handler
def process_document(req):
    print("📥 Upload received")

    file = req.files.get("file")
    if not file:
        return {"error": "No file uploaded"}, 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    doc_id = os.path.splitext(filename)[0]
    json_path = os.path.join(OUTPUT_FOLDER, f"{doc_id}.json")

    file.save(filepath)
    print(f"📄 File saved at {filepath}")

    print("🧾 Extracting full text from PDF...")
    full_text = extract_text_with_ocr(filepath)

    print("🧠 Storing chunks to Qdrant...")
    store_document_chunks(full_text, doc_id)

    # ✨ New: Extract rules directly from chunks
    from src.utils.vector_store import search_chunks_and_rules
    rules = []
    print("📑 Extracting rules from stored chunks...")
    chunks_only = search_chunks_and_rules("Extract security and compliance rules", doc_id, top_k=30)
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

    rules = extract_compliance_rules_from_text(combined_text, framework=doc_id)
    print(f"📊 Extracted {len(rules)} rules.")

    if rules:
        print("🛡️ Storing rules to Qdrant...")
        store_extracted_rules(rules, doc_id)

        print(f"💾 Saving rules JSON to: {json_path}")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(rules, f, indent=2)

        # count_rules_in_qdrant(doc_id)

    print("✅ Processing completed.")
    return {"message": "✅ Uploaded and processed", "rules_saved": f"{doc_id}.json"}


# 🧠 Rule extraction logic (Ollama)
def extract_compliance_rules_from_text(text, framework="Custom"):
    # Step 1: Summarize first to help small models like Gemma
    summary_prompt = f"""
You are a document summarization assistant.
Summarize the key actionable security and compliance concepts from this document.
Return only bullet points that highlight rules, requirements, or obligations:

{text}
"""
    summary = call_ollama(summary_prompt)
    with open(f"debug_summary_{framework}.txt", "w", encoding="utf-8") as f:
        f.write(summary)

    # Step 2: Use few-shot prompt with summary for rule extraction
    prompt = f"""
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
    try:
        response = call_ollama(prompt)
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

# 📄 Safely list JSON rule documents
def list_documents():
    if not os.path.exists(OUTPUT_FOLDER):
        print("⚠️ cloud_outputs folder not found.")
        return []
    return [f.replace(".json", "") for f in os.listdir(OUTPUT_FOLDER) if f.endswith(".json")]

# 🧪 Rule count check utility
# def count_rules_in_qdrant(doc_id):
#     try:
#         client = QdrantClient(host="localhost", port=6333)
#         count = client.count(
#             collection_name="framework_rules",
#             exact=True,
#             filter=Filter(
#                 must=[FieldCondition(key="doc_id", match=MatchValue(value=doc_id))]
#             )
#         ).count
#         print(f"🔢 Qdrant rule count for '{doc_id}': {count}")
#         return count
#     except Exception as e:
#         print(f"❌ Failed to count rules in Qdrant: {e}")
#         return 0
