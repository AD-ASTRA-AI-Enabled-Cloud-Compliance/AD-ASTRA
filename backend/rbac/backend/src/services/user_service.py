import os
from datetime import datetime
from pymongo import MongoClient
from passlib.hash import bcrypt
from dotenv import load_dotenv

# ✅ Load .env once
load_dotenv()

class UserService:
    def __init__(self):
        mongo_uri = os.getenv("MONGO_URI")
        if not mongo_uri:
            raise ValueError("MONGO_URI is not set in .env")

        self.client = MongoClient(mongo_uri)
        self.db = self.client["Skylock_Users"]
        self.users = self.db["Application_Users"]

    def create_user(self, email, password, name="", role="user"):
        """
        Create a new user in the Application_Users collection

        Args:
            email: User's email address
            password: User's plain text password (will be hashed using bcrypt)
            name: User's full name (optional)
            role: User's role (default: "user")

        Returns:
            The created user object (without password)
        """
        if self.users.find_one({"email": email}):
            raise Exception("User already exists")

        hashed_password = bcrypt.hash(password)
        user = {
            "email": email,
            "password": hashed_password,
            "name": name,
            "role": role,
            "is_active": True,
            "created_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        }
        self.users.insert_one(user)

        user_without_password = user.copy()
        user_without_password.pop("password", None)
        return user_without_password

    def find_by_email(self, email):
        """Find a user by email in the Application_Users collection"""
        return self.users.find_one({"email": email})

    def verify_password(self, plain_password, hashed_password):
        """Verify if the provided password matches the stored bcrypt hash"""
        return bcrypt.verify(plain_password, hashed_password)

    def authenticate_user(self, email, password):
        """
        Authenticate a user by email and password

        Returns:
            User object without password if authentication succeeds,
            None otherwise
        """
        user = self.find_by_email(email)

        if not user:
            return None

        if not user.get("is_active", True):
            return None

        if not self.verify_password(password, user["password"]):
            return None

        user_without_password = user.copy()
        user_without_password.pop("password", None)
        return user_without_password
