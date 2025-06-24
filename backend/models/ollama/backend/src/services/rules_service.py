
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


from qdrant_client import QdrantClient
from uuid import uuid4
from src.services.websocket.ws import WebsocketService
from src.services.gpt_service import OllamaEmbedder
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


class RulesService:
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

    def list_rules(self):
        """List all rules in the collection."""
        try:

            # Connect to your Qdrant instance

            # Collection name

            # Fetch all points with payloads
            scroll_result = qdrant.scroll(
                collection_name=qdrant_collection_rules,
                with_vectors=False,
                limit= 2000
            )
            # return json.dumps(scroll_result.result.points)
            
            records, next_offset = scroll_result

            # Convert each Record to a dict
            data = {
                "points": [record.dict() for record in records],
                "next_offset": next_offset
            }

            # Serialize to JSON
            json_output = json.dumps(data, indent=2)
            print(json_output)
            return json_output
        except Exception as e:
            print(f"Error listing rules: {str(e)}")
            return []
