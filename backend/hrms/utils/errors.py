from mongoengine.errors import NotUniqueError, ValidationError
from django.http import JsonResponse


def handle_mongo_errors(err):
    if isinstance(err, NotUniqueError):
        key = list(
            err.args[0].split()[-1].replace("{", "").replace("}", "").split(":")
        )[-1].strip('"')
        return JsonResponse({"error": f"{key.capitalize()} already exists"}, status=400)
    elif isinstance(err, ValidationError):
        return JsonResponse({"error": str(err)}, status=400)
    else:
        return JsonResponse({"error": "Database error"}, status=500)
