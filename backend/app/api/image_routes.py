from flask import send_from_directory
from flask_smorest import Blueprint, abort
from os import path
from app.utils.config import Config

images_bp = Blueprint("images", __name__, url_prefix="/images")


@images_bp.route("/<filename>", methods=["GET"])
def get_image(filename):
    file_path = path.join(Config.UPLOAD_FOLDER, filename)
    if not path.isfile(file_path):
        abort(404, description="File not found")
    return send_from_directory(Config.UPLOAD_FOLDER, filename, as_attachment=True)
