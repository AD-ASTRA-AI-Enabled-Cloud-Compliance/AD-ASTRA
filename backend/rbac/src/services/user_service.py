import os
from datetime import datetime
from pymongo import MongoClient
from passlib.hash import bcrypt
from dotenv import load_dotenv
from collections import OrderedDict

from src.services.db_connection import MongoDB

# ✅ Load .env once
load_dotenv()


class UserService:
    def __init__(self):
        self.mongo = MongoDB()
        self.db = self.mongo.client["Skylock_Users"]
        self.users = self.db["Application_Users"]

        # Ensure the Application_Users collection exists
        if "Application_Users" not in self.db.list_collection_names():
            self.db.create_collection("Application_Users")

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
        email = email.lower().strip()  # Normalize email
        if self.users.find_one({"email": email}):
            raise Exception("User already exists")

        hashed_password = bcrypt.hash(password)
        user = OrderedDict([
            ("email", email),
            ("password", hashed_password),
            ("name", name),
            ("role", role),
            ("created_at", datetime.utcnow().isoformat() + "Z"),
            ("is_active", True)
        ])
        self.users.insert_one(user)
        user.pop("password")
        return user

    def find_by_email(self, email):
        """Find a user by email (case-insensitive)"""
        return self.users.find_one({
            "email": {"$regex": f"^{email.strip()}$", "$options": "i"}
        })

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

    def update_password(self, email, new_password):
        """Update the password for a user"""
        hashed_password = bcrypt.hash(new_password)
        self.users.update_one({"email": email.lower().strip()}, {
                              "$set": {"password": hashed_password}})
