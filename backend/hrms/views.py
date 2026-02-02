from django.http import JsonResponse
from mongoengine.errors import NotUniqueError, ValidationError, DoesNotExist
from hrms.auth import token_required
from hrms.permissions import roles_allowed
from .models import User, Employee, Attendance
from .utils.errors import handle_mongo_errors
import json
import jwt
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt
from functools import wraps
from django.conf import settings
import secrets
from bson import ObjectId
from django.http import JsonResponse


SECRET_KEY = settings.JWT_SECRET_KEY
TOKEN_EXP_HOURS = 2


# ------------------- HELPERS -------------------


def parse_body(request):
    try:
        return json.loads(request.body)
    except json.JSONDecodeError:
        return {}


# ------------------- AUTH -------------------


@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    data = parse_body(request)
    if not data:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    user = User(
        username=data.get("username"),
        email=data.get("email"),
        role=data.get("role", "employee"),
    )
    user.set_password(data.get("password"))

    try:
        user.save()
        return JsonResponse({"message": "User registered successfully"}, status=201)
    except NotUniqueError:
        return JsonResponse({"error": "Username or email already exists"}, status=400)
    except ValidationError as e:
        return handle_mongo_errors(e)


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    data = parse_body(request)
    if not data:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    user = User.objects(email=data.get("email")).first()
    if not user or not user.check_password(data.get("password")):
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    token = jwt.encode(
        {
            "user_id": str(user.id),
            "role": user.role,
            "exp": datetime.utcnow() + timedelta(hours=TOKEN_EXP_HOURS),
        },
        SECRET_KEY,
        algorithm="HS256",
    )

    return JsonResponse({"token": token})


def token_required(view_func):
    @wraps(view_func)
    def wrapped(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Token missing"}, status=401)

        token = auth_header.split(" ")[1]

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = data["user_id"]
            request.user_role = data["role"]  # 👈 IMPORTANT
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)

        return view_func(request, *args, **kwargs)

    return wrapped


@token_required
def dashboard_stats(request):
    from datetime import date

    return JsonResponse(
        {
            "total_employees": Employee.objects.count(),
            "today_attendance": Attendance.objects(date=date.today()).count(),
        }
    )


# ------------------- EMPLOYEE APIs -------------------


@csrf_exempt
@token_required
@roles_allowed("admin", "hr")
def add_employee(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    data = parse_body(request)
    if not data:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    try:
        emp = Employee(
            employee_id=data.get("employee_id"),
            full_name=data.get("full_name"),
            email=data.get("email"),
            department=data.get("department"),
        )
        emp.save()
        return JsonResponse(
            {"message": "Employee added", "id": str(emp.id)}, status=201
        )
    except (NotUniqueError, ValidationError) as e:
        return handle_mongo_errors(e)


@token_required
def list_employees(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET method required"}, status=405)

    employees = Employee.objects()
    data = [
        {
            "id": str(emp.id),
            "employee_id": emp.employee_id,
            "full_name": emp.full_name,
            "email": emp.email,
            "department": emp.department,
        }
        for emp in employees
    ]
    return JsonResponse(data, safe=False)


@token_required
def get_employee(request, emp_id):
    try:
        emp = Employee.objects.get(id=emp_id)
        return JsonResponse(
            {
                "id": str(emp.id),
                "employee_id": emp.employee_id,
                "full_name": emp.full_name,
                "email": emp.email,
                "department": emp.department,
            }
        )
    except DoesNotExist:
        return JsonResponse({"error": "Employee not found"}, status=404)


@csrf_exempt
@token_required
@roles_allowed("admin", "hr")
def update_employee(request, emp_id):
    if request.method not in ["PUT", "PATCH"]:
        return JsonResponse({"error": "PUT or PATCH required"}, status=405)

    try:
        data = parse_body(request)
        emp = Employee.objects.get(id=emp_id)

        if "full_name" in data:
            emp.full_name = data["full_name"]
        if "email" in data:
            emp.email = data["email"]
        if "department" in data:
            emp.department = data["department"]

        emp.save()
        return JsonResponse({"message": "Employee updated"})
    except DoesNotExist:
        return JsonResponse({"error": "Employee not found"}, status=404)
    except (NotUniqueError, ValidationError) as e:
        return handle_mongo_errors(e)


@csrf_exempt
@token_required
def delete_employee(request, emp_id):  # 🔥 changed here

    if request.method != "DELETE":
        return JsonResponse({"error": "Invalid request"}, status=405)

    try:
        employee = Employee.objects(id=ObjectId(emp_id)).first()

        if not employee:
            return JsonResponse({"error": "Employee not found"}, status=404)

        Attendance.objects(employee=employee).delete()
        employee.delete()

        return JsonResponse({"message": "Employee deleted successfully"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ------------------- ATTENDANCE APIs -------------------


@csrf_exempt
@token_required
def add_attendance(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request"}, status=400)

    try:
        data = parse_body(request)

        employee_id = data.get("employee_id")
        date = data.get("date")
        status = data.get("status")

        if not employee_id or not date or not status:
            return JsonResponse({"error": "Missing required fields"}, status=400)

        employee = Employee.objects(id=ObjectId(employee_id)).first()

        if not employee:
            return JsonResponse({"error": "Employee not found"}, status=404)

        attendance = Attendance(employee=employee, date=date, status=status)
        attendance.save()

        return JsonResponse({"message": "Attendance added successfully"}, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@token_required
def list_attendance(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET method required"}, status=405)

    records = Attendance.objects()

    data = [
        {
            "id": str(att.id),
            "employee_id": str(att.employee.id),
            "employee_name": att.employee.full_name,
            "date": att.date.strftime("%Y-%m-%d"),
            "status": att.status,
        }
        for att in records
    ]

    return JsonResponse(data, safe=False)


@csrf_exempt
@token_required
@roles_allowed("admin", "hr", "employee")
def get_attendance_by_employee(request, emp_id):
    try:
        emp = Employee.objects.get(id=ObjectId(emp_id))
        records = Attendance.objects(employee=emp)

        data = [
            {
                "id": str(att.id),
                "date": att.date.strftime("%Y-%m-%d"),
                "status": att.status,
            }
            for att in records
        ]
        return JsonResponse(data, safe=False)
    except (DoesNotExist, ValidationError):
        return JsonResponse({"error": "Employee not found"}, status=404)


@csrf_exempt
@token_required
def delete_attendance(request, att_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE method required"}, status=405)

    try:
        attendance = Attendance.objects(id=ObjectId(att_id)).first()

        if not attendance:
            return JsonResponse({"error": "Attendance not found"}, status=404)

        attendance.delete()

        return JsonResponse({"message": "Attendance deleted successfully"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
