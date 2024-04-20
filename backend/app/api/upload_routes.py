from flask import request, jsonify
from flask_smorest import Blueprint, abort
from app.services.file_service import save_file

upload_bp = Blueprint("uploads", __name__, url_prefix="/upload")


@upload_bp.route("/", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    filename, error = save_file(file)
    if error:
        abort(400, description=error)
    return jsonify({"message": "File successfully uploaded", "filename": filename}), 200
