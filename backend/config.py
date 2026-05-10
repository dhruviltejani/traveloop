class Config:

    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://root:0000@localhost/traveloop"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = "traveloop_secret"

    JWT_SECRET_KEY = "jwt_secret"