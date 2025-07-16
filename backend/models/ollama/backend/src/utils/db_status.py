# db_status.py

# 🔒 OLD MongoDB version (commented)
# import os
# from pymongo import MongoClient
# from dotenv import load_dotenv
#
# load_dotenv()
#
# def log_mongo_status():
#     try:
#         client = MongoClient(os.getenv("MONGODB_URI"))
#         db = client[os.getenv("MONGODB_DB", "compliance")]
#         chunks_col = db[os.getenv("MONGODB_CHUNK_COLLECTION", "framework_chunks")]
#         rules_col = db[os.getenv("MONGODB_RULE_COLLECTION", "framework_rules")]
#
#         chunk_count = chunks_col.count_documents({})
#         rule_count = rules_col.count_documents({})
#
#         print(f"✅ MongoDB connected: {chunk_count} chunks, {rule_count} rules")
#     except Exception as e:
#         print(f"❌ MongoDB connection failed: {e}")

# ✅ Qdrant version
import os
from qdrant_client import QdrantClient


def log_mongo_status():  # Keeping function name for compatibility
#def log_qdrant_status():
    try:
        client = QdrantClient(
            host="localhost",
            port=6333
        )
        collections = client.get_collections().collections
        col_names = [col.name for col in collections]

        if "framework_chunks" in col_names:
            chunks_count = client.count(
                collection_name="framework_chunks", exact=True).count
        else:
            chunks_count = 0

        if "framework_rules" in col_names:
            rules_count = client.count(
                collection_name="framework_rules", exact=True).count
        else:
            rules_count = 0

        print(
            f"✅ Qdrant connected: {chunks_count} chunks, {rules_count} rules")
    except Exception as e:
        print(f"❌ Qdrant connection failed: {e}")
