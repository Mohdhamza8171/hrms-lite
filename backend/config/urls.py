"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from hrms import views
from hrms.auth import *
from hrms.views import *
from django.http import HttpResponse


urlpatterns = [
    path("", lambda request: HttpResponse("HRMS Backend is Running ✅")),
    # Auth
    path("api/register/", register_user),
    path("api/login/", login_user),
    path("api/logout/", logout_user),
    # Dashboard Stats
    path("api/dashboard/", views.dashboard_stats),
    # Employee APIs
    path("api/employees/add/", views.add_employee),
    path("api/employees/", views.list_employees),
    path("api/employees/<str:emp_id>/", views.get_employee),
    path("api/employees/<str:emp_id>/delete/", views.delete_employee),
    # Attendance APIs
    path("api/attendance/add/", views.add_attendance),
    path("api/attendance/", views.list_attendance),
    path("api/attendance/employee/<str:emp_id>/", views.get_attendance_by_employee),
    path("api/attendance/<str:att_id>/delete/", views.delete_attendance),
]
