# HRMS Lite — Employee & Attendance Management System

A full-stack HR management system built with:

- **Backend:** Django + MongoDB (MongoEngine)
- **Frontend:** React.js
- **Authentication:** JWT Token Based

This system allows you to:

- Manage employees
- Mark attendance
- Secure APIs using JWT tokens
- Perform delete operations for employees & attendance

---

## Project Structure

```
hrms-lite/
│
├── backend/     → Django REST API
└── frontend/    → React.js Application
```

---

## Backend Setup (Django + MongoDB)

### 1. Navigate to backend

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

Activate it:

**Linux / Mac**

```bash
source venv/bin/activate
```

**Windows**

```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Create `.env` File

Inside the **backend** folder create a file named `.env`:

```
MONGO_URL=mongodb+srv://mohdhamza339_db_user:99AQMEuvZwLmHm3n@mohdhamza.p5prdup.mongodb.net/hrmslite?retryWrites=true&w=majority
SECRET_KEY=djagno-super-secret-key-change-this
JWT_SECRET=djagno-super-secret-key-change-this
```

### 5. Install CORS Support

```bash
pip install django-cors-headers
```

Update **settings.py**

```python
INSTALLED_APPS = [
    ...
    "corsheaders",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    ...
]

CORS_ALLOW_ALL_ORIGINS = True  # For development only
```

### 6. Make Sure MongoDB is Running

```bash
sudo systemctl start mongod
```

OR

```bash
mongod
```

### 7. Start Django Server

```bash
python manage.py runserver
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

## Frontend Setup (React)

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install Node Modules

```bash
npm install
```

### 3. Start React App

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## Authentication Flow

1. User logs in
2. Backend returns a **JWT token**
3. Token is saved in **localStorage**
4. All protected APIs require header:

```
Authorization: Bearer <your_token_here>
```

---

## API Endpoints

| Feature           | Method | Endpoint                       |
| ----------------- | ------ | ------------------------------ |
| Login             | POST   | `/api/login/`                  |
| Add Employee      | POST   | `/api/employees/add/`          |
| List Employees    | GET    | `/api/employees/`              |
| Delete Employee   | DELETE | `/api/employees/<id>/delete/`  |
| Add Attendance    | POST   | `/api/attendance/add/`         |
| List Attendance   | GET    | `/api/attendance/`             |
| Delete Attendance | DELETE | `/api/attendance/<id>/delete/` |

---

## Example API Call (Login)

```bash
curl -X POST http://127.0.0.1:8000/api/login/ \
-H "Content-Type: application/json" \
-d '{"email":"admin@test.com","password":"123456"}'
```

Use the returned token in other requests.

---

## Production Notes

Before deploying:

- Set `DEBUG = False`
- Use MongoDB Atlas or production DB
- Replace `CORS_ALLOW_ALL_ORIGINS = True`
- Use Gunicorn + Nginx for deployment

---

## Author

Developed by **Mohd Hamza**
