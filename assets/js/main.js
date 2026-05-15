/**
 * Evntra - Main Application JavaScript
 * Handles routing, navigation, and core functionality
 */

// Simple routing system
const Router = {
    routes: {},
    currentPage: 'landing',

    register: (path, handler) => {
        Router.routes[path] = handler;
    },

    navigate: (path) => {
        if (Router.routes[path]) {
            Router.currentPage = path;
            Router.routes[path]();
            window.history.pushState({ page: path }, '', `?page=${path}`);
        }
    },

    init: () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') || 'landing';
        Router.navigate(page);
    }
};

// Global navigation function
window.navigateTo = (page) => {
    Router.navigate(page);
};

// =====================================================
// INITIALIZATION & EVENT LISTENERS
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupEventListeners();
    checkAuthStatus();
});

/**
 * Setup navigation
 */
function setupNavigation() {
    document.addEventListener('click', function(event) {
        if (event.target.classList && event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Notification toggle
    const notifToggle = document.querySelector('[data-notification-toggle]');
    const notifPanel = document.querySelector('[data-notification-panel]');
    
    if (notifToggle && notifPanel) {
        notifToggle.addEventListener('click', () => {
            notifPanel.classList.toggle('open');
        });
    }

    // Modal handlers
    document.querySelectorAll('[data-open-modal]').forEach((button) => {
        button.addEventListener('click', () => {
            const target = document.querySelector(button.getAttribute('data-open-modal'));
            if (target) target.classList.add('open');
        });
    });

    document.querySelectorAll('[data-close-modal]').forEach((button) => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) modal.classList.remove('open');
        });
    });
}

/**
 * Check authentication status and update navbar
 */
function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    const navLinks = navbar.querySelector('.nav-links');
    if (!navLinks) return;

    if (user && token) {
        const userRole = user.role || 'student';
        navLinks.innerHTML = `
            <li><a href="#" class="nav-link" onclick="navigateTo('${userRole}-dashboard')">Dashboard</a></li>
            <li><a href="#" class="nav-link" onclick="navigateTo('browse')">Browse</a></li>
            <li><a href="#" class="nav-link" onclick="logout()">Logout</a></li>
        `;
    } else {
        navLinks.innerHTML = `
            <li><a href="#" class="nav-link" onclick="navigateTo('browse')">Browse</a></li>
            <li><a href="#" class="nav-link" onclick="navigateTo('login')">Login</a></li>
            <li><a href="#" class="nav-link" onclick="navigateTo('register')">Sign Up</a></li>
        `;
    }
}

/**
 * Logout user
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    }
}

// =====================================================
// REGISTRATION & LOGIN ROUTES
// =====================================================

Router.register('login', function() {
    document.body.innerHTML = `
        <nav class="navbar">
            <div class="container">
                <div class="navbar-brand">
                    <h1 class="logo">Evntra</h1>
                </div>
                <ul class="nav-links">
                    <li><a href="#" class="nav-link" onclick="navigateTo('browse')">Browse</a></li>
                    <li><a href="#" class="nav-link" onclick="navigateTo('register')">Sign Up</a></li>
                </ul>
            </div>
        </nav>

        <div class="container" style="max-width: 500px; margin-top: 60px; margin-bottom: 60px;">
            <div class="card">
                <div class="card-header">
                    <h2>Login to Evntra</h2>
                </div>
                <form class="card-body" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Login</button>
                    <p style="text-align: center; margin-top: 20px;">
                        Don't have an account? <a href="#" onclick="navigateTo('register')">Sign up</a>
                    </p>
                </form>
            </div>
        </div>

        <footer class="footer">
            <div class="container">
                <div class="footer-bottom">
                    <p>&copy; 2026 Evntra. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
    checkAuthStatus();
});

Router.register('register', function() {
    document.body.innerHTML = `
        <nav class="navbar">
            <div class="container">
                <div class="navbar-brand">
                    <h1 class="logo">Evntra</h1>
                </div>
                <ul class="nav-links">
                    <li><a href="#" class="nav-link" onclick="navigateTo('browse')">Browse</a></li>
                    <li><a href="#" class="nav-link" onclick="navigateTo('login')">Login</a></li>
                </ul>
            </div>
        </nav>

        <div class="container" style="max-width: 500px; margin-top: 60px; margin-bottom: 60px;">
            <div class="card">
                <div class="card-header">
                    <h2>Create Account</h2>
                </div>
                <form class="card-body" onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div class="form-group">
                        <label for="role">I am a:</label>
                        <select id="role" name="role" required>
                            <option value="">Select...</option>
                            <option value="student">Student / Participant</option>
                            <option value="organizer">Organizer</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Sign Up</button>
                    <p style="text-align: center; margin-top: 20px;">
                        Already have an account? <a href="#" onclick="navigateTo('login')">Login</a>
                    </p>
                </form>
            </div>
        </div>

        <footer class="footer">
            <div class="container">
                <div class="footer-bottom">
                    <p>&copy; 2026 Evntra. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
    checkAuthStatus();
});

/**
 * Handle login submission
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            const role = data.user.role || 'student';
            window.location.href = `/?page=${role}-dashboard`;
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again.');
    }
}

/**
 * Handle registration submission
 */
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('/api/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            window.location.href = `/?page=${role}-dashboard`;
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred. Please try again.');
    }
}

