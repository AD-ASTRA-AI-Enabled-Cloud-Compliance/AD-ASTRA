# db_connection.py

# Client instance is created and terminated in each method (call) to reduce connection TTL

from qdrant_client import QdrantClient
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue, CollectionStatus


class MongoDB():
    def __init__(self):
        host = "localhost"
        port = 27017
        username = "admin"
        password = "admin"
        self.uri = f"mongodb://{username}:{password}@{host}:{port}"
        self.client = MongoClient(self.uri, serverSelectionTimeoutMS=3000)

    def healthCheck(self):
        try:
            client = MongoClient(self.uri, serverSelectionTimeoutMS=3000)
            client.admin.command('ping')
            print("✅ MongoDB connected successfully!")
            return {"status": "healthy", "uri": self.uri}
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            print("❌MongoDB ERROR connected")
            return {"status": "unhealthy", "error": str(e)}

    def insert(self, database: str, collection: str, document: object):
        client = MongoClient(
            self.uri, serverSelectionTimeoutMS=3000)  # 3s timeout
        db = client[database]
        collection = db[collection]
        collection.insert_one(document)

    # def connect_to_mongo(
    #     host="localhost", port=27017, username="admin", password="secret"
    # ):
    #     uri = f"mongodb://{username}:{password}@{host}:{port}/"
    #     client = MongoClient(uri)
    #     try:
    #         # The ismaster command is cheap and does not require auth
    #         client.admin.command('ismaster')

    #         db = client["mydatabase"]         # No need to pre-create "mydatabase"
    #         collection = db["users"]
    #         collection.insert_one({"name": "Alice"})
    #         collection = db["usersS"]
    #         collection.insert_one({"name": "Alice"})

    #         print("✅ MongoDB connected successfully!")
    #         return client
    #     except Exception as e:
    #         print("❌ Connection failed:", e)
    #         return None


class QdrantDB():
    def __init__(self):
        self.client = QdrantClient(host="localhost", port=6333)

        pass

    from qdrant_client.models import Distance, VectorParams, CollectionStatus

    def healthCheck(self):
        try:
            # Get existing collections
            collections = self.client.get_collections().collections
            col_names = [col.name for col in collections]

            # Required collections
            required_collections = {
                "framework_chunks_5120": 5120,
                "framework_rules_5120": 5120,
                "framework_chunks_2048": 2048,
                "framework_rules_2048": 2048,
                "framework_chunks_308": 308,  # ← example dimension
                "framework_rules_308": 308,
                "framework_chunks_4544": 4544,  # ← example dimension
                "framework_rules_4544": 4544
                
                
                
            }

            counts = {}

            for collection, vector_dim in required_collections.items():
                if collection not in col_names:
                    print(
                        f"⚠️ Collection '{collection}' does not exist. Creating...")
                    self.client.create_collection(
                        collection_name=collection,
                        vectors_config=VectorParams(
                            size=vector_dim,
                            distance=Distance.COSINE
                            # distance=Distance.DOT,  # Use DOT for better performance with embeddings
                            # distance=Distance.EUCLID,  # Uncomment if you prefer Euclidean distance
                        )
                    )
                    print(f"✅ Created collection '{collection}'")

                # Wait for collection to become ready (optional)
                status = self.client.get_collection(collection).status
                if status != CollectionStatus.GREEN:
                    print(
                        f"⏳ Waiting for collection '{collection}' to become ready...")

                # Count documents
                counts[collection] = self.client.count(
                    collection_name=collection, exact=True).count

            print(
                f"✅ Qdrant connected: {counts['framework_chunks']} chunks, {counts['framework_rules']} rules")

        except Exception as e:
            print(f"❌ Qdrant connection failed: {e}")
    def upsert(self, collection_name, points):
        """ Upsert points to a Qdrant collection. """
        
        try:
            self.client.upsert(
                collection_name=collection_name,
                points=points
            )
            print(f"✅ Upserted {len(points)} points to '{collection_name}'")
        except Exception as e:
            print(f"❌ Upsert failed: {e}")
            

    # def log_mongo_status():  # Keeping function name for compatibility
    #     try:
    #         client = QdrantClient(
    #             host="localhost",
    #             port=6333
    #         )
    #         collections = client.get_collections().collections
    #         col_names = [col.name for col in collections]

    #         if "framework_chunks" in col_names:
    #             chunks_count = client.count(
    #                 collection_name="framework_chunks", exact=True).count
    #         else:
    #             chunks_count = 0

    #         if "framework_rules" in col_names:
    #             rules_count = client.count(
    #                 collection_name="framework_rules", exact=True).count
    #         else:
    #             rules_count = 0

    #         print(
    #             f"✅ Qdrant connected: {chunks_count} chunks, {rules_count} rules")
    #     except Exception as e:
    #         print(f"❌ Qdrant connection failed: {e}")
