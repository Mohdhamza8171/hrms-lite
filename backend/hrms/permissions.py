# hrms/permissions.py

from functools import wraps
from django.http import JsonResponse


def roles_allowed(*roles):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if request.user_role not in roles:
                return JsonResponse({"error": "Permission denied"}, status=403)
            return view_func(request, *args, **kwargs)

        return wrapper

    return decorator
