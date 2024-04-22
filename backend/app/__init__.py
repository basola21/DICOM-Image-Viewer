from flask import Flask
from flask_cors import CORS
from flask_smorest import Api
from flask_migrate import Migrate
from .api.upload_routes import upload_bp
from .api.image_routes import images_bp
from .api.users_routes import users_bp
from .api.collection_routes import collections_bp
from .utils.config import Config
from .database import db
from flask_jwt_extended import JWTManager

migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/*": {"origins": Config.DOMAIN}},
        supports_credentials=True,
        expose_headers=["Content-Type", "X-CSRFToken"],
        allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
    )

    api = Api(app)

    initialize_extensions(app)
    api.register_blueprint(upload_bp)
    api.register_blueprint(images_bp)
    api.register_blueprint(users_bp)
    api.register_blueprint(collections_bp)

    return app


def initialize_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)
