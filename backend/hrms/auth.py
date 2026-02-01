# hrms/auth.py
from hrms.models import User
from django.http import JsonResponse
from mongoengine.errors import NotUniqueError, ValidationError, DoesNotExist
from .models import User, Employee, Attendance
from .utils.errors import handle_mongo_errors
import json
import jwt
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt
from functools import wraps
from django.conf import settings
import secrets

SECRET_KEY = settings.JWT_SECRET_KEY
TOKEN_EXP_HOURS = 2

# def register_user(request):
#     from hrms.models import User

#     data = json.loads(request.body)
#     user = User(username=data["username"], email=data["email"])
#     user.set_password(data["password"])
#     try:
#         user.save()
#         return JsonResponse({"message": "User registered successfully"})
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=400)


def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)
    data = json.loads(request.body)
    user = User.objects(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    token = jwt.encode(
        {"user_id": str(user.id), "exp": datetime.utcnow() + timedelta(hours=2)},
        settings.SECRET_KEY,
        algorithm="HS256",
    )
    return JsonResponse({"token": token})


def logout_user(request):
    # Since we’re using token-based auth (JWT), the frontend can just delete the token.
    # Optional: You can also maintain a token blacklist if needed.
    return JsonResponse({"message": "Logged out successfully"})


def token_required(view_func):
    @wraps(view_func)
    def wrapped(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return JsonResponse({"error": "Token missing"}, status=401)

        try:
            token = auth_header.split(" ")[1]  # Remove "Bearer"
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = data["user_id"]
        except IndexError:
            return JsonResponse({"error": "Invalid token format"}, status=401)
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)

        return view_func(request, *args, **kwargs)

    return wrapped
