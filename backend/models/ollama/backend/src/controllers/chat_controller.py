from flask import Blueprint, request, jsonify
from src.services.chat_service import handle_chat_query

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/react_chat", methods=["POST"])
def react_chat():
    data = request.get_json()
    query = data.get("query", "")
    
    if not query:
        return jsonify({"error": "No query provided"}), 400

    result = handle_chat_query(query)
    return jsonify(result)
