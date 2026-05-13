<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth-guard.php';
require_login(['admin']);
$pdo = require __DIR__ . '/../config/db.php';
$pageTitle = 'Conflict Report | Evntra';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    run_conflict_scan($pdo);
    flash('success', 'Conflict scan refreshed.');
}

$rows = conflict_report_rows($pdo);
include __DIR__ . '/../includes/header.php';
?>
<section class="page-hero">
    <div class="section-head">
        <div>
            <h1>Conflict report</h1>
            <p>Overlapping competitions detected by the scheduler.</p>
        </div>
        <form method="post">
            <?= csrf_field() ?>
            <button class="btn btn-primary" type="submit">Run scan</button>
        </form>
    </div>
</section>

<div class="table-card">
    <div class="table-responsive">
        <table>
            <thead><tr><th>Competition A</th><th>Competition B</th><th>Severity</th><th>Flagged</th></tr></thead>
            <tbody>
                <?php foreach ($rows as $row): ?>
                    <tr>
                        <td><a href="<?= e(competition_url(['slug' => $row['competition_a_slug']])) ?>"><?= e($row['competition_a_title']) ?></a></td>
                        <td><a href="<?= e(competition_url(['slug' => $row['competition_b_slug']])) ?>"><?= e($row['competition_b_title']) ?></a></td>
                        <td><span class="badge" style="background:<?= $row['severity'] === 'high' ? '#ff4757' : ($row['severity'] === 'medium' ? '#ffa502' : '#2ed573') ?>;"><?= e($row['severity']) ?></span></td>
                        <td><?= e($row['flagged_at']) ?></td>
                    </tr>
                <?php endforeach; ?>
                <?php if (!$rows): ?><tr><td colspan="4">No conflict flags recorded.</td></tr><?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
<?php include __DIR__ . '/../includes/footer.php'; ?>
