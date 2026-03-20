# 🧪 StudyMate API Testing Guide

Use this guide to test all API endpoints. You can use tools like **Postman**, **Insomnia**, or **cURL**.

---

## 🔧 Setup

### Get a Token
First, signup or login to get a JWT token.

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "fullName": "Test User"
  }'

# Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "fullName": "Test User"
  }
}
```

Use this token for all subsequent requests with Authorization header:
```
Authorization: Bearer {token}
```

---

## 🔐 Authentication Endpoints

### 1. Signup
```bash
POST http://localhost:5000/api/auth/signup

Body:
{
  "email": "newuser@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "fullName": "John Doe"
}

Expected Response: 201 Created
{
  "success": true,
  "token": "...",
  "user": { ... }
}
```

### 2. Login
```bash
POST http://localhost:5000/api/auth/login

Body:
{
  "email": "test@example.com",
  "password": "password123"
}

Expected Response: 200 OK
{
  "success": true,
  "token": "...",
  "user": { ... }
}
```

### 3. Verify Token
```bash
POST http://localhost:5000/api/auth/verify-token

Headers:
Authorization: Bearer {token}

Expected Response: 200 OK
{
  "success": true,
  "user": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

---

## 📚 Task Management Endpoints

### 1. Add Task
```bash
POST http://localhost:5000/api/tasks/add

Headers:
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "taskType": "Assignment",
  "taskName": "Mathematics Project",
  "description": "Complete calculus problems 1-20",
  "deadline": "2026-03-20",
  "difficulty": "Medium",
  "estimatedHours": 5
}

Expected Response: 201 Created
{
  "success": true,
  "taskId": 1
}
```

### 2. Add Task with File Upload
```bash
POST http://localhost:5000/api/tasks/add

Headers:
Authorization: Bearer {token}

Body (Form Data):
- taskType: "Exam"
- taskName: "Physics Final"
- deadline: "2026-04-15"
- difficulty: "Hard"
- estimatedHours: 10
- file: [select file]

Expected Response: 201 Created
```

### 3. Get All Tasks
```bash
GET http://localhost:5000/api/tasks/all

Headers:
Authorization: Bearer {token}

Expected Response: 200 OK
{
  "success": true,
  "tasks": [
    {
      "id": 1,
      "user_id": 1,
      "task_type": "Assignment",
      "task_name": "Mathematics Project",
      "deadline": "2026-03-20",
      "difficulty": "Medium",
      "estimated_hours": 5,
      "status": "Pending",
      "created_at": "2026-03-10T10:00:00.000Z"
    }
  ]
}
```

### 4. Get Today's Tasks
```bash
GET http://localhost:5000/api/tasks/today

Headers:
Authorization: Bearer {token}

Expected Response: 200 OK
{
  "success": true,
  "tasks": [ ... ]
}
```

### 5. Get Task by ID
```bash
GET http://localhost:5000/api/tasks/1

Headers:
Authorization: Bearer {token}

Expected Response: 200 OK
{
  "success": true,
  "task": { ... }
}
```

### 6. Update Task
```bash
PUT http://localhost:5000/api/tasks/1

Headers:
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "taskName": "Updated Task Name",
  "difficulty": "Hard",
  "status": "In Progress"
}

Expected Response: 200 OK
{
  "success": true,
  "message": "Task updated successfully"
}
```

### 7. Delete Task
```bash
DELETE http://localhost:5000/api/tasks/1

Headers:
Authorization: Bearer {token}

Expected Response: 200 OK
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## 📅 Schedule Endpoints

### 1. Generate Schedule
```bash
POST http://localhost:5000/api/schedule/generate

Headers:
Authorization: Bearer {token}

Body: {} (empty, uses user's tasks)

Expected Response: 200 OK
{
  "success": true,
  "message": "Schedule generated successfully",
  "schedules": [
    {
      "date": "2026-03-11",
      "taskName": "Mathematics Project",
      "taskType": "Assignment",
      "plan": "Review requirements",
      "hours": 2
    }
  ]
}
```

### 2. View Schedule
```bash
GET http://localhost:5000/api/schedule/view

Headers:
Authorization: Bearer {token}

Expected Response: 200 OK
{
  "success": true,
  "schedule": {
    "2026-03-11": [
      {
        "taskName": "Mathematics Project",
        "taskType": "Assignment",
        "plan": "Review requirements",
        "hours": 2,
        "deadline": "2026-03-20"
      }
    ]
  }
}
```

### 3. Export Schedule as PDF
```bash
GET http://localhost:5000/api/schedule/export-pdf

Headers:
Authorization: Bearer {token}

Expected Response: 200 OK
(File download: study-schedule.pdf)
```

---

## 👤 Profile Endpoints

### 1. Get Profile Info
```bash
GET http://localhost:5000/api/profile/info

Headers:
Authorization: Bearer {token}

Expected Response: 200 OK
{
  "success": true,
  "user": {
    "id": 1,
    "email": "test@example.com",
    "full_name": "Test User",
    "created_at": "2026-03-10T10:00:00.000Z"
  }
}
```

### 2. Get Tasks Summary
```bash
GET http://localhost:5000/api/profile/tasks-summary

Headers:
Authorization: Bearer {token}

Expected Response: 200 OK
{
  "success": true,
  "summary": [
    {
      "task_type": "Assignment",
      "status": "Pending",
      "count": 2
    },
    {
      "task_type": "Exam",
      "status": "Completed",
      "count": 1
    }
  ]
}
```

### 3. Get Upcoming Deadlines
```bash
GET http://localhost:5000/api/profile/upcoming-deadlines

Headers:
Authorization: Bearer {token}

Expected Response: 200 OK
{
  "success": true,
  "upcomingDeadlines": [
    {
      "id": 1,
      "task_name": "Math Project",
      "task_type": "Assignment",
      "deadline": "2026-03-20",
      "difficulty": "Medium"
    }
  ]
}
```

### 4. Update Profile
```bash
PUT http://localhost:5000/api/profile/update

Headers:
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "fullName": "New Name"
}

Expected Response: 200 OK
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## 📋 Test Scenarios

### Scenario 1: Complete User Journey

1. **Signup**
   ```bash
   POST /api/auth/signup
   {email, password, confirmPassword, fullName}
   ```

2. **Add 3 Tasks**
   ```bash
   POST /api/tasks/add
   POST /api/tasks/add
   POST /api/tasks/add
   ```

3. **Get All Tasks**
   ```bash
   GET /api/tasks/all
   ```

4. **Generate Schedule**
   ```bash
   POST /api/schedule/generate
   ```

5. **View Schedule**
   ```bash
   GET /api/schedule/view
   ```

6. **Export PDF**
   ```bash
   GET /api/schedule/export-pdf
   ```

7. **Get Profile**
   ```bash
   GET /api/profile/info
   GET /api/profile/upcoming-deadlines
   ```

---

## 🔍 Error Handling

### Missing Authorization Header
```
401 Unauthorized
{
  "success": false,
  "message": "No token provided"
}
```

### Invalid Token
```
401 Unauthorized
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Validation Error
```
400 Bad Request
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### Resource Not Found
```
404 Not Found
{
  "success": false,
  "message": "Task not found"
}
```

### Server Error
```
500 Internal Server Error
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (dev only)"
}
```

---

## 🧪 Testing with Postman

### 1. Create Collection
- Create new collection: "StudyMate"
- Create folder: "Auth"
- Create folder: "Tasks"
- Create folder: "Schedule"
- Create folder: "Profile"

### 2. Set Environment Variables
```json
{
  "base_url": "http://localhost:5000/api",
  "token": ""
}
```

### 3. Add Signup Request
- Method: POST
- URL: {{base_url}}/auth/signup
- Tests:
  ```javascript
  if (pm.response.code === 201) {
    pm.environment.set("token", pm.response.json().token);
  }
  ```

### 4. Add Bearer Token
- For all subsequent requests in Auth tab
- Authorization → Type: Bearer Token
- Token: {{token}}

---

## 🚀 Automated Testing Script

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"
TOKEN=""

# Function to make request
request() {
  local method=$1
  local endpoint=$2
  local data=$3
  
  if [ -z "$TOKEN" ]; then
    curl -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data"
  else
    curl -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$data"
  fi
}

# Signup
echo "=== Signup ==="
RESPONSE=$(request POST "/auth/signup" '{
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "fullName": "Test User"
}')
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
echo "Token: $TOKEN"

# Add Task
echo -e "\n=== Add Task ==="
request POST "/tasks/add" '{
  "taskType": "Assignment",
  "taskName": "Test Task",
  "deadline": "2026-04-01",
  "difficulty": "Medium",
  "estimatedHours": 5
}'

# Get Tasks
echo -e "\n=== Get Tasks ==="
request GET "/tasks/all" ""

# Generate Schedule
echo -e "\n=== Generate Schedule ==="
request POST "/schedule/generate" ""

# View Schedule
echo -e "\n=== View Schedule ==="
request GET "/schedule/view" ""
```

---

## ✅ Testing Checklist

- [ ] All signup/login flows work
- [ ] Token generation and verification work
- [ ] Can create tasks with and without files
- [ ] Can retrieve all/today/specific tasks
- [ ] Can update task details
- [ ] Can delete tasks
- [ ] Schedule generation works
- [ ] Schedule displays correctly
- [ ] PDF export downloads file
- [ ] Profile endpoints work
- [ ] Error handling is correct
- [ ] Validation prevents invalid data
- [ ] Database persists data correctly
- [ ] Timestamps are recorded

---

**Happy Testing! 🧪✨**
