// StudyMate - Frontend JavaScript
// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// ==================== UTILITY FUNCTIONS ====================
function showLoading(show = true, text = 'Loading...') {
    const spinner = document.getElementById('loadingSpinner');
    const loadingText = document.getElementById('loadingText');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
        if (loadingText) loadingText.textContent = text;
    }
}

function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    const firstSection = document.querySelector('.section') || document.querySelector('.auth-card');
    if (firstSection) {
        firstSection.parentElement.insertBefore(messageDiv, firstSection);
        setTimeout(() => messageDiv.remove(), 4000);
    }
}

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

function getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo') || '{}');
}

function setUserInfo(userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

function checkAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
    }
}

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

// ==================== AUTHENTICATION ====================
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!email) {
        showMessage('Please enter your email address', 'error');
        return;
    }

    if (!password) {
        showMessage('Please enter your password', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    showLoading(true, 'Logging in...');

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            setToken(data.token);
            setUserInfo(data.user);
            showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(data.message || 'Login failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        if (error.message.includes('Failed to fetch')) {
            showMessage('Cannot connect to server. Make sure backend is running on http://localhost:5000', 'error');
        } else {
            showMessage('Error: ' + error.message, 'error');
        }
    } finally {
        showLoading(false);
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Email validation
    if (!email) {
        showMessage('Please enter your email address', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    // Password validation
    if (!password) {
        showMessage('Please enter a password', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }

    if (!confirmPassword) {
        showMessage('Please confirm your password', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    showLoading(true, 'Creating account...');

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, confirmPassword, fullName })
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            setToken(data.token);
            setUserInfo(data.user);
            showMessage('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(data.message || 'Signup failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        if (error.message.includes('Failed to fetch')) {
            showMessage('Cannot connect to server. Make sure backend is running on http://localhost:5000', 'error');
        } else {
            showMessage('Error: ' + error.message, 'error');
        }
    } finally {
        showLoading(false);
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        removeToken();
        localStorage.removeItem('userInfo');
        window.location.href = 'login.html';
    }
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    checkAuth();
    
    const userInfo = getUserInfo();
    const firstName = userInfo.fullName?.split(' ')[0] || 'User';
    document.getElementById('greetingText').textContent = `Hi ${firstName} 👋`;

    // Update date
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById('dateText').textContent = `${dayName}, ${today.toLocaleDateString()}`;

    showLoading(true);

    try {
        // Load today's tasks
        const tasksResponse = await fetch(`${API_BASE_URL}/tasks/today`, {
            headers: getAuthHeaders()
        });
        const tasksData = await tasksResponse.json();

        if (tasksData.success) {
            document.getElementById('todayTasksCount').textContent = tasksData.tasks.length;
            displayTodayTasks(tasksData.tasks);
        }

        // Load upcoming deadlines
        const deadlinesResponse = await fetch(`${API_BASE_URL}/profile/upcoming-deadlines`, {
            headers: getAuthHeaders()
        });
        const deadlinesData = await deadlinesResponse.json();

        if (deadlinesData.success) {
            document.getElementById('upcomingCount').textContent = deadlinesData.upcomingDeadlines.length;
            displayUpcomingDeadlines(deadlinesData.upcomingDeadlines);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showMessage('Error loading dashboard data', 'error');
    } finally {
        showLoading(false);
    }
}

function displayTodayTasks(tasks) {
    const container = document.getElementById('todayTasksList');
    
    if (tasks.length === 0) {
        container.innerHTML = '<p class="empty-message">No tasks for today. Great job! 🎉</p>';
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div class="task-header">
                <span class="task-name">${task.task_name}</span>
                <span class="task-badge badge-${task.task_type.toLowerCase()}">
                    ${task.task_type}
                </span>
            </div>
            <div class="task-meta">
                <div class="task-deadline">
                    ⏰ ${new Date(task.deadline).toLocaleDateString()}
                </div>
                <div class="task-difficulty difficulty-${task.difficulty.toLowerCase()}">
                    ⚡ ${task.difficulty}
                </div>
            </div>
        </div>
    `).join('');
}

function displayUpcomingDeadlines(deadlines) {
    const container = document.getElementById('upcomingDeadlinesList');
    
    if (deadlines.length === 0) {
        container.innerHTML = '<p class="empty-message">No upcoming deadlines</p>';
        return;
    }

    container.innerHTML = deadlines.map(task => `
        <div class="deadline-item">
            <div class="task-header">
                <span class="task-name">${task.task_name}</span>
                <span class="task-badge badge-${task.task_type.toLowerCase()}">
                    ${task.task_type}
                </span>
            </div>
            <div class="task-meta">
                <div class="task-deadline">
                    📅 ${new Date(task.deadline).toLocaleDateString()}
                </div>
                <div class="task-difficulty difficulty-${task.difficulty.toLowerCase()}">
                    ${task.difficulty}
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== TASK MANAGEMENT ====================
async function handleAddTask(e) {
    e.preventDefault();

    const taskType = document.getElementById('taskType').value;
    const taskName = document.getElementById('taskName').value.trim();
    const deadline = document.getElementById('deadline').value;
    const difficulty = document.getElementById('difficulty').value;
    const estimatedHours = parseInt(document.getElementById('estimatedHours').value);
    const description = document.getElementById('description').value.trim();
    const file = document.getElementById('file').files[0];

    if (!taskType || !taskName || !deadline || !difficulty || !estimatedHours) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    showLoading(true, 'Adding task...');

    try {
        const formData = new FormData();
        formData.append('taskType', taskType);
        formData.append('taskName', taskName);
        formData.append('deadline', deadline);
        formData.append('difficulty', difficulty);
        formData.append('estimatedHours', estimatedHours);
        formData.append('description', description);
        if (file) formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/tasks/add`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Task added successfully!', 'success');
            document.getElementById('addTaskForm').reset();
            document.getElementById('fileName').textContent = 'No file chosen';
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage(data.message || 'Failed to add task', 'error');
        }
    } catch (error) {
        console.error('Add task error:', error);
        showMessage('Error adding task', 'error');
    } finally {
        showLoading(false);
    }
}

// ==================== SCHEDULE GENERATION ====================
async function generateSchedule() {
    if (!confirm('Generate a new study schedule from your current tasks?')) return;

    showLoading(true, 'Creating your personalized study schedule...');

    try {
        const response = await fetch(`${API_BASE_URL}/schedule/generate`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Schedule generated successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'schedule.html';
            }, 1500);
        } else {
            showMessage(data.message || 'Failed to generate schedule', 'error');
        }
    } catch (error) {
        console.error('Generate schedule error:', error);
        showMessage('Error generating schedule', 'error');
    } finally {
        showLoading(false);
    }
}

async function regenerateSchedule() {
    if (!confirm('Regenerate your study schedule?')) return;

    showLoading(true, 'Regenerating schedule...');

    try {
        const response = await fetch(`${API_BASE_URL}/schedule/generate`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (data.success) {
            loadSchedule();
            showMessage('Schedule regenerated successfully!', 'success');
        } else {
            showMessage(data.message || 'Failed to regenerate schedule', 'error');
        }
    } catch (error) {
        console.error('Regenerate schedule error:', error);
        showMessage('Error regenerating schedule', 'error');
    } finally {
        showLoading(false);
    }
}

async function loadSchedule() {
    checkAuth();
    showLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/schedule/view`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (data.success) {
            displaySchedule(data.schedule);
        } else {
            document.getElementById('scheduleContent').innerHTML = 
                '<p class="empty-message">No schedule yet. Add tasks and generate your schedule!</p>';
        }
    } catch (error) {
        console.error('Load schedule error:', error);
        showMessage('Error loading schedule', 'error');
    } finally {
        showLoading(false);
    }
}

function displaySchedule(schedule) {
    const container = document.getElementById('scheduleContent');
    
    if (Object.keys(schedule).length === 0) {
        container.innerHTML = '<p class="empty-message">No schedule yet. Add tasks and generate your schedule!</p>';
        return;
    }

    let html = '';
    const sortedDates = Object.keys(schedule).sort();

    sortedDates.forEach(date => {
        const dateObj = new Date(date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = dateObj.toLocaleDateString();

        html += `
            <div class="schedule-day">
                <div class="day-header">${dayName} - ${dateStr}</div>
        `;

        schedule[date].forEach(item => {
            html += `
                <div class="schedule-item">
                    <div class="schedule-item-title">${item.taskName} <span class="task-badge badge-${item.taskType.toLowerCase()}">${item.taskType}</span></div>
                    <div class="schedule-item-plan">📚 ${item.plan}</div>
                    <div class="schedule-item-hours">⏱️ ${item.hours} hours</div>
                </div>
            `;
        });

        html += '</div>';
    });

    container.innerHTML = html;
}

async function exportSchedulePDF() {
    try {
        showLoading(true, 'Exporting schedule as PDF...');
        
        const response = await fetch(`${API_BASE_URL}/schedule/export-pdf`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to export PDF');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'study-schedule.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showMessage('Schedule exported successfully!', 'success');
    } catch (error) {
        console.error('Export PDF error:', error);
        showMessage('Error exporting schedule', 'error');
    } finally {
        showLoading(false);
    }
}

// ==================== PROFILE ====================
async function loadProfile() {
    checkAuth();
    showLoading(true);

    try {
        // Load user info
        const userResponse = await fetch(`${API_BASE_URL}/profile/info`, {
            headers: getAuthHeaders()
        });
        const userData = await userResponse.json();

        if (userData.success) {
            document.getElementById('userName').textContent = userData.user.full_name || '-';
            document.getElementById('userEmail').textContent = userData.user.email;
            document.getElementById('joinDate').textContent = 
                new Date(userData.user.created_at).toLocaleDateString();
        }

        // Load tasks summary
        const summaryResponse = await fetch(`${API_BASE_URL}/profile/tasks-summary`, {
            headers: getAuthHeaders()
        });
        const summaryData = await summaryResponse.json();

        if (summaryData.success) {
            updateTaskStats(summaryData.summary);
        }

        // Load upcoming deadlines
        const deadlinesResponse = await fetch(`${API_BASE_URL}/profile/upcoming-deadlines`, {
            headers: getAuthHeaders()
        });
        const deadlinesData = await deadlinesResponse.json();

        if (deadlinesData.success) {
            displayProfileDeadlines(deadlinesData.upcomingDeadlines);
        }

        // Load all tasks
        const tasksResponse = await fetch(`${API_BASE_URL}/tasks/all`, {
            headers: getAuthHeaders()
        });
        const tasksData = await tasksResponse.json();

        if (tasksData.success) {
            displayProfileTasks(tasksData.tasks);
        }
    } catch (error) {
        console.error('Load profile error:', error);
        showMessage('Error loading profile', 'error');
    } finally {
        showLoading(false);
    }
}

function updateTaskStats(summary) {
    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;

    summary.forEach(item => {
        totalTasks += item.count;
        if (item.status === 'Completed') completedTasks += item.count;
        else if (item.status === 'Pending') pendingTasks += item.count;
    });

    document.getElementById('totalTasksCount').textContent = totalTasks;
    document.getElementById('completedTasksCount').textContent = completedTasks;
    document.getElementById('pendingTasksCount').textContent = pendingTasks;
}

function displayProfileDeadlines(deadlines) {
    const container = document.getElementById('upcomingDeadlinesList');
    
    if (deadlines.length === 0) {
        container.innerHTML = '<p class="empty-message">No upcoming deadlines</p>';
        return;
    }

    container.innerHTML = deadlines.map(task => `
        <div class="deadline-item">
            <div class="task-header">
                <span class="task-name">${task.task_name}</span>
                <span class="task-badge badge-${task.task_type.toLowerCase()}">
                    ${task.task_type}
                </span>
            </div>
            <div class="task-meta">
                <div class="task-deadline">
                    📅 ${new Date(task.deadline).toLocaleDateString()}
                </div>
                <div class="task-difficulty difficulty-${task.difficulty.toLowerCase()}">
                    ${task.difficulty}
                </div>
            </div>
        </div>
    `).join('');
}

function displayProfileTasks(tasks) {
    const container = document.getElementById('allTasksList');
    
    if (tasks.length === 0) {
        container.innerHTML = '<p class="empty-message">No tasks yet. Start by adding a new task!</p>';
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div class="task-header">
                <span class="task-name">${task.task_name}</span>
                <span class="task-badge badge-${task.task_type.toLowerCase()}">
                    ${task.task_type}
                </span>
            </div>
            <div class="task-meta">
                <div class="task-deadline">
                    📅 ${new Date(task.deadline).toLocaleDateString()}
                </div>
                <div class="task-difficulty difficulty-${task.difficulty.toLowerCase()}">
                    ${task.difficulty}
                </div>
                <div style="color: var(--gray-dark); font-size: 12px;">
                    ${task.estimated_hours}h
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== REPORTS ====================
async function loadReports() {
    checkAuth();
    showLoading(true);

    try {
        const tasksResponse = await fetch(`${API_BASE_URL}/tasks/all`, {
            headers: getAuthHeaders()
        });
        const tasksData = await tasksResponse.json();

        if (tasksData.success) {
            const tasks = tasksData.tasks;
            
            // Calculate stats
            const total = tasks.length;
            const completed = tasks.filter(t => t.status === 'Completed').length;
            const assignments = tasks.filter(t => t.task_type === 'Assignment').length;
            const exams = tasks.filter(t => t.task_type === 'Exam').length;

            document.getElementById('totalTasksReport').textContent = total;
            document.getElementById('completedTasksReport').textContent = completed;
            document.getElementById('assignmentsCount').textContent = assignments;
            document.getElementById('examsCount').textContent = exams;

            // Task distribution
            displayTaskDistribution(tasks);
            
            // Difficulty breakdown
            displayDifficultyBreakdown(tasks);
            
            // Recent tasks
            displayRecentTasks(tasks.slice(0, 5));
        }
    } catch (error) {
        console.error('Load reports error:', error);
        showMessage('Error loading reports', 'error');
    } finally {
        showLoading(false);
    }
}

function displayTaskDistribution(tasks) {
    const distribution = {
        'Assignment': 0,
        'Exam': 0,
        'Study': 0
    };

    tasks.forEach(task => {
        if (distribution[task.task_type] !== undefined) {
            distribution[task.task_type]++;
        }
    });

    const container = document.getElementById('taskDistribution');
    let html = '';
    
    Object.entries(distribution).forEach(([type, count]) => {
        html += `
            <div class="distribution-item">
                <span class="distribution-label">${type}</span>
                <span class="distribution-count">${count}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

function displayDifficultyBreakdown(tasks) {
    const breakdown = {
        'Easy': 0,
        'Medium': 0,
        'Hard': 0
    };

    tasks.forEach(task => {
        if (breakdown[task.difficulty] !== undefined) {
            breakdown[task.difficulty]++;
        }
    });

    const container = document.getElementById('difficultyBreakdown');
    let html = '';
    
    Object.entries(breakdown).forEach(([level, count]) => {
        html += `
            <div class="breakdown-item">
                <span class="breakdown-label">${level}</span>
                <span class="breakdown-count">${count}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

function displayRecentTasks(tasks) {
    const container = document.getElementById('recentTasksList');
    
    if (tasks.length === 0) {
        container.innerHTML = '<p class="empty-message">No tasks yet</p>';
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div class="task-header">
                <span class="task-name">${task.task_name}</span>
                <span class="task-badge badge-${task.task_type.toLowerCase()}">
                    ${task.task_type}
                </span>
            </div>
            <div class="task-meta">
                <div class="task-deadline">
                    📅 ${new Date(task.deadline).toLocaleDateString()}
                </div>
                <div class="task-difficulty difficulty-${task.difficulty.toLowerCase()}">
                    ${task.difficulty}
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // CORS handling for modern browsers
    if (!window.location.href.includes('login.html') && 
        !window.location.href.includes('signup.html') &&
        !window.location.href.includes('index.html')) {
        checkAuth();
    }
});
