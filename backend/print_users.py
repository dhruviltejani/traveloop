from app import app
from models.user_model import User

with app.app_context():
    users = User.query.all()
    for u in users:
        print(f"ID: {u.id}, Email: '{u.email}', Password: '{u.password}'")
