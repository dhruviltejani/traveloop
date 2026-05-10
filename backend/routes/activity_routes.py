from flask import Blueprint, request, jsonify

from models.activity_model import Activity

from extensions import db

activity_bp = Blueprint("activity_bp", __name__)


# =========================
# ADD ACTIVITY
# =========================
@activity_bp.route("/activities", methods=["POST"])
def add_activity():

    try:

        data = request.json

        new_activity = Activity(
            stop_id=data["stop_id"],
            title=data["title"],
            time=data["time"],
            cost=data["cost"]
        )

        db.session.add(new_activity)

        db.session.commit()

        return jsonify({
            "message": "Activity added successfully",
            "activity_id": new_activity.id
        }), 201

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# =========================
# GET ACTIVITIES OF A STOP
# =========================
@activity_bp.route("/activities/<int:stop_id>", methods=["GET"])
def get_activities(stop_id):

    try:

        activities = Activity.query.filter_by(
            stop_id=stop_id
        ).all()

        result = []

        for activity in activities:

            result.append({
                "id": activity.id,
                "title": activity.title,
                "time": activity.time,
                "cost": activity.cost
            })

        return jsonify(result), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# DELETE ACTIVITY
@activity_bp.route("/activities/<int:id>", methods=["DELETE"])
def delete_activity(id):

    try:

        activity = Activity.query.get(id)

        if not activity:

            return jsonify({
                "message": "Activity not found"
            }), 404

        db.session.delete(activity)

        db.session.commit()

        return jsonify({
            "message": "Activity deleted successfully"
        }), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500