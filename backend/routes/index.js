const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const tasks = require('../controllers/taskController');
const schedule = require('../controllers/scheduleController');
const other = require('../controllers/otherController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Auth
router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.get('/me', auth.me);

// Tasks
router.post('/tasks', upload.single('file'), tasks.createTask);
router.get('/tasks', tasks.getTasks);
router.patch('/tasks/:id', tasks.updateTask);
router.get('/tasks/count', tasks.getTaskCount);

// Schedule
router.post('/generate-schedule', schedule.generateSchedule);
router.get('/schedule', schedule.getSchedule);
router.post('/regenerate', schedule.regenerateSchedule);

// Notifications
router.get('/notifications', other.getNotifications);
router.post('/notifications/read', other.markRead);

// Profile
router.get('/profile', other.getProfile);

module.exports = router;
