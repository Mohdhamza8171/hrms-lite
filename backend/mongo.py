import mongoengine
import os

MONGO_URL = os.getenv(
    "MONGO_URL", "mongodb://localhost:27017/hrmslite"
)  # default to hrmslite
mongoengine.connect(host=MONGO_URL, alias="default")
