// Get Profile Info
exports.getProfileInfo = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const pool = req.app.locals.pool;
        const connection = await pool.getConnection();

        try {
            const [users] = await connection.execute(
                `SELECT id, email, full_name, created_at FROM users WHERE id = ?`,
                [userId]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                user: users[0]
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Get Tasks Summary
exports.getTasksSummary = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const pool = req.app.locals.pool;
        const connection = await pool.getConnection();

        try {
            const [tasks] = await connection.execute(
                `SELECT task_type, status, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY task_type, status`,
                [userId]
            );

            res.json({
                success: true,
                summary: tasks
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks summary',
            error: error.message
        });
    }
};

// Get Upcoming Deadlines
exports.getUpcomingDeadlines = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const pool = req.app.locals.pool;
        const connection = await pool.getConnection();

        try {
            const [tasks] = await connection.execute(
                `SELECT id, task_name, task_type, deadline, difficulty FROM tasks 
                 WHERE user_id = ? AND status != 'Completed' AND deadline >= CURDATE()
                 ORDER BY deadline ASC LIMIT 10`,
                [userId]
            );

            res.json({
                success: true,
                upcomingDeadlines: tasks
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming deadlines',
            error: error.message
        });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { fullName } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const pool = req.app.locals.pool;
        const connection = await pool.getConnection();

        try {
            await connection.execute(
                `UPDATE users SET full_name = ? WHERE id = ?`,
                [fullName, userId]
            );

            res.json({
                success: true,
                message: 'Profile updated successfully'
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};
