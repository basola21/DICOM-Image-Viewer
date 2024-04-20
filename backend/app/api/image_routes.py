from flask import send_from_directory, jsonify
from flask_smorest import Blueprint, abort
import os
from app.utils.config import Config
from app.services.analysis_service import analyze_image

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
