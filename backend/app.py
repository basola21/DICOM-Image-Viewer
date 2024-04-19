from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from flask_smorest import Api, Blueprint
from werkzeug.utils import secure_filename
import os
import uuid

app = Flask(__name__)
app.config.update(
    {
        "API_TITLE": "DICOM Image Processing API",
        "API_VERSION": "v1",
        "OPENAPI_VERSION": "3.0.2",
        "OPENAPI_URL_PREFIX": "/",
        "OPENAPI_SWAGGER_UI_PATH": "/docs",
        "OPENAPI_SWAGGER_UI_URL": "https://cdn.jsdelivr.net/npm/swagger-ui-dist/",
    }
)
CORS(app, origins=["http://localhost:5173"])  # Ensure this matches your frontend's URL
api = Api(app)
UPLOAD_FOLDER = "./uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

upload_bp = Blueprint(
    "uploads",
    "uploads",
    url_prefix="/upload",
    description="Operations related to file uploads",
)
images_bp = Blueprint(
    "images",
    "images",
    url_prefix="/images",
    description="Operations related to image retrieval",
)


@upload_bp.route("/", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        abort(400, message="No file part")
    file = request.files["file"]
    if file.filename == "":
        abort(400, message="No selected file")
    filename = secure_filename(file.filename)
    unique_filename = (
        f"{uuid.uuid4()}_{filename}"  # Use UUIDs to ensure unique file names
    )
    filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(filepath)
    return (
        jsonify({"message": "File successfully uploaded", "filename": unique_filename}),
        200,
    )


@images_bp.route("/<filename>", methods=["GET"])
def get_image(filename):
    # Directly send the DICOM file without transformation
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.isfile(file_path):
        abort(404, message="File not found")
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)


api.register_blueprint(upload_bp)
api.register_blueprint(images_bp)

if __name__ == "__main__":
    app.run(debug=True)
