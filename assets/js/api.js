/**
 * Evntra API Integration Layer
 * Handles all API communication with PHP backend
 */

const API = {
    BASE_URL: '/api',
    
    /**
     * Make a generic API request
     */
    async request(endpoint, method = 'GET', data = null, headers = {}) {
        try {
            const url = `${this.BASE_URL}/${endpoint}`;
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...headers
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `HTTP Error: ${response.status}`);
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Authentication Endpoints
     */
    auth: {
        login: (email, password) => API.request('register.php', 'POST', { action: 'login', email, password }),
        register: (data) => API.request('register.php', 'POST', { action: 'register', ...data }),
        logout: () => API.request('logout', 'POST'),
        getCurrentUser: () => API.request('auth/current-user', 'GET'),
        forgotPassword: (email) => API.request('auth/forgot-password', 'POST', { email }),
        resetPassword: (token, password) => API.request('auth/reset-password', 'POST', { token, password }),
    },

    /**
     * Competition Endpoints
     */
    competitions: {
        getAll: (filters = {}) => API.request('competitions.php', 'GET'),
        getById: (id) => API.request(`competitions.php?id=${id}`, 'GET'),
        create: (data) => API.request('competitions.php', 'POST', { action: 'create', ...data }),
        update: (id, data) => API.request(`competitions.php?id=${id}`, 'PUT', data),
        delete: (id) => API.request(`competitions.php?id=${id}`, 'DELETE'),
        search: (query) => API.request(`competitions.php?search=${query}`, 'GET'),
        filter: (category, difficulty) => API.request(`competitions.php?category=${category}&difficulty=${difficulty}`, 'GET'),
    },

    /**
     * Registration Endpoints
     */
    registrations: {
        register: (competitionId) => API.request('register.php', 'POST', { competition_id: competitionId }),
        unregister: (registrationId) => API.request(`register.php?id=${registrationId}`, 'DELETE'),
        getMyRegistrations: () => API.request('register.php', 'GET'),
        getParticipants: (competitionId) => API.request(`register.php?competition=${competitionId}`, 'GET'),
    },

    /**
     * Bookmark Endpoints
     */
    bookmarks: {
        add: (competitionId) => API.request('bookmark.php', 'POST', { competition_id: competitionId }),
        remove: (bookmarkId) => API.request(`bookmark.php?id=${bookmarkId}`, 'DELETE'),
        getAll: () => API.request('bookmark.php', 'GET'),
    },

    /**
     * Conflict Check Endpoints
     */
    conflicts: {
        check: (competitionId) => API.request('check-conflict.php', 'POST', { competition_id: competitionId }),
    },

    /**
     * Notification Endpoints
     */
    notifications: {
        getAll: () => API.request('notifications.php', 'GET'),
        markAsRead: (notificationId) => API.request(`notifications.php?id=${notificationId}`, 'PUT', { read: true }),
        delete: (notificationId) => API.request(`notifications.php?id=${notificationId}`, 'DELETE'),
    },
};

/**
 * Local Storage Management
 */
const Storage = {
    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    getUser: () => JSON.parse(localStorage.getItem('user') || '{}'),
    clearUser: () => localStorage.removeItem('user'),
    setToken: (token) => localStorage.setItem('token', token),
    getToken: () => localStorage.getItem('token'),
    clearToken: () => localStorage.removeItem('token'),
    isLoggedIn: () => !!localStorage.getItem('token'),
};

/**
 * Auth Helper
 */
const Auth = {
    login: async (email, password) => {
        try {
            const response = await API.auth.login(email, password);
            Storage.setToken(response.token);
            Storage.setUser(response.user);
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await API.auth.register(userData);
            Storage.setToken(response.token);
            Storage.setUser(response.user);
            return response;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    logout: () => {
        Storage.clearUser();
        Storage.clearToken();
        window.location.href = '/index.html';
    },

    isAuthenticated: () => Storage.isLoggedIn(),

    getUser: () => Storage.getUser(),
};

/**
 * Validation Helpers
 */
const Validate = {
    email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    
    password: (password) => password.length >= 8,
    
    required: (value) => value && value.trim().length > 0,
    
    phone: (phone) => /^\d{10}$/.test(phone.replace(/\D/g, '')),
};

/**
 * UI Notification System
 */
const UI = {
    showAlert: (message, type = 'info', duration = 3000) => {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} fade-in`;
        alert.textContent = message;
        document.body.insertBefore(alert, document.body.firstChild);
        
        setTimeout(() => alert.remove(), duration);
    },

    showError: (message) => UI.showAlert(message, 'danger'),
    showSuccess: (message) => UI.showAlert(message, 'success'),
    showInfo: (message) => UI.showAlert(message, 'info'),

    showModal: (id) => {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('active');
    },

    closeModal: (id) => {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('active');
    },

    showLoading: (element) => {
        if (!element) return;
        element.innerHTML = '<div class="spinner"></div>';
        element.classList.add('loading');
    },

    hideLoading: (element) => {
        if (!element) return;
        element.classList.remove('loading');
    },
};

/**
 * Date/Time Formatting
 */
const Format = {
    date: (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }),

    time: (date) => new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }),

    datetime: (date) => `${Format.date(date)} ${Format.time(date)}`,

    relativeTime: (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [key, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
        }
        return 'Just now';
    }
};

/**
 * Export for use
 */
export { API, Storage, Auth, Validate, UI, Format };
