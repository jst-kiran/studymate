# StudyMate - Quick Start Guide

## ⚡ Getting Started in 5 Minutes

### Prerequisites
- ✅ Node.js installed
- ✅ MySQL installed and running
- ✅ Text editor or IDE

### Step 1: Database (2 minutes)

1. Open MySQL Command Line or MySQL Workbench
2. Run this command to create the database:

```sql
CREATE DATABASE studymate_db;
USE studymate_db;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    task_type ENUM('Assignment', 'Exam', 'Study') NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    deadline DATE NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    estimated_hours INT NOT NULL,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    task_id INT NOT NULL,
    study_date DATE NOT NULL,
    study_plan VARCHAR(500),
    hours_allocated INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
```

Or simply run the SQL file:
```bash
mysql -u root -p < database/studymate.sql
```

### Step 2: Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
npm install

# Configure .env file (update DB password if needed)
# Edit .env file with your MySQL credentials

# Start server
npm start
```

Expected output: `StudyMate Server running on http://localhost:5000`

### Step 3: Frontend Launch (1 minute)

Open a new terminal:

```bash
# Option 1: Using Python
cd frontend
python -m http.server 8000

# Option 2: Using Node.js
cd frontend
npx http-server

# Option 3: Using VS Code Live Server
# Right-click on index.html and select "Open with Live Server"
```

Visit: `http://localhost:8000`

---

## 🎮 Try It Out

1. **Splash Page** - Wait 2 seconds or see auto-redirect
2. **Sign Up** - Create account with:
   - Email: `student@example.com`
   - Password: `password123`
3. **Dashboard** - See your greeting and empty state
4. **Add Task** - Create a task:
   - Type: Assignment
   - Name: Math Project
   - Deadline: Select a date 1 week from now
   - Difficulty: Medium
   - Hours: 5
5. **Add More Tasks** - Add 2-3 more tasks with different deadlines
6. **Generate Schedule** - Click "Generate My Schedule"
7. **View Schedule** - See your personalized study plan
8. **Export PDF** - Download your schedule
9. **Check Profile** - View statistics
10. **Check Reports** - See analytics

---

## 🔧 Configuration

### .env file (backend/.env)

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=            # Leave empty if no password
DB_NAME=studymate_db
DB_PORT=3306

# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_12345

# Files
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### API URL Configuration

If your backend is on a different server, update in `frontend/script.js`:

```javascript
const API_BASE_URL = 'http://your-server:5000/api';
```

---

## 📱 Pages Overview

| Page | Path | Purpose |
|------|------|---------|
| Splash | `/` | Welcome screen |
| Login | `/login.html` | Sign in |
| Sign Up | `/signup.html` | Register |
| Dashboard | `/dashboard.html` | Home page |
| Add Task | `/addtask.html` | Create tasks |
| Schedule | `/schedule.html` | View schedule |
| Profile | `/profile.html` | User profile |
| Reports | `/reports.html` | Statistics |

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| "Cannot connect to database" | Check MySQL is running, verify .env credentials |
| "CORS error" | Ensure backend port is 5000 |
| "Page shows nothing" | Check browser console for errors, verify API_BASE_URL |
| "Login doesn't work" | Check if user exists, verify password is correct |
| "File upload fails" | Check uploads folder exists and has write permissions |

---

## 📚 API Quick Reference

```bash
# Sign Up
POST http://localhost:5000/api/auth/signup
Body: { email, password, confirmPassword, fullName }

# Login
POST http://localhost:5000/api/auth/login
Body: { email, password }

# Add Task
POST http://localhost:5000/api/tasks/add
Header: Authorization: Bearer {token}
Body: FormData with all task fields

# Get All Tasks
GET http://localhost:5000/api/tasks/all
Header: Authorization: Bearer {token}

# Generate Schedule
POST http://localhost:5000/api/schedule/generate
Header: Authorization: Bearer {token}

# Export PDF
GET http://localhost:5000/api/schedule/export-pdf
Header: Authorization: Bearer {token}
```

---

## 🎯 Next Steps

1. ✅ Complete the quick start
2. ✅ Explore all pages
3. ✅ Test adding multiple tasks
4. ✅ Try schedule generation
5. ✅ Export PDF
6. ✅ Check reports page

## 📖 Full Documentation

See `README.md` for complete documentation, feature list, and architecture details.

---

**You're all set! Happy studying! 🎓✨**
