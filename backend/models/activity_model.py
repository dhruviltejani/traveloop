from extensions import db

class Activity(db.Model):

    __tablename__ = "activities"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    time = db.Column(
        db.String(50)
    )

    cost = db.Column(
        db.Float
    )

    stop_id = db.Column(
        db.Integer,
        db.ForeignKey("stops.id")
    )