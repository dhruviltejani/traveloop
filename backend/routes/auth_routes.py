from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from extensions import db
from models.user_model import User

import bcrypt

auth_bp = Blueprint("auth", __name__)


# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.json

    hashed_password = bcrypt.hashpw(
        data["password"].encode("utf-8"),
        bcrypt.gensalt()
    )

    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed_password.decode("utf-8")
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    })


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.json

    user = User.query.filter_by(
        email=data["email"]
    ).first()

    if not user:
        return jsonify({
            "message": "Invalid email"
        }), 401

    valid = bcrypt.checkpw(
        data["password"].encode("utf-8"),
        user.password.encode("utf-8")
    )

    if not valid:
        return jsonify({
            "message": "Invalid password"
        }), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    })


# GET CURRENT USER
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "created_at": user.created_at.isoformat() if user.created_at else None
    })


# UPDATE PROFILE
@auth_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_profile():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    data = request.json

    # Update fields if provided
    if "name" in data:
        user.name = data["name"]
    if "email" in data:
        # Check if email is already taken by another user
        existing_user = User.query.filter_by(email=data["email"]).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({
                "message": "Email already in use"
            }), 400
        user.email = data["email"]

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    })


# DELETE ACCOUNT
@auth_bp.route("/me", methods=["DELETE"])
@jwt_required()
def delete_account():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    # Delete all user's trips and related data
    for trip in user.trips:
        # Delete activities for each trip's stops
        for stop in trip.stops:
            for activity in stop.activities:
                db.session.delete(activity)
            db.session.delete(stop)
        db.session.delete(trip)

    # Delete the user
    db.session.delete(user)
    db.session.commit()

    return jsonify({
        "message": "Account deleted successfully"
    })