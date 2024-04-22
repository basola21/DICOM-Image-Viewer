from flask import send_from_directory, jsonify, request
from flask_smorest import Blueprint, abort
import os
from app.utils.config import Config
from app.services.analysis_service import analyze_image
from werkzeug.utils import secure_filename
from app.models.image import Image
from app.models.collection import Collection
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import db


images_bp = Blueprint("images", __name__, url_prefix="/images")


@images_bp.route("/<filename>", methods=["GET"])
def get_image(filename):
    file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
    if not os.path.isfile(file_path):
        abort(404, description="File not found")
    return send_from_directory(Config.UPLOAD_FOLDER, filename, as_attachment=True)


@images_bp.route("/analyze/<filename>", methods=["GET"])
def analyze_dicom_image(filename):
    file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
    keypoints = analyze_image(file_path)

    return jsonify(keypoints)


@images_bp.route("/add_to_collection/<int:collection_id>", methods=["POST"])
@jwt_required()
def add_image_to_collection(collection_id):
    if "file" not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
    file.save(file_path)

    user_id = get_jwt_identity()
    collection = Collection.query.filter_by(id=collection_id, user_id=user_id).first()
    if not collection:
        return jsonify({"message": "Collection not found or not accessible"}), 404

    new_image = Image(file_path=file_path, collection_id=collection.id)
    db.session.add(new_image)
    db.session.commit()

    return (
        jsonify({"message": "Image added to collection", "image_id": new_image.id}),
        201,
    )
