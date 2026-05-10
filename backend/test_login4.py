import urllib.request
import json

def run():
    # Login
    data = {"email": "test@test.com", "password": "test"} # using a known test email
    req = urllib.request.Request("http://127.0.0.1:5000/auth/login", data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        res = urllib.request.urlopen(req)
        print("Login:", res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("Login Error:", e.code, e.read().decode('utf-8'))
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    run()
