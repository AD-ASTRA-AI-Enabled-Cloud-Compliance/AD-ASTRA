import os
import numpy as np
from pdf2image import convert_from_path
import easyocr
from werkzeug.datastructures import FileStorage

reader = easyocr.Reader(['en'])

def extract_text_from_file(file: FileStorage) -> str:
    """
    Save and extract text from a PDF or image using EasyOCR.

    Args:
        file (FileStorage): Uploaded file object

    Returns:
        str: Extracted text
    """
    filename = file.filename
    upload_path = os.path.join("uploads", filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(upload_path)

    ext = os.path.splitext(upload_path)[-1].lower()
    extracted_text = ""

    if ext == '.pdf':
        try:
            images = convert_from_path(upload_path)
            for img in images:
                result = reader.readtext(np.array(img), detail=0)
                extracted_text += "\n".join(result) + "\n"
        except Exception as e:
            return f"Error reading PDF: {str(e)}"
    else:
        result = reader.readtext(upload_path, detail=0)
        extracted_text = "\n".join(result)

    return extracted_text
