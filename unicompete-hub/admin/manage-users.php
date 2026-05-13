<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth-guard.php';
require_login(['admin']);
$pdo = require __DIR__ . '/../config/db.php';
$pageTitle = 'Manage Users | Evntra';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $userId = (int) ($_POST['user_id'] ?? 0);
    $role = (string) ($_POST['role'] ?? 'student');
    $isActive = isset($_POST['is_active']) ? 1 : 0;
    if (in_array($role, ['student', 'organizer', 'admin'], true)) {
        $pdo->prepare('UPDATE users SET role = ?, is_active = ? WHERE id = ?')->execute([$role, $isActive, $userId]);
        flash('success', 'User updated.');
    }
}

$users = all_users($pdo);
include __DIR__ . '/../includes/header.php';
?>
<section class="page-hero">
    <h1>Manage users</h1>
    <p>Change roles or deactivate accounts.</p>
</section>

<div class="table-card">
    <div class="table-responsive">
        <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>University</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
                <?php foreach ($users as $user): ?>
                    <tr>
                        <td><?= e($user['full_name']) ?></td>
                        <td><?= e($user['email']) ?></td>
                        <td><?= e($user['role']) ?></td>
                        <td><?= e($user['university']) ?></td>
                        <td><?= (int) $user['is_active'] === 1 ? 'Active' : 'Inactive' ?></td>
                        <td>
                            <form method="post" class="button-row">
                                <?= csrf_field() ?>
                                <input type="hidden" name="user_id" value="<?= (int) $user['id'] ?>">
                                <select name="role">
                                    <option value="student" <?= $user['role'] === 'student' ? 'selected' : '' ?>>Student</option>
                                    <option value="organizer" <?= $user['role'] === 'organizer' ? 'selected' : '' ?>>Organizer</option>
                                    <option value="admin" <?= $user['role'] === 'admin' ? 'selected' : '' ?>>Admin</option>
                                </select>
                                <label class="small-text"><input type="checkbox" name="is_active" <?= (int) $user['is_active'] === 1 ? 'checked' : '' ?>> Active</label>
                                <button class="btn btn-outline" type="submit">Save</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
<?php include __DIR__ . '/../includes/footer.php'; ?>
