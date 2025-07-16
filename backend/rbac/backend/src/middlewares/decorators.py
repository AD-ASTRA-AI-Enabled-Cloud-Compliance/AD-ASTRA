from functools import wraps
from flask import request, jsonify
from ..utils.jwt_utils import JWTUtils

class AuthMiddleware:
    jwt_util = JWTUtils()

    @classmethod
    def require_auth(cls, f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return jsonify({"message": "Missing or invalid token"}), 401

            token = auth_header.split(" ")[1]
            user_data = cls.jwt_util.decode_token(token)
            if not user_data:
                return jsonify({"message": "Token expired or invalid"}), 403

            request.user = user_data
            return f(*args, **kwargs)
        return wrapper

    @classmethod
    def require_role(cls, *roles):
        def decorator(f):
            @wraps(f)
            def wrapper(*args, **kwargs):
                if not hasattr(request, "user"):
                    return jsonify({"message": "Unauthorized"}), 403
                role = request.user.get("role")
                if role not in roles:
                    return jsonify({"message": "Forbidden: Insufficient role"}), 403
                return f(*args, **kwargs)
            return wrapper
        return decorator
