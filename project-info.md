<!-- Project Structure & Configuration Reference -->

# StudyMate Project Structure

```
StudyMate/
│
├── frontend/                    # Frontend (HTML, CSS, JavaScript)
│   ├── index.html              # Splash page
│   ├── login.html              # Login page
│   ├── signup.html             # Sign up page
│   ├── dashboard.html          # Main dashboard
│   ├── addtask.html            # Add task form
│   ├── schedule.html           # View study schedule
│   ├── profile.html            # User profile
│   ├── reports.html            # Analytics & reports
│   ├── notifications.html      # Notifications
│   ├── styles.css              # All styling (mobile-responsive)
│   └── script.js               # All frontend JavaScript logic
│
├── backend/                     # Backend (Node.js/Express)
│   ├── server.js               # Main server file
│   ├── package.json            # Dependencies
│   ├── .env                    # Environment variables
│   │
│   ├── routes/                 # API routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── tasks.js           # Task management routes
│   │   ├── schedule.js        # Schedule routes
│   │   └── profile.js         # Profile routes
│   │
│   ├── controllers/            # Business logic
│   │   ├── authController.js  # Login, signup, auth logic
│   │   ├── taskController.js  # Task CRUD operations
│   │   ├── scheduleController.js # Schedule generation & PDF export
│   │   └── profileController.js  # Profile & stats logic
│   │
│   ├── middleware/             # Custom middleware
│   │   └── auth.js            # JWT token verification
│   │
│   └── uploads/               # Uploaded files (created on first upload)
│
├── database/                    # Database files
│   └── studymate.sql          # Database schema & initial queries
│
├── README.md                    # Full documentation
├── QUICK_START.md              # Quick start guide
└── project-info.md             # This file
```

---

## 🔄 Data Flow

### User Registration Flow
```
User Sign Up Form → Frontend validation → API POST /auth/signup
→ Backend validation → Hash password → Insert into DB → Generate JWT
→ Store token in localStorage → Redirect to Dashboard
```

### Task Creation Flow
```
Add Task Form → Frontend validation → API POST /tasks/add
→ Backend validation → Save to tasks table → Return success
→ Redirect or show message
```

### Schedule Generation Flow
```
User clicks "Generate Schedule" → API POST /schedule/generate
→ Backend fetches all tasks → Calculate study plan → Insert into schedules table
→ Return schedule data → Frontend displays by date
```

---

## 🛢️ Database Relationships

```
Users (1) ──── (Many) Tasks
   │
   │
   └──── (Many) Schedules
   
Tasks (1) ──── (Many) Schedules
```

---

## 📡 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* Relevant data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

---

## 🔐 Authentication Flow

```
1. User logs in with email/password
2. Backend validates and creates JWT token
3. Token stored in localStorage (client-side)
4. Every API request includes: Authorization: Bearer {token}
5. Backend verifies token on protected routes
6. Expired token → redirect to login
```

---

## 🎨 Frontend Architecture

### Key JavaScript Functions
- `handleLogin()` - Login form submission
- `handleSignup()` - Signup form submission
- `handleAddTask()` - Add task submission
- `generateSchedule()` - Generate schedule
- `loadDashboard()` - Load dashboard data
- `loadSchedule()` - Load schedule view
- `loadProfile()` - Load profile data
- `loadReports()` - Load analytics
- `logout()` - User logout

### Key CSS Classes
- `.btn` - Button styling
- `.card` - Card container
- `.section` - Content section
- `.task-item` - Task display
- `.schedule-day` - Schedule day view
- `.stats-grid` - Statistics grid
- `.bottom-nav` - Bottom navigation
- `.spinner` - Loading spinner

---

## ⚙️ Backend Architecture

### Server Setup
- Express.js middleware stack
- CORS enabled for frontend communication
- Static file serving for frontend
- Error handling middleware
- 404 route handler

### Database Connection
- MySQL2 connection pool
- Connection pooling for performance
- Parameterized queries (SQL injection safe)
- Error logging

### Authentication
- JWT token generation on login/signup
- Token verification middleware
- Token stored in Authorization header
- 7-day token expiration

---

## 📊 Study Schedule Algorithm

1. Get all pending tasks
2. For each task:
   - Calculate days until deadline
   - Distribute estimated hours across available days
   - Generate study plan based on task type
   - Create schedule entries in database
3. Return grouped schedule to frontend
4. Frontend displays grouped by date

---

## 🎯 Color System

### Primary Colors
- Primary Blue (#5B8DEE) - Main brand color
- Light Blue (#E8F0FE) - Backgrounds, borders
- Dark Blue (#2D3E5F) - Text, headings

### Status Colors
- Success Green (#4CAF50) - Completed, success
- Warning Orange (#FFA500) - Warnings, important
- Danger Red (#FF6B6B) - Errors, delete

### Neutral
- White (#FFFFFF) - Cards, backgrounds
- Gray Light (#F5F6F7) - Alternative backgrounds
- Gray Medium (#D1D5DB) - Borders, disabled
- Gray Dark (#6B7280) - Secondary text

---

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

All pages use CSS Grid and Flexbox for responsive design.

---

## 🔄 File Upload Configuration

- **Directory**: `./backend/uploads/`
- **Max Size**: 5MB
- **Allowed Types**: PDF, DOC, DOCX, TXT, PNG, JPG
- **Storage**: Disk-based (can be changed to cloud)

---

## 📦 Dependencies

### Frontend
- Vanilla JavaScript (no frameworks, but could use React)
- CSS3 with media queries
- LocalStorage API
- Fetch API

### Backend
- `express` - Web framework
- `mysql2` - Database driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `multer` - File uploads
- `pdfkit` - PDF generation
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

---

## 🔧 Configuration Files

### .env (Backend)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=studymate_db
DB_PORT=3306
JWT_SECRET=secret_key
PORT=5000
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### script.js (Frontend)
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 🧪 Testing Checklist

- [ ] Splash page auto-redirects
- [ ] Can sign up with new email
- [ ] Can login with credentials
- [ ] Dashboard loads user tasks
- [ ] Can add a task
- [ ] Can add multiple tasks
- [ ] Can generate schedule
- [ ] Schedule displays by date
- [ ] Can export schedule as PDF
- [ ] Profile shows correct info
- [ ] Reports show statistics
- [ ] Can logout
- [ ] Session persists on refresh (with token)
- [ ] File upload works
- [ ] Validation works (required fields)

---

## 🚀 Deployment Checklist

- [ ] Update JWT_SECRET in .env
- [ ] Set NODE_ENV=production
- [ ] Update database credentials
- [ ] Update API_BASE_URL in script.js
- [ ] Configure CORS for production domain
- [ ] Set up SSL/HTTPS
- [ ] Configure file upload directory
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Test all features on production

---

## 📝 Notes

- All passwords are hashed with bcryptjs (10 salt rounds)
- Tokens expire in 7 days
- File uploads are validated on server-side
- All API requests require authentication (except login/signup)
- Database uses foreign keys for data integrity
- Responsive design works on all modern browsers

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Status**: ✅ Complete & Ready for Use