// =====================================================
// BROWSE COMPETITIONS ROUTE
// =====================================================

Router.register('browse', function() {
    document.body.innerHTML = `
        <nav class="navbar">
            <div class="container">
                <div class="navbar-brand">
                    <h1 class="logo">Evntra</h1>
                </div>
                <ul class="nav-links"></ul>
            </div>
        </nav>

        <div class="container" style="margin-top: 40px; margin-bottom: 40px;">
            <h1 style="margin-bottom: 30px;">Browse Competitions</h1>
            <div id="competitionsList" class="grid grid-3"></div>
        </div>

        <footer class="footer">
            <div class="container">
                <div class="footer-bottom">
                    <p>&copy; 2026 Evntra. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
    checkAuthStatus();
    loadCompetitions();
});

/**
 * Load competitions from API
 */
async function loadCompetitions() {
    try {
        const response = await fetch('/api/competitions.php');
        const data = await response.json();
        
        const list = document.getElementById('competitionsList');
        if (!list) return;

        if (data.competitions && data.competitions.length > 0) {
            list.innerHTML = data.competitions.map(comp => `
                <div class="card">
                    <div style="padding: 20px; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white;">
                        <h3 style="margin: 0; color: white;">${comp.title || 'Competition'}</h3>
                    </div>
                    <div class="card-body">
                        <p style="color: #95a5a6; margin: 0 0 10px 0;">${comp.category || 'General'}</p>
                        <p style="margin: 0 0 20px 0; color: #7f8c8d;">${comp.description || 'No description'}</p>
                        <button class="btn btn-primary btn-block" onclick="alert('Feature coming soon')">View Details</button>
                    </div>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #95a5a6;">No competitions found</p>';
        }
    } catch (error) {
        console.error('Error loading competitions:', error);
    }
}

// =====================================================
// DASHBOARD ROUTES
// =====================================================

