# StudyMate - Quick Reference Card

## System Overview

```
Frontend (HTML/CSS/JavaScript)
         ↓ (HTTP Requests)
Backend (Node.js/Express) → MySQL Database
         ↑ (JSON Responses)
```

## Configuration Summary

| Component | Status | Config |
|-----------|--------|--------|
| **Frontend** | ✅ Ready | `http://localhost:5000` |
| **Backend** | ✅ Ready | `localhost:5000` port |
| **Database** | ⚠️ Needs setup | `studymate_db` on MySQL |
| **Auth** | ✅ Fixed | Email/Password with JWT |

## Quick Commands

### Database Setup (One-Time)
```bash
# 1. Open MySQL Workbench/Command Line
# 2. Run:
mysql -u root -p1234 < database\studymate.sql

# Or paste database/studymate.sql content into MySQL GUI
```

### Start Backend
```bash
cd backend
npm install      # First time only
npm start        # Should show: Server running on port 5000
```

### Access Frontend
```
Browser: http://localhost:5000
```

## Validation Rules (Updated ✅)

### Signup Form
| Field | Rules | Error Message |
|-------|-------|---------------|
| Email | Required, Valid format | "Please enter your email address" / "Please enter a valid email address" |
| Password | Min 6 chars | "Password must be at least 6 characters" |
| Confirm Password | Must match | "Passwords do not match" |
| Full Name | Any text | Auto-validated |

### Login Form
| Field | Rules | Error Message |
|-------|-------|---------------|
| Email | Required, Valid format | "Please enter your email address" / "Please enter a valid email address" |
| Password | Required | "Please enter your password" |

### Server Connection
| Issue | Message | Solution |
|-------|---------|----------|
| Backend offline | "Cannot connect to server. Make sure backend is running on http://localhost:5000" | Run `npm start` from backend folder |
| Invalid data | Specific validation error | Fix the input based on error message |
| Duplicate email | "Email already registered" | Use different email |

## Feature Status

| Feature | Status | Test Path |
|---------|--------|-----------|
| Signup | ✅ Fixed | Splash → Sign Up button |
| Login | ✅ Fixed | Splash → Log In button |
| Dashboard | ✅ Ready | After login |
| Add Task | ✅ Ready | Dashboard → Add Task |
| Schedule | ✅ Ready | Dashboard → Generate Schedule |
| PDF Export | ✅ Ready | Dashboard → Export as PDF |
| Task Status | ✅ Ready | Dashboard → Update status |

## Files Changed This Session

```
frontend/script.js
  ├── handleLogin() - IMPROVED validation & error messages
  └── handleSignup() - IMPROVED validation & error messages

NEW FILES:
  ├── TESTING_GUIDE.md - Complete testing instructions
  ├── FIX_SUMMARY.md - What was fixed and why
  └── backend/check-system.bat - System diagnostic script
```

## Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| "Cannot connect to server" | Backend not running - run `npm start` |
| "Email already registered" | Use different email or clear database |
| "Database connection error" | MySQL not running - start MySQL service |
| "Blank page at localhost:5000" | Backend not serving frontend - check npm start output |
| Form not submitting | Open browser console (F12) - check for JavaScript errors |

## Key Endpoints

### Auth Routes (Public)
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/verify-token
```

### Protected Routes
```
GET    /api/auth/user-info          (Requires JWT token)
GET    /api/tasks                   (Requires JWT token)
POST   /api/tasks                   (Requires JWT token)
PUT    /api/tasks/:id               (Requires JWT token)
DELETE /api/tasks/:id               (Requires JWT token)
```

## Test Accounts (After Signup)

Create your own account during signup testing:
- **Email**: any@email.com
- **Password**: min 6 characters
- **Confirm**: must match password

## Browser Console Errors

If you see errors, press F12 and check Console tab for:
- Network errors → Backend not running
- Validation errors → Check form input
- Database errors → Check MySQL connection

## Success Indicators ✅

### Backend Running
```
✅ Command line shows: "Server running on port 5000"
✅ Browser shows: StudyMate splash page at localhost:5000
✅ Network requests show responses in Browser DevTools
```

### Database Working
```
✅ Can create account → Data saved to users table
✅ Can login with created account → Password correctly hashed/verified
✅ User info shows in dashboard → Query working
```

### Forms Working
```
✅ Empty field shows specific error message
✅ Invalid email shows format error
✅ Password mismatch shows specific error
✅ Valid submission → Redirects to dashboard
```

## Next Steps After Login Works

1. ✅ Add a task (Dashboard → Add Task)
2. ✅ Generate schedule (Dashboard → Generate Schedule)
3. ✅ View schedule details
4. ✅ Export PDF (Dashboard → Export as PDF)
5. ✅ Update task status
6. ✅ Delete tasks
7. ✅ Check reports/notifications

## File Structure

```
StudyMate/
├── frontend/
│   ├── index.html (Splash page)
│   ├── login.html (Login form)
│   ├── signup.html (Signup form)
│   ├── dashboard.html (Main page)
│   ├── styles.css (All styling)
│   └── script.js (All logic) ← UPDATED
├── backend/
│   ├── server.js (Main server)
│   ├── .env (Configuration)
│   ├── controllers/ (Business logic)
│   ├── routes/ (API routes)
│   ├── middleware/ (JWT verification)
│   └── package.json (Dependencies)
├── database/
│   └── studymate.sql (Schema - needs to run)
├── TESTING_GUIDE.md (← READ THIS)
├── FIX_SUMMARY.md (← READ THIS)
└── README.md (Project overview)
```

## Performance Notes

- **JWT Tokens**: Expire in 7 days
- **Password Hash**: 10 salt rounds (secure)
- **Database**: Connection pooling (max 10 connections)
- **File Upload**: Max 5MB per file
- **Frontend**: Vanilla JS, no frameworks (fast loading)

## Environment Variables (backend/.env)

```
DB_HOST=localhost           # MySQL host
DB_USER=root               # MySQL user
DB_PASSWORD=1234           # MySQL password
DB_NAME=studymate_db       # Database name
DB_PORT=3306               # MySQL port
JWT_SECRET=your_secret...  # Change in production
PORT=5000                  # Backend port
NODE_ENV=development       # Development mode
UPLOAD_DIR=./uploads       # File upload location
MAX_FILE_SIZE=5242880      # 5MB max file
```

---

**Status**: All authentication validation has been fixed and improved. Ready for full system testing.
