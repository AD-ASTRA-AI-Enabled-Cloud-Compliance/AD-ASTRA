from flask import Blueprint, request, jsonify
from ..services.user_service import UserService
from ..utils.jwt_utils import JWTUtils

auth_routes = Blueprint("auth_routes", __name__)
user_service = UserService()
jwt_util = JWTUtils()

class AuthController:

    @staticmethod
    @auth_routes.route("/login", methods=["POST"])
    def login():
        try:
            data = request.get_json()
            if not data:
                return jsonify({"message": "Missing request body"}), 400

            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return jsonify({"message": "Email and password are required"}), 400

            user = user_service.authenticate_user(email, password)
            if not user:
                return jsonify({"message": "Invalid credentials"}), 401

            token = jwt_util.generate_token(user)

            return jsonify({
                "token": token,
                "user": {
                    "_id": str(user["_id"]),
                    "email": user["email"],
                    "name": user.get("name", ""),
                    "role": user.get("role", "user")
                }
            }), 200

        except Exception as e:
            print(f"Login error: {str(e)}")
            return jsonify({"message": f"Server error: {str(e)}"}), 500

    @staticmethod
    @auth_routes.route("/signup", methods=["POST"])
    def signup():
        try:
            data = request.get_json()
            email = data.get("email")
            password = data.get("password")
            name = data.get("name", "")  # <-- get name from request

            if not email or not password or not name:
                return jsonify({"message": "Email, name, and password are required"}), 400

            try:
                user = user_service.create_user(email, password, name=name)
                return jsonify({"message": "User created", "email": user["email"]}), 201
            except Exception as e:
                return jsonify({"message": str(e)}), 400

        except Exception as e:
            print(f"Signup error: {str(e)}")
            return jsonify({"message": f"Server error: {str(e)}"}), 500

    @staticmethod
    @auth_routes.route("/forgot-password", methods=["POST"])
    def forgot_password():
        try:
            data = request.get_json()
            email = data.get("email")
            if not email:
                return jsonify({"message": "Email is required"}), 400

            user = user_service.find_by_email(email)
            if not user or user.get("role") != "user":
                return jsonify({"message": "If your email exists, you will receive a reset link."}), 200

            # TODO: Generate a reset token, send email, etc.
            # For now, just return a generic message
            return jsonify({"message": "If your email exists, you will receive a reset link."}), 200
        except Exception as e:
            print(f"Forgot password error: {str(e)}")
            return jsonify({"message": f"Server error: {str(e)}"}), 500

    @staticmethod
    @auth_routes.route("/reset-password", methods=["POST"])
    def reset_password():
        try:
            data = request.get_json()
            email = data.get("email")
            new_password = data.get("new_password")
            if not email or not new_password:
                return jsonify({"message": "Email and new password are required"}), 400

            user = user_service.find_by_email(email)
            if not user or user.get("role") not in ["user", "management"]:
                return jsonify({"message": "User not found"}), 404

            user_service.update_password(email, new_password)
            return jsonify({"message": "Password updated"}), 200
        except Exception as e:
            print(f"Reset password error: {str(e)}")
            return jsonify({"message": f"Server error: {str(e)}"}), 500