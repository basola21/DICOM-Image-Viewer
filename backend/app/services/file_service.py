import os
import uuid
from werkzeug.utils import secure_filename
from app.utils.config import Config


def save_file(file):
    if not file:
        return None, "No file part"
    if file.filename == "":
        return None, "No selected file"
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    filepath = os.path.join(Config.UPLOAD_FOLDER, unique_filename)
    file.save(filepath)
    return unique_filename, None
