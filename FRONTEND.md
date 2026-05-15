# Evntra Frontend - Complete Documentation

## Overview

Evntra is a modern, minimalist competition management platform with a comprehensive HTML/CSS/JavaScript frontend. The frontend is built with vanilla JavaScript (no frameworks) and is fully integrated with the PHP backend API.

## Design Philosophy

- **Modern & Minimalist**: Clean, spacious design with subtle colors
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessible**: Built with semantic HTML and WCAG accessibility in mind
- **Fast**: Lightweight, efficient, and optimized for performance
- **User-Centric**: Intuitive navigation and clear call-to-actions

## Project Structure

```
assets/
├── css/
│   ├── main.css           # Global styles & components
│   ├── landing.css        # Landing page specific styles
│   ├── dashboard.css      # Dashboard layouts
│   └── calendar.css       # Calendar component
├── js/
│   ├── api.js            # API integration layer
│   ├── main.js           # Core routing & app logic
│   ├── analytics.js      # Analytics functionality
│   └── conflict-checker.js
│
student/
├── browse.php            # Browse competitions
├── my-registrations.html # View registrations
├── bookmarks.html        # Bookmarked competitions
├── dashboard.php         # Student dashboard
└── register-event.php    # Registration form
│
organizer/
├── create-competition.html    # Create new competition
├── manage-registrations.html  # Manage participants
├── my-competitions.php        # View own competitions
├── edit-competition.php       # Edit competition
├── analytics.php             # Competition analytics
└── dashboard.php             # Organizer dashboard
│
admin/
├── manage-users.html        # User management
├── approve-competitions.html # Competition approval
├── dashboard.php            # Admin dashboard
└── conflict-report.php      # View conflict reports
│
index.html               # Landing page
auth/
├── login.html           # Login page
├── register.html        # Registration page
├── forgot-password.php  # Password recovery
└── reset-password.php   # Reset password
```

## Key Features

### 1. **Authentication System**
- User registration with role selection (Student, Organizer, Admin)
- Secure login with token-based sessions
- Password recovery functionality
- Automatic session management

### 2. **Student Features**
- Browse and search competitions
- Register for competitions
- View registration status
- Bookmark favorite competitions
- Manage bookmarks
- Personal dashboard with statistics
- Conflict detection for overlapping competitions

### 3. **Organizer Features**
- Create and manage competitions
- Edit competition details
- View and manage registrations
- Track participant information
- Detailed analytics and reporting
- Approve/manage competition submissions
- View acceptance statistics

### 4. **Admin Features**
- User management and moderation
- Competition approval workflow
- Conflict reporting
- Platform analytics
- System monitoring
- User deactivation

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables
- **JavaScript (ES6+)**: Vanilla JS, no frameworks
- **Responsive Design**: Mobile-first approach

### Color Palette
```css
Primary:     #3498db (Blue)
Secondary:   #2c3e50 (Dark Blue)
Success:     #2ecc71 (Green)
Warning:     #f39c12 (Orange)
Danger:      #e74c3c (Red)
Light:       #ecf0f1 (Light Gray)
Dark:        #2c3e50 (Dark)
```

### CSS Architecture

**Main CSS Variables:**
- Colors (primary, secondary, success, warning, danger, light, dark, gray)
- Spacing (space-xs to space-2xl)
- Shadows (shadow-sm to shadow-hover)
- Border radius
- Transitions and animations
- Typography scales

## Component System

### Buttons
```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-success">Success Button</button>
<button class="btn btn-danger">Danger Button</button>
<button class="btn btn-outline">Outline Button</button>
<button class="btn btn-small">Small Button</button>
<button class="btn btn-large btn-block">Large Full Width</button>
```

### Cards
```html
<div class="card">
    <div class="card-header">Header</div>
    <div class="card-body">Content</div>
    <div class="card-footer">Footer</div>
</div>
```

### Forms
```html
<div class="form-group">
    <label for="input">Label</label>
    <input type="text" id="input" placeholder="Placeholder">
</div>
```

### Grid System
```html
<div class="grid grid-2">    <!-- 2 columns -->
<div class="grid grid-3">    <!-- 3 columns -->
<div class="grid grid-4">    <!-- 4 columns -->
```

### Alerts & Badges
```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-danger">Error message</div>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
```

## JavaScript Architecture

### API Layer (`api.js`)
Centralized API communication with the PHP backend:
```javascript
// Competitions
API.competitions.getAll()
API.competitions.getById(id)
API.competitions.create(data)
API.competitions.update(id, data)

// Registrations
API.registrations.register(competitionId)
API.registrations.getMyRegistrations()

// Bookmarks
API.bookmarks.add(competitionId)
API.bookmarks.getAll()

// Notifications
API.notifications.getAll()
```

### Authentication (`Auth` object)
```javascript
Auth.login(email, password)
Auth.register(userData)
Auth.logout()
Auth.isAuthenticated()
Auth.getUser()
```

### Storage Management
```javascript
Storage.setUser(user)
Storage.getUser()
Storage.setToken(token)
Storage.getToken()
```

