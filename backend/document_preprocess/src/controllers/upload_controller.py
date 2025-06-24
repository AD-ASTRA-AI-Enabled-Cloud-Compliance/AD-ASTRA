import os
from flask import Blueprint
from werkzeug.datastructures import FileStorage
from src.services.ocr_service import extract_text_from_file
from src.processors.chunk_processor import split_text_into_chunks

upload_controller = Blueprint('upload_controller', __name__)


def process_upload(file: FileStorage):
    """
    Extract text from file and split into overlapping chunks.
    """
    file_name = file.filename
    extracted_text = extract_text_from_file(file)
    chunks = split_text_into_chunks(extracted_text)

    return {
        "data": {
            "file_name": file_name,
            "extracted_text": extracted_text,
            "chunks": chunks
        },
    }
