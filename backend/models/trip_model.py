from extensions import db

class Trip(db.Model):

    __tablename__ = "trips"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    start_date = db.Column(
        db.String(50)
    )

    end_date = db.Column(
        db.String(50)
    )

    budget = db.Column(
        db.Float
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )

    stops = db.relationship(
        "Stop",
        backref="trip",
        lazy=True,
        cascade="all, delete-orphan"
    )