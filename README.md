# 🎓 StudyMate – Personal Study Planning Platform

A full-stack web application for planning and managing your study schedule.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MySQL server running

### 1. Set up the Database

Open MySQL and run:
```sql
source database/studymate.sql
```

Or via command line:
```bash
mysql -u root -p < database/studymate.sql
```

### 2. Configure Database (optional)

If your MySQL has a password, edit `backend/config/db.js`:
```js
password: 'your_mysql_password',
```

Or set environment variables:
```bash
export DB_HOST=localhost
export DB_USER=root
export DB_PASS=yourpassword
export DB_NAME=studymate
```

### 3. Install Dependencies & Start

```bash
cd backend
npm install
node server.js
```

### 4. Open the App

Visit: **http://localhost:5000**

---

## 📁 Project Structure

```
studymate/
├── frontend/
│   ├── index.html          # Landing page
│   ├── login.html          # Login page
│   ├── signup.html         # Signup page
│   ├── add-task.html       # Add tasks (first page after login)
│   ├── schedule.html       # Generated schedule
│   ├── dashboard.html      # Main dashboard
│   ├── notifications.html  # Notifications
│   ├── profile.html        # User profile
│   ├── css/
│   │   ├── style.css       # App styles
│   │   ├── auth.css        # Auth pages styles
│   │   └── landing.css     # Landing page styles
│   └── js/
│       └── common.js       # Shared utilities
├── backend/
│   ├── server.js           # Express server entry
│   ├── routes/index.js     # All API routes
│   ├── controllers/        # Business logic
│   ├── config/db.js        # MySQL connection
│   └── uploads/            # Uploaded files
└── database/
    └── studymate.sql       # MySQL schema
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/signup | Register new user |
| POST | /api/login | Login |
| POST | /api/logout | Logout |
| GET | /api/me | Get current user |
| POST | /api/tasks | Create task (multipart) |
| GET | /api/tasks | Get all user tasks |
| PATCH | /api/tasks/:id | Update task |
| GET | /api/tasks/count | Count tasks |
| POST | /api/generate-schedule | Generate schedule |
| GET | /api/schedule | Get schedule |
| POST | /api/regenerate | Regenerate schedule |
| GET | /api/notifications | Get notifications |
| POST | /api/notifications/read | Mark all read |
| GET | /api/profile | Get profile & stats |

---

## 🎨 Color Theme

- Primary: `#4A6CF7` (Blue)
- Background: `#F5F7FB` (Light Gray)  
- Sidebar: `#1C1F2E` (Dark Navy)
- Cards: `#FFFFFF` (White)

---

## 📝 Notes

- Schedule generation is currently a **placeholder** (dummy data)
- AI-powered scheduling algorithm can be integrated later
- File uploads are stored in `backend/uploads/`
