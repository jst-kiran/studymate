const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

// All profile routes require authentication
router.use(authMiddleware);

// Profile routes
router.get('/info', profileController.getProfileInfo);
router.get('/tasks-summary', profileController.getTasksSummary);
router.get('/upcoming-deadlines', profileController.getUpcomingDeadlines);
router.put('/update', profileController.updateProfile);

module.exports = router;