### UI Helpers
```javascript
UI.showAlert(message, type, duration)
UI.showError(message)
UI.showSuccess(message)
UI.showModal(id)
UI.closeModal(id)
UI.showLoading(element)
```

### Routing System
```javascript
Router.register('page-name', handler)
Router.navigate('page-name')
window.navigateTo('page-name')
```

## Responsive Breakpoints

- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (optimized grid)
- **Mobile**: Below 768px (single column, touch-friendly)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Installation & Setup

### 1. Prerequisites
- Web server (Apache/Nginx)
- PHP 7.4+
- Modern web browser

### 2. File Organization
Place all files in your web root:
```
/var/www/html/evntra/
├── index.html
├── assets/
├── student/
├── organizer/
├── admin/
├── auth/
├── api/ (PHP backend)
└── config/
```

### 3. Configuration
Update API base URL in `assets/js/api.js`:
```javascript
const API = {
    BASE_URL: '/api'  // Adjust to your backend path
};
```

### 4. Server Configuration
Ensure `.htaccess` or web server routing allows HTML files:

**.htaccess (Apache)**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^.*$ index.html [L]
</IfModule>
```

## Workflow

### 1. Landing Page
- First-time visitors see the landing page
- Features overview and CTA buttons
- Navigation to login/register

### 2. Authentication
- Registration with role selection
- Login with email/password
- Password recovery via email
- Session stored in localStorage

### 3. Dashboard
- Role-based dashboard (Student/Organizer/Admin)
- Quick stats and actions
- Navigation to role-specific sections

### 4. Main Workflows

**For Students:**
- Browse → Bookmark → Register → Track → Participate

**For Organizers:**
- Create → Manage → Approve Participants → Analytics → Report

**For Admins:**
- Review → Approve → Monitor → Report → Manage

## Development Guidelines

### Adding New Pages

1. **Create HTML file** in appropriate directory
2. **Include CSS & JS:**
   ```html
   <link rel="stylesheet" href="../assets/css/main.css">
   <script src="../assets/js/api.js"></script>
   <script src="../assets/js/main.js"></script>
   ```

3. **Use consistent structure:**
   ```html
   <nav class="navbar">...</nav>
   <div class="container">
       <!-- Page content -->
   </div>
   <footer class="footer">...</footer>
   ```

### Adding New Routes

In `assets/js/main.js`:
```javascript
Router.register('page-name', function() {
    // Page content
});
```

### Adding New Components

1. Add CSS to `assets/css/main.css`
2. Follow BEM naming convention
3. Use CSS variables for colors/spacing
4. Ensure responsive design

### API Integration

```javascript
async function fetchData() {
    try {
        const response = await fetch('/api/endpoint', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## Performance Optimization

### Current Optimizations
- ✅ No external dependencies (vanilla JS)
- ✅ CSS variables for efficient theming
- ✅ Lazy loading for images
- ✅ Minified assets
- ✅ Efficient DOM manipulation

### Future Enhancements
- Service Worker for offline support
- Asset bundling and minification
- Image optimization
- Caching strategies
- Code splitting

## Accessibility Features

- ✅ Semantic HTML (header, nav, main, footer)
- ✅ ARIA labels where appropriate
- ✅ Keyboard navigation support
- ✅ Color contrast compliance
- ✅ Focus indicators
- ✅ Form validation feedback

## Security Considerations

1. **Authentication**
   - Token stored in localStorage (consider secure storage)
   - HTTPS enforced for production

2. **API Communication**
   - CORS headers properly configured
   - Input validation on frontend and backend
   - XSS protection through template sanitization

3. **Data Protection**
   - Sensitive data not logged
   - Session timeout implemented
   - CSRF tokens for POST requests

## Troubleshooting

### Common Issues

1. **Routes not working**
   - Check if Router.init() is called
   - Verify query parameter format: `?page=name`

2. **API calls failing**
   - Check CORS headers from backend
   - Verify API_BASE_URL is correct
   - Check browser console for errors

3. **Styles not loading**
   - Verify CSS file paths
   - Clear browser cache
   - Check file permissions

4. **Authentication not persisting**
   - Check localStorage quota
   - Verify token is being saved
   - Check browser storage restrictions

## Future Development

### Planned Features
- Real-time notifications with WebSocket
- Advanced analytics dashboard
- Email integration for reminders
- Calendar integration
- Social sharing
- Mobile app (React Native)
- Dark mode toggle
- Internationalization (i18n)
- Advanced filtering and search
- Recommendation engine

### Code Refactoring
- Convert to modular architecture
- Implement component library
- Add unit tests
- Add end-to-end tests
- API documentation generation

## Credits

**Design**: Modern & Minimalist UI Pattern
**Framework**: Vanilla HTML/CSS/JavaScript
**Year**: 2026

## Support

For issues, feature requests, or feedback:
1. Check existing documentation
2. Review code comments
3. Check browser console for errors
4. Contact development team

---

**Version**: 1.0.0
**Last Updated**: January 2026
**Status**: Production Ready
