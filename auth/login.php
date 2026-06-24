<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth-guard.php';
require_guest();
$pdo = require __DIR__ . '/../config/db.php';
$pageTitle = 'Login | Evntra';

$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();

    if (login_rate_limited()) {
        flash('error', 'Too many login attempts. Please wait 10 minutes and try again.');
    } else {
        $email = trim((string) ($_POST['email'] ?? ''));
        $password = (string) ($_POST['password'] ?? '');
        $user = get_user_by_email($pdo, $email);

        if ($user && (int) $user['is_active'] === 1 && password_verify($password, $user['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['user_id'] = (int) $user['id'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['full_name'] = $user['full_name'];
            clear_login_attempts();
            flash('success', 'Welcome back, ' . $user['full_name'] . '.');
            redirect('/' . $user['role'] . '/dashboard.php');
        }

        record_login_attempt();
        flash('error', 'Invalid email or password.');
    }
}

include __DIR__ . '/../includes/header.php';
?>
<section class="auth-layout">
    <div class="hero-panel">

        <span class="badge">Centralized competition hub</span>
        <h1>Sign in to the <span class="gradient-text">Arena</span></h1>
        <p>Manage every university competition in one place - track registrations, bookmarks, conflict warnings, and organizer analytics.</p>

        <div class="auth-features">
            <div class="auth-feature">
                <span class="auth-feature-icon material-symbols-outlined">trophy</span>
                <span class="auth-feature-label"><strong>6 Live Competitions</strong> - browse & register instantly</span>
            </div>
            <div class="auth-feature">
                <span class="auth-feature-icon material-symbols-outlined">groups</span>
                <span class="auth-feature-label"><strong>3 User Roles</strong> - student, organizer, admin</span>
            </div>
            <div class="auth-feature">
                <span class="auth-feature-icon material-symbols-outlined">warning</span>
                <span class="auth-feature-label"><strong>Conflict Detection</strong> - automatic schedule clash alerts</span>
            </div>
        </div>
    </div>
    <div class="form-card">
        <h2>Welcome back</h2>
        <p class="auth-subtitle">Enter your credentials to access your dashboard.</p>
        <form method="post" class="multi-step">
            <?= csrf_field() ?>
            <div class="form-group">
                <label for="email">Email address</label>
                <input type="email" id="email" name="email" required autocomplete="email" placeholder="Ex: you@university.edu" value="<?= htmlspecialchars($email) ?>">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required autocomplete="current-password" minlength="8" placeholder="••••••••">
            </div>
            <div class="form-actions" style="flex-direction:column; gap:0.75rem; margin-top:0.5rem;">
                <button class="btn btn-primary" type="submit">Sign in</button>
                <a class="btn btn-outline" href="/auth/forgot-password.php" style="width:100%; text-align:center;">Forgot password?</a>
            </div>
        </form>
        <div class="auth-divider">or</div>
        <p class="small-text">Don't have an account? <a href="/auth/register.php">Create one here</a></p>
        <div class="auth-trust">
            <span class="auth-trust-item"><span class="material-symbols-outlined">lock</span> Secure login</span>
            <span class="auth-trust-item"><span class="material-symbols-outlined">verified</span> Verified platform</span>
            <span class="auth-trust-item"><span class="material-symbols-outlined">speed</span> Fast access</span>
        </div>
        <p class="small-text" style="margin-top:1rem; font-size:0.78rem; opacity:0.7;">Demo: student@evntra.test / Student123!</p>
    </div>
</section>
<?php include __DIR__ . '/../includes/footer.php'; ?>
