from flask import jsonify
from flask_smorest import Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from werkzeug.security import check_password_hash

from app.database import db
from app.models.user import User
from app.schemas.user import UserRegisterSchema, UserLoginSchema

users_bp = Blueprint("users", __name__, url_prefix="/users")


@users_bp.route("/register", methods=["POST"])
@users_bp.arguments(UserRegisterSchema)
def register(user_data):
    if User.query.filter_by(email=user_data["email"]).first() is not None:
        return {"message": "Email already in use"}, 400

    user = User(email=user_data["email"])
    user.set_password(user_data["password"])
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(
        identity=user.id, expires_delta=timedelta(days=1)
    )

    return {
        "message": "User successfully registered",
        "id": user.id,
        "email": user.email,
        "access_token": access_token,
    }, 201


@users_bp.route("/login", methods=["POST"])
@users_bp.arguments(UserLoginSchema)
def login(user_data):
    user = User.query.filter_by(email=user_data["email"]).first()

    if user is None or not check_password_hash(
        user.password_hash, user_data["password"]
    ):
        return {"message": "Invalid credentials"}, 401

    access_token = create_access_token(
        identity=user.id, expires_delta=timedelta(days=1)
    )

    return {
        "message": "Login successful",
        "email": user.email,
        "access_token": access_token,
    }, 200


@users_bp.route("/details", methods=["GET"])
@jwt_required()
def get_user_details():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    return (
        jsonify(
            {
                "email": user.email,
            }
        ),
        200,
    )
