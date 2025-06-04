# import os
# from flask import Blueprint, jsonify, request
# import requests

# from .services.qdrant_conn import QdrantConnection

# # Create a Blueprint for routes
# main_routes = Blueprint('main_routes', __name__)


# @main_routes.route("/", methods=["GET"])
# def health_check():
#     ollama = os.getenv("OLLAMA_ENDPOINT")
#     print(ollama)
#     return 'healthy'


# @main_routes.route("/qd", methods=["GET"])
# def test_qdrat():


#     qdrant = QdrantConnection('http://localhost')

#     # Or for cloud instance:
#     # qdrant = QdrantConnection(url="https://your-qdrant.cloud", api_key="your-api-key")

#     qdrant.create_collection('llllll',1)
#     return 'sd'


# @main_routes.route("/ollama", methods=["POST"])
# def ollama():
#     try:
#         # Get the Ollama endpoint from environment variables
#         ollama_endpoint = os.getenv("OLLAMA_ENDPOINT")
#         # if not ollama_endpoint:
#         #     return jsonify({"error": "Ollama endpoint not configured"}), 500

#         # # Get the request data
#         # data = request.get_json()

#         # Make request to Ollama
#         response = requests.post(
#             "http://localhost:11434/api/generate",
#             # Explicitly set Content-Type
#             headers={"Content-Type": "application/json"},
#             json={
#                 "model": "gemma:2b",
#                 "prompt": "hello",
#                 "stream": False 
#             }
#         )

#         # Check if request was successful
#         response.raise_for_status()

#         # Return the JSON response from Ollama as a Flask response
#         return jsonify(response.json())

#     except requests.RequestException as e:
#         return jsonify({"error": str(e)}), 500
