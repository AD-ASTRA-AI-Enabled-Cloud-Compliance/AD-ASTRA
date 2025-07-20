# db_connection.py

# Client instance is created and terminated in each method (call) to reduce connection TTL

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
load_dotenv()

class MongoDB():
    def __init__(self):
        self.MONGO_HOST = os.getenv("MONGO_HOST", "localhost")        
        self.MONGO_PORT= os.getenv("MONGO_PORT")
        self.MONGO_USERNAME= os.getenv("MONGO_USERNAME")
        self.MONGO_PASSWORD= os.getenv("MONGO_PASSWORD")
        self.MONGO_DB= os.getenv("MONGO_DB")
        self.MONGO_COLLECTION= os.getenv("MONGO_COLLECTION")
        self.uri = f"mongodb://{self.MONGO_USERNAME}:{self.MONGO_PASSWORD}@{self.MONGO_HOST}:{self.MONGO_PORT}"
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

