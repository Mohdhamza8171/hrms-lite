from mongoengine import Document, StringField, EmailField, DateTimeField
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime, timedelta


class User(Document):
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password_hash = StringField(required=True)
    role = StringField(
        required=True, choices=["admin", "employee", "hr"], default="employee"
    )
    reset_token = StringField()
    reset_token_expiry = DateTimeField()

    def set_password(self, password):
        """Hash and set the user's password."""
        self.password_hash = make_password(password)

    def check_password(self, password):
        """Verify the user's password."""
        return check_password(password, self.password_hash)
