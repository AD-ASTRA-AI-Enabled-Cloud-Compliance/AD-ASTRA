import os
import json
import re
import fitz  # PyMuPDF
import pytesseract

from flask import request

from ..services.DriverStorage import DriverStorage

from ..services import ServiceOCR
from ..utils.functions import remove_special_chars

# from pdf2image import convert_from_path
import tempfile
from werkzeug.utils import secure_filename


class DocumentController:
    def __init__(self, session, request):
        #Global variables
        self.session = session
        self.sessionID = session.sessionID
        self.companyID = session.companyID
        self.userID = session.userID
        
        self.mongo = session.mongo
        self.qdrant = session.qdrant
        self.ws = session.ws

        self.temperature = session.temperature
        self.chunk_size = session.chunk_size
        self.chunk_overlap = session.chunk_overlap
        self.top_k = session.top_k
        self.max_token_limit = session.max_token_limit
        
        # self.upload_folder = storage.upload_folder
        # self.output_folder = storage.output_folder
        # self.terraform_folder = storage.terraform_folder

        #Controller variables
        self.request = request
        # self.ocr = ServiceOCR()

    def store(self):
        self.model = request.form.get("model")
        self.framework = request.form.get("framework")
        self.file = request.files.get("file")
        
        self.filename = f"{remove_special_chars(self.model)}_{secure_filename(self.file.filename)}"
        directory_name = f"{remove_special_chars(self.model)}"
        self.storage = DriverStorage(folder_group=directory_name)
        self.filepath = f"{self.storage.upload_folder}/{self.filename}"
        

        # filepath = os.path.join(self.upload_folder, filename)
        # doc_id = os.path.splitext(filename)[0]
        # json_path = os.path.join(self.output_folder, f"{doc_id}.json")
        print(self.filename)
        # print(filepath)
        # print(doc_id)
        # print(json_path)
        self.file.save(self.filepath)
        # print(f"📄 File saved at {filepath}")

        self.ws.send_progress_update(
            session=self.session,
            message=f"📄 File saved at {self.filepath}"
        )

        # print("🧾 Extracting full text from PDF...")

        # self.ws.send_progress_update(
        #     session=self.sessionID,
        #     message="🧾 Extracting full text from PDF..."
        # )
        # full_text = self.ocr.extract_text_from_path(filepath)

        # print("🧠 Storing chunks to Qdrant...")
        # self.ws.send_progress_update(
        #     session=self.sessionID,
        #     message="🧠 Storing chunks to Qdrant..."
        # )
        # self.store_document_chunks(full_text, doc_id)

        # from src.utils.vector_store import search_chunks_and_rules
        # rules = []
        # print("📑 Extracting rules from stored chunks...")
        # self.ws.send_progress_update(
        #     session=self.sessionID,
        #     message="📑 Extracting rules from stored chunks..."
        # )
        # chunks_only = search_chunks_and_rules(
        #     "Extract security and compliance rules", doc_id, self.top_k)

        # combined = []
        # current_token_count = 0

        # for chunk in chunks_only:
        #     chunk_text = chunk["content"]
        #     token_estimate = int(len(chunk_text.split()) * 1.3)
        #     if current_token_count + token_estimate <= self.max_token_limit:
        #         combined.append(chunk_text)
        #         current_token_count += token_estimate
        #     else:
        #         break
        # combined_text = "\n".join(combined)

        # rules = self.extract_compliance_rules_from_text(
        #     combined_text, framework=doc_id)

        # self.ws.send_progress_update(
        #     session=self.session,
        #     message=f"📊 Extracted {len(rules)} rules."
        # )

        # if rules:
        #     print("🛡️ Storing rules to Qdrant...")
        #     self.store_extracted_rules(rules, doc_id)
        #     print(f"💾 Saving rules JSON to: {json_path}")
        #     with open(json_path, "w", encoding="utf-8") as f:
        #         json.dump(rules, f, indent=2)
        #     self.create_terraform_template(combined_text)
        # print("✅ Processing completed.")
        # self.ws.send_progress_update(
        #     session=self.session,
        #     message="✅ Processing completed, rules_saved."
        # )
        return self.filename

    def update(self):
        pass

    def delete(self):
        pass
