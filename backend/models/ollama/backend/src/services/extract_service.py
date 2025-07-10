# # extract_service.py (Fixed Ollama Call)

# import os
# import json
# import re
# import fitz  # PyMuPDF
# import pytesseract
# # from pdf2image import convert_from_path
# import tempfile
# from werkzeug.utils import secure_filename

# from more_itertools import chunked

# from ..utils.db_connection import MongoDB

# from ..utils.functions import remove_special_chars, mergePrompts
# from ..utils.vector_store import ensure_collection_exists

# from .websocket.ServiceWebsocket import WebsocketService
# from .gpt_service import call_ollama
# # from src.utils.vector_store import store_document_chunks, store_extracted_rules
# from qdrant_client import QdrantClient
# from qdrant_client.models import Filter, FieldCondition, MatchValue


# from qdrant_client import QdrantClient
# from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
# from uuid import uuid4
# from services.websocket.ServiceWebsocket import WebsocketService
# from src.services.gpt_service import OllamaEmbedder
# from qdrant_client.http.exceptions import UnexpectedResponse
# from qdrant_client.models import VectorParams, Distance
# import os
# from ..utils.system_prompts import TF_sys_prompt, TF_user_prompt, rules_from_text_sys_prompt, rules_from_text_user_prompt, text_summmarization_system_prompt, text_summmarization_user_prompt
# qdrant = QdrantClient(host="localhost", port=6333)

# # Initialize collections
# qdrant_collection_chunks = "framework_chunks"
# qdrant_collection_rules = "framework_rules"

# embedder = OllamaEmbedder()

# # Base paths
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# class ExtractService:
#     def __init__(self, sessionID):
#         pass

 
#     def process_document(self, request):
#         self.model = request.form.get("model")
#         self.framework = request.form.get("framework")
#         self.file = request.files.get("file")

#         filename = f"{remove_special_chars(self.model)}_{secure_filename(self.file.filename)}"
#         filepath = os.path.join(self.upload_folder, filename)
#         doc_id = os.path.splitext(filename)[0]
#         json_path = os.path.join(self.output_folder, f"{doc_id}.json")

#         self.file.save(filepath)
#         print(f"📄 File saved at {filepath}")

#         self.ws.send_progress_update(
#             session=self.session,
#             message="📄 File saved at {filepath}"
#         )

#         print("🧾 Extracting full text from PDF...")

#         self.ws.send_progress_update(
#             session=self.session,
#             message="🧾 Extracting full text from PDF..."
#         )
#         full_text = self.extract_text_with_ocr(filepath)

#         print("🧠 Storing chunks to Qdrant...")
#         self.ws.send_progress_update(
#             session=self.session,
#             message="🧠 Storing chunks to Qdrant..."
#         )
#         self.store_document_chunks(full_text, doc_id)

#         from src.utils.vector_store import search_chunks_and_rules
#         rules = []
#         print("📑 Extracting rules from stored chunks...")
#         self.ws.send_progress_update(
#             session=self.session,
#             message="📑 Extracting rules from stored chunks..."
#         )
#         chunks_only = search_chunks_and_rules(
#             "Extract security and compliance rules", doc_id, top_k=30)

#         max_token_limit = 6000
#         combined = []
#         current_token_count = 0

#         for chunk in chunks_only:
#             chunk_text = chunk["content"]
#             token_estimate = int(len(chunk_text.split()) * 1.3)
#             if current_token_count + token_estimate <= max_token_limit:
#                 combined.append(chunk_text)
#                 current_token_count += token_estimate
#             else:
#                 break
#         combined_text = "\n".join(combined)

#         rules = self.extract_compliance_rules_from_text(
#             combined_text, framework=doc_id)

#         self.ws.send_progress_update(
#             session=self.session,
#             message=f"📊 Extracted {len(rules)} rules."
#         )

#         if rules:
#             print("🛡️ Storing rules to Qdrant...")
#             self.store_extracted_rules(rules, doc_id)
#             print(f"💾 Saving rules JSON to: {json_path}")
#             with open(json_path, "w", encoding="utf-8") as f:
#                 json.dump(rules, f, indent=2)
#             self.create_terraform_template(combined_text)
#         print("✅ Processing completed.")
#         self.ws.send_progress_update(
#             session=self.session,
#             message="✅ Processing completed, rules_saved."
#         )
#         return {"message": "✅ Uploaded and processed", "rules_saved": f"{doc_id}.json"}

#     def extract_compliance_rules_from_text(self, text, framework="Custom"):
#         try:
#             self.ws.send_progress_update(
#                 session=self.session,
#                 message=f"Extracting rules from text using model: {self.model}"
#             )

#             # Step 1: Summarize chunks
#             user_prompt = mergePrompts([text_summmarization_user_prompt, text])

#             summary = call_ollama(
#                 text_summmarization_system_prompt,
#                 text_summmarization_user_prompt,
#                 model=self.model)

#             with open(f"debug_summary_{framework}_{remove_special_chars(self.model)}.txt", "w", encoding="utf-8") as f:
#                 f.write(summary)

#             # Step 2: Extract rules from the summary
#             user_prompt = mergePrompts([rules_from_text_user_prompt, summary])

