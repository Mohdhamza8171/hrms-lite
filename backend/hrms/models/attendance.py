from mongoengine import Document, StringField, DateField, ReferenceField, CASCADE
from .employee import Employee


class Attendance(Document):
    meta = {"collection": "attendance"}
    STATUS_CHOICES = ("Present", "Absent")
    employee = ReferenceField(Employee, reverse_delete_rule=CASCADE)
    date = DateField(required=True)
    status = StringField(choices=STATUS_CHOICES, required=True)
