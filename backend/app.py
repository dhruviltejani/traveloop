from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, jwt

from models.user_model import User
from models.trip_model import Trip

from routes.auth_routes import auth_bp
from routes.trip_routes import trip_bp
from routes.stop_routes import stop_bp
from routes.activity_routes import activity_bp

from models.stop_model import Stop
from models.activity_model import Activity



app = Flask(__name__)


app.config.from_object(Config)

CORS(app)

db.init_app(app)
jwt.init_app(app)

# REGISTER ROUTES
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(trip_bp)
app.register_blueprint(stop_bp)
app.register_blueprint(activity_bp)


# HOME ROUTE
@app.route("/")
def home():
    return {
        "message": "Traveloop API Running"
    }

# CREATE TABLES
with app.app_context():
    db.create_all()

# RUN SERVER
if __name__ == "__main__":
    app.run(debug=True)