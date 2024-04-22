from flask import jsonify
from flask_smorest import Blueprint, abort
from app.models.collection import Collection
from app.models.image import Image
from app.schemas.collection import BaseCollectionSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import db

collections_bp = Blueprint("collections", __name__, url_prefix="/collections")


@collections_bp.route("/", methods=["POST"])
@jwt_required()
@collections_bp.arguments(BaseCollectionSchema)
def create_collection(collection_data):
    user_id = get_jwt_identity()
    collection = Collection(
        name=collection_data["name"],
        user_id=user_id,
    )
    db.session.add(collection)
    db.session.flush()

    image_data = collection_data.get("images", [])
    image_filenames = [img["file_path"] for img in image_data if "file_path" in img]
    for filename in image_filenames:
        if filename:
            new_image = Image(file_path=filename, collection_id=collection.id)
            db.session.add(new_image)

    db.session.commit()

    return (
        jsonify(
            {
                "id": collection.id,
                "name": collection.name,
                "images": [
                    {"id": img.id, "file_path": img.file_path}
                    for img in collection.images
                ],
            }
        ),
        201,
    )


@collections_bp.route("/", methods=["GET"])
@jwt_required()
def get_collections():
    user_id = get_jwt_identity()
    collections = Collection.query.filter_by(user_id=user_id).all()
    response = jsonify(
        [
            {
                "id": col.id,
                "name": col.name,
                "images": [{"filename": img.file_path} for img in col.images],
            }
            for col in collections
        ]
    )
    return response, 200


@collections_bp.route("/<int:collection_id>", methods=["DELETE"])
@jwt_required()
def delete_collection(collection_id):
    user_id = get_jwt_identity()
    collection = Collection.query.filter_by(id=collection_id, user_id=user_id).first()
    if not collection:
        abort(404, description="Collection not found")
    db.session.delete(collection)
    db.session.commit()
    return jsonify({"message": "Collection deleted"}), 200
