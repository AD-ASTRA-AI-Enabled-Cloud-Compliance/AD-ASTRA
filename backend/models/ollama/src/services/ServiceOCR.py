

from typing import List
from uuid import uuid4
import fitz

from ..utils.db_connection import MongoDB


class ServiceOCR():
    def __init__(self, session):

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

        pass

    def extract_text_from_path(self, filepath):
        doc = fitz.open(filepath)
        extracted_text = []
        print(str(doc.page_count))

        for i, page in enumerate(doc):
            text = page.get_text().strip()
            extracted_text.append(text)
            # if len(text) > 20:
            # else:
            #     print(f"📸 OCR fallback for page {i+1}")
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

        mdb = MongoDB()
        mdb.insert(
            "adastra",
            "full_text",
            {
                "framework": "",
                "full_text": final_text,
            }
        )
        return final_text

    def extract_text_from_file(self, file):
        file.stream.seek(0)
        doc = fitz.open(stream=file.stream, filetype="pdf")
        extracted_text = []

        for i, page in enumerate(doc):
            text = page.get_text().stbrrip()
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

        mdb = MongoDB()
        mdb.insert(
            "adastra",
            "full_text",
            {
                "framework": "",
                "full_text": final_text,
            }
        )
        return final_text

    def chunk_text(self, text: str, OLLAMA, framework, model) -> List[str]:
        """Split long text into overlapping chunks"""
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
        from more_itertools import chunked

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap)
        chunks = splitter.split_text(text)
        # print(f"📄 Splitting into {len(chunks)} chunks")

        self.ws.send_progress_update(
            message=f"📄 Splitting into {len(chunks)} chunks"
        )

        points = []
        totalChunks = len(chunks)
        MAX_FAILURES = 3
        failure_count = 0

        for i, chunk in enumerate(chunks, start=1):
            embedding = OLLAMA.embed(chunk)
            
            

            msg = f"Chunk: {i} of {totalChunks}"
            self.ws.send_progress_update(
                # message="THIS IS AN EMPTY MESSAGE",
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
                        "doc_id": 'doc_id',
                        "chunk": chunk,
                        "chunk_id": i,
                        "framework": framework,
                        "chunk_size": self.chunk_size,
                        "chunk_overlap": self.chunk_overlap,
                        "model": model,
                    }
                ))
                try:
                        
                    self.qdrant.upsert(
                        collection_name=f"framework_chunks_{OLLAMA.embedding_length}",
                        points=[
                            PointStruct(
                                id=str(uuid4()),
                                vector=embedding,
                                payload={
                                    "doc_id": 'doc_id',
                                    "chunk": chunk,
                                    "chunk_id": i,
                                    "framework": framework,
                                    "chunk_size": self.chunk_size,
                                    "chunk_overlap": self.chunk_overlap,
                                    "model": model,
                                }
                            )
                        ]
                    )
                except Exception as e:
                    failure_count += 1
                    print(f"❌ Error during upsert (#{failure_count}): {e}")
                    self.ws.send_progress_update(
                        session=self.session,
                        message=f"⚠️ Upsert error ({failure_count}/{MAX_FAILURES}): {e}"
                    )

                    if failure_count >= MAX_FAILURES:
                        self.ws.send_progress_update(
                            session=self.session,
                            message=f"🛑 Session {self.sessionID} aborted due to repeated upsert failures."
                        )
                        break  # ⛔ stop processing further chunks

        if points:
            # qdrant.upsert(
            #     collection_name=qdrant_collection_chunks, points=points)

            BATCH_SIZE = 200  # Adjust depending on size of each point
            for batch in chunked(points, BATCH_SIZE):
                self.qdrant.upsert(
                    collection_name=f"framework_chunks_{OLLAMA.embedding_length}",
                    points=batch
                )

        words = text.split()
        chunks = []
        for i in range(0, len(words), self.chunk_size - self.chunk_overlap):
            chunk = words[i:i + self.chunk_size]
            chunks.append(" ".join(chunk))
        print(f"📄 Splitting into {len(chunks)} chunks")
        print(f"📄 Splitting chunk_size {self.chunk_size }")
        print(f"📄 Splitting chunk_overlap {self.chunk_overlap }")

        mdb = MongoDB()
        mdb.insert(
            "adastra",
            "chunks",
            {
                "framework": "",
                "chunks": chunks,
            }
        )
        return chunks

    # def store_document_chunks(self, text, doc_id):
    #     from langchain_text_splitters import RecursiveCharacterTextSplitter
    #     self.chunk_size = 1200
    #     self.chunk_overlap = 200
    #     splitter = RecursiveCharacterTextSplitter(
    #         chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap)
    #     chunks = splitter.split_text(text)
    #     # print(f"📄 Splitting into {len(chunks)} chunks")

    #     self.ws.send_progress_update(
    #         session=self.session,
    #         message=f"📄 Splitting into {len(chunks)} chunks"
    #     )

    #     points = []
    #     totalChunks = len(chunks)

    #     for i, chunk in enumerate(chunks, start=1):
    #         embedding = embedder.embed(chunk)

    #         msg = f"Chunk: {i} of {totalChunks}"
    #         self.ws.send_progress_update(
    #             session=self.session,
    #             message=msg,
    #             current_page=i,
    #             total_pages=len(chunks),
    #         )

    #         if embedding:
    #             # ws.send_progress_update(
    #             #     message=f"Generating embedding for chunk {i + 1}/{len(chunks)}...",
    #             #     progress=(i + 1) / len(chunks)
    #             # )
    #             points.append(PointStruct(
    #                 id=str(uuid4()),
    #                 vector=embedding,
    #                 payload={
    #                     "doc_id": doc_id,
    #                     "chunk": chunk,
    #                     "chunk_id": i,
    #                     "framework": self.framework,
    #                     "chunk_size": self.chunk_size,
    #                     "chunk_overlap": self.chunk_overlap,
    #                 }
    #             ))

    #             # qdrant.upsert(
    #             #     collection_name=qdrant_collection_chunks, points=points)
    #     if points:
    #         # qdrant.upsert(
    #         #     collection_name=qdrant_collection_chunks, points=points)

    #         BATCH_SIZE = 200  # Adjust depending on size of each point
    #         for batch in chunked(points, BATCH_SIZE):
    #             qdrant.upsert(
    #                 collection_name=qdrant_collection_chunks,
    #                 points=batch
    #             )
