const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

// All task routes require authentication
router.use(authMiddleware);

// Task routes
router.post('/add', taskController.upload.single('file'), taskController.addTask);
router.get('/all', taskController.getTasks);
router.get('/today', taskController.getTodayTasks);
router.get('/:taskId', taskController.getTaskById);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
