const db = require('../config/db');

exports.createTask = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const { task_name, task_type, task_details, difficulty, deadline, estimated_hours, daily_min_hours } = req.body;
    const file_path = req.file ? req.file.filename : null;
    const [result] = await db.query(
      'INSERT INTO tasks (user_id, task_name, task_type, task_details, file_path, difficulty, deadline, estimated_hours, daily_min_hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.session.userId, task_name, task_type, task_details, file_path, difficulty, deadline, estimated_hours, daily_min_hours]
    );
    // Add notification for upcoming deadline
    if (deadline) {
      await db.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [
        req.session.userId,
        `Task "${task_name}" has been added with deadline ${deadline}.`
      ]);
    }
    res.json({ success: true, taskId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [req.session.userId]);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const { id } = req.params;
    const { is_completed } = req.body;
    await db.query('UPDATE tasks SET is_completed = ? WHERE id = ? AND user_id = ?', [is_completed, id, req.session.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTaskCount = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const [rows] = await db.query('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?', [req.session.userId]);
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
