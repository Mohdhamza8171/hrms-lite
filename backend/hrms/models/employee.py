from mongoengine import (
    Document,
    StringField,
    EmailField,
    ReferenceField,
    DateField,
    CASCADE,
)


class Employee(Document):
    meta = {"collection": "employees"}
    employee_id = StringField(max_length=20, unique=True, required=True)
    full_name = StringField(max_length=100, required=True)
    email = EmailField(unique=True, required=True)
    department = StringField(max_length=50)
