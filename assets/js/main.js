document.addEventListener('DOMContentLoaded', () => {
  /* Highlight active sidebar link */
  const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  sidebarLinks.forEach(link => {
    const linkUrl = new URL(link.href, window.location.origin);
    if (linkUrl.pathname === window.location.pathname || link.href === window.location.href) {
      link.classList.add('active');
    }
  });
  const toggle = document.querySelector('[data-notification-toggle]');
  const panel = document.querySelector('[data-notification-panel]');
  const markAllRead = document.querySelector('[data-mark-all-read]');

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
      if (!panel.contains(event.target) && !toggle.contains(event.target)) {
        panel.classList.remove('open');
      }
    });
  }

  if (markAllRead) {
    markAllRead.addEventListener('click', async () => {
      const items = [...document.querySelectorAll('[data-notification-id]')];
      await Promise.all(items.map((item) => {
        const notificationId = item.getAttribute('data-notification-id');
        if (!notificationId) return Promise.resolve();
        return fetch('/api/notifications.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'read', id: notificationId })
        });
      }));
      const badge = document.querySelector('[data-notification-count]');
      if (badge) badge.textContent = '0';
      items.forEach((item) => item.classList.remove('unread'));
    });
  }

  document.querySelectorAll('[data-copy-link]').forEach((button) => {
    button.addEventListener('click', async () => {
      const url = button.getAttribute('data-copy-link');
      if (!url) return;
      await navigator.clipboard.writeText(url);
      const previous = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => {
        button.textContent = previous;
      }, 1500);
    });
  });

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

  document.querySelectorAll('[data-auto-submit]').forEach((field) => {
    field.addEventListener('change', () => field.form?.requestSubmit());
  });
});
