def split_text_into_chunks(text, chunk_size=500, overlap=50):
    """
    Splits text into overlapping chunks for better context in embeddings.
    
    Args:
        text (str): Full extracted text
        chunk_size (int): Size of each chunk
        overlap (int): Number of overlapping characters
    
    Returns:
        List[str]: List of text chunks
    """
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end].strip())
        start = end - overlap  # move back by overlap
    return chunks
