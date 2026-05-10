from extensions import db

class Stop(db.Model):

    __tablename__ = "stops"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    city = db.Column(
        db.String(100),
        nullable=False
    )

    start_date = db.Column(
        db.String(50)
    )

    end_date = db.Column(
        db.String(50)
    )

    trip_id = db.Column(
        db.Integer,
        db.ForeignKey("trips.id")
    )