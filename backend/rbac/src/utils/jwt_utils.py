import jwt
import os
import datetime

class JWTUtils:
    def __init__(self):
        self.secret = os.getenv("JWT_SECRET", "supersecret")

    def generate_token(self, user):
        payload = {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "role": user.get("role", "user"),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }
        return jwt.encode(payload, self.secret, algorithm="HS256")

    def decode_token(self, token):
        try:
            return jwt.decode(token, self.secret, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
