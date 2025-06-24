import os
import numpy as np
import fitz
import easyocr
import requests
from PIL import Image
from io import BytesIO
from werkzeug.datastructures import FileStorage
import os

from src.services.websocket.ws import send_progress_update


reader = easyocr.Reader(['en'])


def extract_text_from_file(file: FileStorage) -> str:
    """
    Save and extract text from a PDF or image using EasyOCR with PyMuPDF.

    Args:
        file (FileStorage): Uploaded file object

    Returns:
        str: Extracted text
    """
    filename = file.filename
    upload_path = os.path.join("uploads", filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(upload_path)

    send_progress_update(f"Processing file: {filename}")
    print(f"Processing file: {filename}")

    ext = os.path.splitext(upload_path)[-1].lower()
    extracted_text = ""

    if ext == '.pdf':
        try:
            doc = fitz.open(upload_path)
            total_pages = len(doc)
            for page_num, page in enumerate(doc, 1):
                progress = round(((page_num / total_pages) * 100), 1)
                msg = f"PDF: {filename} page {page_num}/{total_pages}"
                print(msg, progress)
                send_progress_update(
                    msg,
                    progress,
                    page_num,
                    total_pages
                )

                print(f"Processing PDF page {page_num}/{total_pages}")

                pix = page.get_pixmap(dpi=300)  # High-res rendering
                img = Image.open(BytesIO(pix.tobytes("png"))
                                 )  # Convert to PIL Image
                result = reader.readtext(np.array(img), detail=0)
                extracted_text += "\n".join(result) + "\n"
        except Exception as e:
            send_progress_update(f"Error reading PDF: {str(e)}")
            return f"Error reading PDF: {str(e)}"
    else:
        send_progress_update("Processing image file", 50)
        result = reader.readtext(upload_path, detail=0)
        extracted_text = "\n".join(result)

    send_progress_update("Text extraction completed", 100)
    return extracted_text