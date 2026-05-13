<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth-guard.php';
require_guest();
$pdo = require __DIR__ . '/../config/db.php';
$pageTitle = 'Reset Password | Evntra';
$token = (string) ($_GET['token'] ?? $_POST['token'] ?? '');
$resetRow = $token !== '' ? $pdo->prepare('SELECT * FROM password_resets WHERE token = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1') : null;
if ($resetRow) {
    $resetRow->execute([$token]);
    $resetRow = $resetRow->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $password = (string) ($_POST['password'] ?? '');
    $confirmPassword = (string) ($_POST['confirm_password'] ?? '');
    $token = (string) ($_POST['token'] ?? '');

    $stmt = $pdo->prepare('SELECT * FROM password_resets WHERE token = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1');
    $stmt->execute([$token]);
    $resetRow = $stmt->fetch();

    if (!$resetRow) {
        flash('error', 'The reset link is invalid or has expired.');
    } elseif (!password_is_strong($password)) {
        flash('error', 'Password must be at least 8 characters with upper, lower, number, and symbol.');
    } elseif ($password !== $confirmPassword) {
        flash('error', 'Passwords do not match.');
    } else {
        $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([password_hash($password, PASSWORD_BCRYPT), (int) $resetRow['user_id']]);
        $pdo->prepare('UPDATE password_resets SET used_at = NOW() WHERE id = ?')->execute([(int) $resetRow['id']]);
        flash('success', 'Your password has been reset. Please log in.');
        redirect('/auth/login.php');
    }
}

include __DIR__ . '/../includes/header.php';
?>
<section class="auth-layout">
    <div class="hero-panel">
        <span class="badge" style="background:rgba(108,99,255,0.18);">Secure reset</span>
        <h1>Create a new password.</h1>
    </div>
    <div class="form-card">
        <h2>Reset password</h2>
        <?php if (!$resetRow): ?>
            <p>The reset link is invalid or expired.</p>
            <a class="btn btn-primary" href="/auth/forgot-password.php">Request a new link</a>
        <?php else: ?>
            <form method="post" class="multi-step">
                <?= csrf_field() ?>
                <input type="hidden" name="token" value="<?= e($token) ?>">
                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="password">New password</label>
                        <input type="password" id="password" name="password" minlength="8" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm_password">Confirm password</label>
                        <input type="password" id="confirm_password" name="confirm_password" minlength="8" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn btn-primary" type="submit">Update password</button>
                    <a class="btn btn-outline" href="/auth/login.php">Back to login</a>
                </div>
            </form>
        <?php endif; ?>
    </div>
</section>
<?php include __DIR__ . '/../includes/footer.php'; ?>
