from flask import Blueprint, request, jsonify

from models.stop_model import Stop

from extensions import db

stop_bp = Blueprint("stop_bp", __name__)


# ADD STOP
@stop_bp.route("/stops", methods=["POST"])
def add_stop():

    try:

        data = request.get_json()

        print(data)

        trip_id = data.get("trip_id")
        city = data.get("city")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        new_stop = Stop(
            trip_id=trip_id,
            city=city,
            start_date=start_date,
            end_date=end_date
        )

        db.session.add(new_stop)

        db.session.commit()

        return jsonify({
            "message": "Stop added successfully"
        }), 201

    except Exception as e:

        print(str(e))

        return jsonify({
            "error": str(e)
        }), 500


# GET STOPS BY TRIP
@stop_bp.route("/trips/<int:trip_id>/stops", methods=["GET"])
def get_stops(trip_id):

    try:

        stops = Stop.query.filter_by(
            trip_id=trip_id
        ).all()

        result = []

        for stop in stops:

            result.append({
                "id": stop.id,
                "city": stop.city,
                "start_date": stop.start_date,
                "end_date": stop.end_date,
                "trip_id": stop.trip_id
            })

        return jsonify(result), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# GET / UPDATE / DELETE STOP
@stop_bp.route("/stops/<int:id>", methods=["GET", "PUT", "DELETE"])
def manage_stop(id):

    try:

        stop = Stop.query.get(id)

        if not stop:

            return jsonify({
                "message": "Stop not found"
            }), 404

        if request.method == "GET":

            return jsonify({
                "id": stop.id,
                "city": stop.city,
                "start_date": stop.start_date,
                "end_date": stop.end_date,
                "trip_id": stop.trip_id
            }), 200

        if request.method == "PUT":

            data = request.get_json() or {}

            stop.city = data.get("city", stop.city)
            stop.start_date = data.get("start_date", stop.start_date)
            stop.end_date = data.get("end_date", stop.end_date)

            db.session.commit()

            return jsonify({
                "message": "Stop updated successfully",
                "stop": {
                    "id": stop.id,
                    "city": stop.city,
                    "start_date": stop.start_date,
                    "end_date": stop.end_date,
                    "trip_id": stop.trip_id
                },
                "trip_id": stop.trip_id
            }), 200

        if request.method == "DELETE":

            db.session.delete(stop)
            db.session.commit()

            return jsonify({
                "message": "Stop deleted successfully"
            }), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500