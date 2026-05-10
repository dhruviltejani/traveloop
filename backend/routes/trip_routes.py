from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from extensions import db
from models.trip_model import Trip

trip_bp = Blueprint("trip", __name__)


# CREATE TRIP
@trip_bp.route("/trips", methods=["POST"])
@jwt_required()
def create_trip():

    user_id = get_jwt_identity()

    data = request.json

    trip = Trip(
        title=data["title"],
        description=data["description"],
        start_date=data["start_date"],
        end_date=data["end_date"],
        budget=data["budget"],
        user_id=user_id
    )

    db.session.add(trip)
    db.session.commit()

    return jsonify({
        "message": "Trip created successfully"
    })


# GET ALL TRIPS
@trip_bp.route("/trips", methods=["GET"])
@jwt_required()
def get_trips():

    user_id = get_jwt_identity()

    trips = Trip.query.filter_by(
        user_id=user_id
    ).all()

    result = []

    for trip in trips:
        result.append({
            "id": trip.id,
            "title": trip.title,
            "description": trip.description,
            "budget": trip.budget,
            "start_date": trip.start_date,
            "end_date": trip.end_date
        })


    return jsonify(result)

# DELETE TRIP
@trip_bp.route("/trips/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_trip(id):

    user_id = get_jwt_identity()

    trip = Trip.query.filter_by(
        id=id,
        user_id=int(user_id)
    ).first()

    if not trip:
        return jsonify({
            "message": "Trip not found"
        }), 404

    db.session.delete(trip)
    db.session.commit()

    return jsonify({
        "message": "Trip deleted successfully"
    })

# UPDATE TRIP
@trip_bp.route("/trips/<int:id>", methods=["PUT"])
def update_trip(id):

    try:

        trip = Trip.query.get(id)

        if not trip:

            return jsonify({
                "message": "Trip not found"
            }), 404

        data = request.get_json()

        trip.title = data.get("title")
        trip.start_date = data.get("start_date")
        trip.end_date = data.get("end_date")
        trip.budget = data.get("budget")

        db.session.commit()

        return jsonify({
            "message": "Trip updated successfully"
        }), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500