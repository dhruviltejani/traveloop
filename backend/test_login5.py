import urllib.request
import json
import uuid

def run():
    # Register
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    data = {"name": "Test User", "email": email, "password": "password123"}
    req = urllib.request.Request("http://127.0.0.1:5000/auth/register", data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    try:
        res = urllib.request.urlopen(req)
        print("Register:", res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("Register Error:", e.code, e.read().decode('utf-8'))
        return

    # Login
    data = {"email": email, "password": "password123"}
    req = urllib.request.Request("http://127.0.0.1:5000/auth/login", data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        res = urllib.request.urlopen(req)
        print("Login:", res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("Login Error:", e.code, e.read().decode('utf-8'))

if __name__ == "__main__":
    run()
