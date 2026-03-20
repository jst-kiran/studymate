const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/auth');

// All schedule routes require authentication
router.use(authMiddleware);

// Schedule routes
router.post('/generate', scheduleController.generateSchedule);
router.get('/view', scheduleController.getSchedule);
router.get('/export-pdf', scheduleController.exportSchedulePDF);

module.exports = router;
