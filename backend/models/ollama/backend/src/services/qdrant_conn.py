# from qdrant_client import QdrantClient
# from qdrant_client.http import models
# from typing import Optional

# class QdrantConnection:
#     def __init__(self, url: Optional[str] = None, api_key: Optional[str] = None):
#         """Initialize Qdrant connection.
        
#         Args:
#             url: Qdrant server URL. If None, connects to local instance
#             api_key: API key for authentication. Required for cloud deployments
#         """
#         if url:
#             self.client = QdrantClient(url=url, api_key=api_key)
#         else:
#             # Connect to local instance
#             self.client = QdrantClient(":6333")
            
#     def check_connection(self) -> bool:
#         """Test if connection is alive.
        
#         Returns:
#             bool: True if connection successful, False otherwise
#         """
#         try:
#             self.client.get_collections()
#             return True
#         except Exception:
#             return False

#     def create_collection(self, collection_name: str, vector_size: int):
#         """Create a new collection.
        
#         Args:
#             collection_name: Name of the collection
#             vector_size: Dimension of vectors to be stored
#         """
#         self.client.create_collection(
#             collection_name=collection_name,
#             vectors_config=models.VectorParams(
#                 size=vector_size,
#                 distance=models.Distance.COSINE
#             )
#         )

#     def insert_data(self, collection_name: str, vectors: list, payloads: list = None, ids: list = None):
#         """Insert data into a collection.
        
#         Args:
#             collection_name: Name of the collection to insert into
#             vectors: List of vectors to insert
#             payloads: Optional list of payload dictionaries for each vector
#             ids: Optional list of IDs for each vector. If not provided, Qdrant will generate them
        
#         Returns:
#             Operation result from Qdrant
#         """
#         try:
#             return self.client.upsert(
#                 collection_name=collection_name,
#                 points=models.Batch(
#                     ids=ids if ids else list(range(len(vectors))),
#                     vectors=vectors,
#                     payloads=payloads if payloads else [{}] * len(vectors)
#                 )
#             )
#         except Exception as e:
#             raise Exception(f"Failed to insert data: {str(e)}")