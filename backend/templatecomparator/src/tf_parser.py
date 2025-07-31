
from pymongo import MongoClient
from src.utils.db_connection import MongoDB
import hcl2
import io


def load_terraform_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return hcl2.load(f)


def parse_terraform_from_string(tf_string):
    
    MBDB = MongoDB()
    client =  MBDB.client
    db = client["Skylock"]
    collection = db["Terraform_Files"]

    
    doc = collection.find_one({"terraform_filename": "terraform_hipaa_azure_20250710_204619.tf"})
    doc = doc.get("terraform_content")
    

    if doc:
        return hcl2.load(io.StringIO(doc))
        # tf_data = parse_terraform_from_string(doc)
        # print("✅ Parsed Terraform data:")
        # print(tf_data)
    else:
        return("❌ No content found in MongoDB")

# # Connect to MongoDB and get the document
# MBDB = MongoDB()
# client =  MBDB.client
# db = client["Skylock"]
# collection = db["Terraform_Files"]


# doc = collection.find_one({"terraform_filename": "terraform_hipaa_azure_20250710_204619.tf"})

# if doc and "content" in doc:
#     tf_data = parse_terraform_from_string(doc["content"])
#     print("✅ Parsed Terraform data:")
#     print(tf_data)
# else:
#     print("❌ No content found in MongoDB")
