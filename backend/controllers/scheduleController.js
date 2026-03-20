const db = require('../config/db');

function generateDummySchedule(tasks) {
  const schedule = [];
  const today = new Date();
  
  tasks.forEach((task, taskIndex) => {
    const daysNeeded = Math.ceil((task.estimated_hours || 2) / (task.daily_min_hours || 1));
    const topicsList = task.task_details 
      ? task.task_details.split('\n').filter(t => t.trim()) 
      : ['Main Study Session', 'Review & Practice', 'Problem Solving'];
    
    for (let d = 0; d < Math.min(daysNeeded, 7); d++) {
      const schedDate = new Date(today);
      schedDate.offset = taskIndex * 3;
      schedDate.setDate(today.getDate() + taskIndex * 2 + d);
      const dateStr = schedDate.toISOString().split('T')[0];
      const topic = topicsList[d % topicsList.length] || 'Study Session';
      const hours = task.daily_min_hours || 1.5;
      schedule.push({ task_id: task.id, task_name: task.task_name, schedule_date: dateStr, topic, hours });
    }
  });
  
  return schedule;
}

exports.generateSchedule = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ? AND is_completed = 0', [req.session.userId]);
    if (tasks.length < 3) return res.status(400).json({ error: 'Please add at least 3 tasks first' });
    
    // Clear existing schedule
    await db.query('DELETE FROM schedules WHERE user_id = ?', [req.session.userId]);
    
    const schedule = generateDummySchedule(tasks);
    for (const item of schedule) {
      await db.query(
        'INSERT INTO schedules (user_id, task_id, schedule_date, topic, hours) VALUES (?, ?, ?, ?, ?)',
        [req.session.userId, item.task_id, item.schedule_date, item.topic, item.hours]
      );
    }
    
    await db.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [
      req.session.userId, 'Your study schedule has been generated successfully!'
    ]);
    
    res.json({ success: true, schedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const [rows] = await db.query(
      `SELECT s.*, t.task_name, t.task_type, t.difficulty FROM schedules s 
       LEFT JOIN tasks t ON s.task_id = t.id 
       WHERE s.user_id = ? ORDER BY s.schedule_date ASC`,
      [req.session.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.regenerateSchedule = async (req, res) => {
  return exports.generateSchedule(req, res);
};
