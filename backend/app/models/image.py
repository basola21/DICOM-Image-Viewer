from app.database import db


class Image(db.Model):
    __tablename__ = "images"

    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String(120), nullable=False)
    collection_id = db.Column(
        db.Integer,
        db.ForeignKey("collections.id", ondelete="CASCADE"),
        nullable=False,
    )

    def __init__(self, file_path, collection_id):
        self.file_path = file_path
        self.collection_id = collection_id
