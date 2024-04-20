from flask import Flask
from flask_cors import CORS
from flask_smorest import Api
from .api.upload_routes import upload_bp
from .api.image_routes import images_bp
from .utils.config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/*": {"origins": Config.DOMAIN}},
        supports_credentials=True,
        expose_headers=["Content-Type", "X-CSRFToken"],
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    )

    api = Api(app)
    api.register_blueprint(upload_bp)
    api.register_blueprint(images_bp)

    return app
