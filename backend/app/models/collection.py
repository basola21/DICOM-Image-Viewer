from app.database import db
from .image import Image


class Collection(db.Model):
    __tablename__ = "collections"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", back_populates="collections")
    images = db.relationship(
        "Image",
        backref="collection",
        lazy="joined",
        cascade="all, delete, delete-orphan",
    )

    def __init__(self, name, description=None, user_id=None):
        self.name = name
        self.description = description
        self.user_id = user_id
