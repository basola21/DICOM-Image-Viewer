from werkzeug.security import generate_password_hash, check_password_hash
from app.database import db
from .collection import (
    Collection,
)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    collections = db.relationship(
        "Collection", order_by=Collection.id, back_populates="user"
    )

    def __init__(self, email):
        self.email = email

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
