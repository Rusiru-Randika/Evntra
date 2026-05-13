<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth-guard.php';
require_guest();
require_once __DIR__ . '/../includes/mailer.php';
$pdo = require __DIR__ . '/../config/db.php';
$pageTitle = 'Forgot Password | Evntra';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $email = trim((string) ($_POST['email'] ?? ''));
    $user = $email !== '' ? get_user_by_email($pdo, $email) : null;

    if ($user && (int) $user['is_active'] === 1) {
        $token = create_password_reset_token($pdo, (int) $user['id']);
        send_password_reset_mail($user, $token);
    }

    flash('success', 'If that email exists in Evntra, a reset link has been sent.');
}

include __DIR__ . '/../includes/header.php';
?>
<section class="auth-layout">
    <div class="hero-panel">
        <span class="badge" style="background:rgba(255,165,2,0.18);">Account recovery</span>
        <h1>Reset your password.</h1>
        <p>We will email you a reset link that expires in one hour.</p>
    </div>
    <div class="form-card">
        <h2>Forgot password</h2>
        <form method="post" class="multi-step">
            <?= csrf_field() ?>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-actions">
                <button class="btn btn-primary" type="submit">Send reset link</button>
                <a class="btn btn-outline" href="/auth/login.php">Back to login</a>
            </div>
        </form>
    </div>
</section>
<?php include __DIR__ . '/../includes/footer.php'; ?>