Router.register('student-dashboard', function() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        Router.navigate('login');
        return;
    }

    document.body.innerHTML = `
        <nav class="navbar">
            <div class="container">
                <div class="navbar-brand">
                    <h1 class="logo">Evntra</h1>
                </div>
                <ul class="nav-links"></ul>
            </div>
        </nav>

        <div class="container" style="margin-top: 40px; margin-bottom: 60px;">
            <h1 style="margin-bottom: 30px;">Welcome, ${user.name}!</h1>
            
            <div class="grid grid-3" style="margin-bottom: 40px;">
                <div class="card">
                    <div class="card-body">
                        <h3 style="color: #3498db; margin: 0 0 15px 0;">My Registrations</h3>
                        <p style="font-size: 2.5rem; font-weight: bold; color: #2c3e50; margin: 0;">0</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h3 style="color: #2ecc71; margin: 0 0 15px 0;">Bookmarks</h3>
                        <p style="font-size: 2.5rem; font-weight: bold; color: #2c3e50; margin: 0;">0</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h3 style="color: #f39c12; margin: 0 0 15px 0;">Upcoming</h3>
                        <p style="font-size: 2.5rem; font-weight: bold; color: #2c3e50; margin: 0;">0</p>
                    </div>
                </div>
            </div>

            <h2 style="margin-bottom: 20px;">Actions</h2>
            <div class="grid grid-2">
                <a href="#" onclick="navigateTo('browse')" class="btn btn-primary">Browse Competitions</a>
                <a href="#" onclick="alert('Feature coming soon')" class="btn btn-secondary">My Registrations</a>
            </div>
        </div>

        <footer class="footer">
            <div class="container">
                <div class="footer-bottom">
                    <p>&copy; 2026 Evntra. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
    checkAuthStatus();
});

Router.register('organizer-dashboard', function() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        Router.navigate('login');
        return;
    }

    document.body.innerHTML = `
        <nav class="navbar">
            <div class="container">
                <div class="navbar-brand">
                    <h1 class="logo">Evntra</h1>
                </div>
                <ul class="nav-links"></ul>
            </div>
        </nav>

        <div class="container" style="margin-top: 40px; margin-bottom: 60px;">
            <h1 style="margin-bottom: 30px;">Organizer Dashboard</h1>
            
            <div class="grid grid-3" style="margin-bottom: 40px;">
                <div class="card">
                    <div class="card-body">
                        <h3 style="color: #3498db; margin: 0 0 15px 0;">My Competitions</h3>
                        <p style="font-size: 2.5rem; font-weight: bold; color: #2c3e50; margin: 0;">0</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h3 style="color: #2ecc71; margin: 0 0 15px 0;">Total Participants</h3>
                        <p style="font-size: 2.5rem; font-weight: bold; color: #2c3e50; margin: 0;">0</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h3 style="color: #f39c12; margin: 0 0 15px 0;">Active</h3>
                        <p style="font-size: 2.5rem; font-weight: bold; color: #2c3e50; margin: 0;">0</p>
                    </div>
                </div>
            </div>

            <h2 style="margin-bottom: 20px;">Actions</h2>
            <div class="grid grid-2">
                <a href="#" onclick="alert('Feature coming soon')" class="btn btn-primary">Create Competition</a>
                <a href="#" onclick="alert('Feature coming soon')" class="btn btn-secondary">My Competitions</a>
            </div>
        </div>

        <footer class="footer">
            <div class="container">
                <div class="footer-bottom">
                    <p>&copy; 2026 Evntra. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
    checkAuthStatus();
});

Router.register('admin-dashboard', function() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        Router.navigate('login');
        return;
    }

    document.body.innerHTML = `
        <nav class="navbar">
            <div class="container">
                <div class="navbar-brand">
                    <h1 class="logo">Evntra</h1>
                </div>
                <ul class="nav-links"></ul>
            </div>
        </nav>

        <div class="container" style="margin-top: 40px; margin-bottom: 60px;">
            <h1 style="margin-bottom: 30px;">Admin Dashboard</h1>
            
            <div class="grid grid-3" style="margin-bottom: 40px;">
                <div class="card">
                    <div class="card-body">
                        <h3 style="color: #3498db; margin: 0 0 15px 0;">Total Users</h3>
                        <p style="font-size: 2.5rem; font-weight: bold; color: #2c3e50; margin: 0;">0</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h3 style="color: #2ecc71; margin: 0 0 15px 0;">Competitions</h3>
                        <p style="font-size: 2.5rem; font-weight: bold; color: #2c3e50; margin: 0;">0</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h3 style="color: #f39c12; margin: 0 0 15px 0;">Pending Approvals</h3>
                        <p style="font-size: 2.5rem; font-weight: bold; color: #2c3e50; margin: 0;">0</p>
                    </div>
                </div>
            </div>

            <h2 style="margin-bottom: 20px;">Actions</h2>
            <div class="grid grid-2">
                <a href="#" onclick="alert('Feature coming soon')" class="btn btn-primary">Manage Users</a>
                <a href="#" onclick="alert('Feature coming soon')" class="btn btn-secondary">Approve Competitions</a>
            </div>
        </div>

        <footer class="footer">
            <div class="container">
                <div class="footer-bottom">
                    <p>&copy; 2026 Evntra. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
    checkAuthStatus();
});

// Default route
Router.register('landing', function() {
    location.reload();
});

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Router.init);
} else {
    Router.init();
}