#             response = call_ollama(
#                 rules_from_text_sys_prompt,
#                 user_prompt,
#                 model=self.model)

#             with open(f"debug_ollama_output_{framework}.txt", "w", encoding="utf-8") as f:
#                 f.write(response)

#             print("📥 Ollama response preview:\n", response[:300])

#             match = re.search(r"(\{.*\}|\[.*\])", response, re.DOTALL)
#             if not match:
#                 raise ValueError("❌ No JSON found in Ollama response")

#             json_blob = match.group(0)
#             parsed = json.loads(json_blob)

#             if isinstance(parsed, list):
#                 return [
#                     dict(rule=rule.get("rule", ""), category=rule.get(
#                         "category", ""), framework=framework)
#                     for rule in parsed if "rule" in rule
#                 ]
#             elif isinstance(parsed, dict) and "rules" in parsed:
#                 return [
#                     dict(rule=rule.get("rule", ""), category=rule.get(
#                         "category", ""), framework=framework)
#                     for rule in parsed["rules"] if "rule" in rule
#                 ]
#             else:
#                 raise ValueError("❌ Unexpected JSON structure")

#         except Exception as e:
#             print("❌ Ollama rule extraction failed:", e)
#             return []
    
#     def store_extracted_rules(self, rules, doc_id):
#         points = []
#         for i, rule in enumerate(rules):

#             rule_text = rule.get("rule")
#             if rule_text:
#                 # Now returns single embedding
#                 embedding = embedder.embed(rule_text)
#                 if embedding:
#                     points.append(PointStruct(
#                         id=str(uuid4()),
#                         vector=embedding,
#                         payload={
#                             "doc_id": doc_id,
#                             "rule": rule_text,
#                             "category": rule.get("category", ""),
#                             "framework": rule.get("framework", ""),
#                             "rule_id": f"{doc_id}_rule_{i}",
#                             "model": self.model,
#                             "framework": self.framework,
#                         }
#                     ))
#         if points:
#             qdrant.upsert(collection_name="framework_rules", points=points)

#     def create_terraform_template(self, text, framework="Custom"):
#         self.ws.send_progress_update(
#             session=self.session,
#             message="Creating tf template"
#         )
#         try:
#             userprompt = mergePrompts([TF_user_prompt, text])
#             response = call_ollama(
#                 TF_sys_prompt, userprompt, model="codeup")

#             tf_filename = f"tf_template.txt"
#             tf_path = os.path.join(self.output_folder, tf_filename)

#             with open(tf_path, "w", encoding="utf-8") as f:
#                 f.write(response)

#             print(f"📥 Ollama tf response preview: {response}")
#             self.ws.send_progress_update(
#                 session=self.session,
#                 message=f"📥 Terraform template saved to: {tf_path}")

#         except Exception as e:
#             print("❌ Ollama rule extraction failed:", e)
#             return []

#     def query_similar_rules(self, query, doc_id, top_k=10):
#         embedding = embedder.embed(query)  # Now returns single embedding
#         if not embedding:
#             return []

#         results = qdrant.search(
#             collection_name=qdrant_collection_rules,
#             query_vector=embedding,
#             limit=top_k,
#             query_filter=Filter(
#                 must=[FieldCondition(
#                     key="doc_id", match=MatchValue(value=doc_id))]
#             )
#         )
#         return [{"score": r.score, "content": r.payload.get("rule")} for r in results]

#     def search_chunks_and_rules(self, query, doc_id, top_k=30):
#         embedding = embedder.embed(query)  # Now returns single embedding
#         if not embedding:
#             return []

#         chunk_results = qdrant.search(
#             collection_name=qdrant_collection_chunks,
#             query_vector=embedding,
#             limit=top_k,
#             query_filter=Filter(
#                 must=[FieldCondition(
#                     key="doc_id", match=MatchValue(value=doc_id))]
#             )
#         )

#         rule_results = qdrant.search(
#             collection_name=qdrant_collection_rules,
#             query_vector=embedding,
#             limit=top_k,
#             query_filter=Filter(
#                 must=[FieldCondition(
#                     key="doc_id", match=MatchValue(value=doc_id))]
#             )
#         )

#         combined = [
#             {"score": r.score, "content": r.payload.get(
#                 "chunk") or r.payload.get("rule")}
#             for r in (chunk_results + rule_results)
#         ]
#         return sorted(combined, key=lambda x: -x["score"])[:top_k]

#     def get_available_doc_ids():
#         # Qdrant has no built-in list for unique doc_ids, so simulate by scanning all payloads
#         hits = qdrant.scroll(
#             collection_name=qdrant_collection_chunks, limit=1000)[0]
#         return list(set([pt.payload.get("doc_id") for pt in hits if pt.payload.get("doc_id")]))

#     @staticmethod
#     def list_documents():
#         output_folder = os.getenv("OUTPUT_FOLDER", os.path.join(
#             os.path.dirname(__file__), "../cloud_outputs"))
#         if not os.path.exists(output_folder):
#             print("⚠️ cloud_outputs folder not found.")
#             return []
#         return [f.replace(".json", "") for f in os.listdir(output_folder) if f.endswith(".json")]
