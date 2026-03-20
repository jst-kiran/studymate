const db = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [req.session.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.markRead = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    await db.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.session.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
    const [users] = await db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.session.userId]);
    const [taskStats] = await db.query(
      'SELECT COUNT(*) as total, SUM(is_completed) as completed FROM tasks WHERE user_id = ?',
      [req.session.userId]
    );
    res.json({ ...users[0], ...taskStats[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
