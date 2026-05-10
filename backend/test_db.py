from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mysql+pymysql://root:YOUR_PASSWORD@localhost/traveloop"
)

db = SQLAlchemy(app)

with app.app_context():
    print("MySQL Connected Successfully!")