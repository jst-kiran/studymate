const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
    const userId = result.insertId;
    req.session.userId = userId;
    req.session.userName = name;
    // Add welcome notification
    await db.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [userId, `Welcome to StudyMate, ${name}! Start by adding your first study task.`]);
    res.json({ success: true, userId, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'All fields required' });
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    req.session.userId = user.id;
    req.session.userName = user.name;
    res.json({ success: true, userId: user.id, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ success: true });
};

exports.me = (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ userId: req.session.userId, name: req.session.userName });
};
