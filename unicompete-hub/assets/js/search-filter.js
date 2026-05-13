const searchState = {
  page: 1,
  sort: 'newest',
};

function competitionCardTemplate(item) {
  const status = item.max_participants && item.registered_count >= item.max_participants ? 'Full / Waitlist' : item.registration_status;
  const image = item.banner_image || '/assets/img/logo.svg';
  const bookmarkLabel = item.is_bookmarked ? 'Bookmarked' : 'Bookmark';

  return `
    <article class="card competition-card">
      <a href="${item.url}" class="card-media">
        <img src="${image}" alt="${item.title}">
      </a>
      <div class="card-body">
        <div class="card-meta" style="justify-content:space-between;align-items:center;">
          <span class="badge" style="background:${item.category_color};">${item.category}</span>
          <span class="badge" style="background:rgba(255,255,255,0.08);">${status}</span>
        </div>
        <h3 class="card-title"><a href="${item.url}">${item.title}</a></h3>
        <p>${item.description.slice(0, 120)}${item.description.length > 120 ? '…' : ''}</p>
        <div class="card-meta">
          <span>${new Date(item.event_start).toLocaleDateString()}</span>
          <span>${item.venue}</span>
          <span>${item.views} views</span>
        </div>
        <div class="form-actions" style="margin-top:1rem;">
          <button class="btn btn-outline" data-bookmark-toggle data-competition-id="${item.id}">${bookmarkLabel}</button>
          <a class="btn btn-primary" href="${item.url}">View Details</a>
        </div>
      </div>
    </article>
  `;
}

function renderCompetitionResults(payload) {
  const grid = document.querySelector('[data-competition-grid]');
  const pagination = document.querySelector('[data-pagination]');
  if (!grid) return;

  grid.innerHTML = payload.items.map(competitionCardTemplate).join('') || '<div class="card"><div class="card-body"><p>No competitions match your filters.</p></div></div>';

  if (pagination) {
    const buttons = [];
    for (let i = 1; i <= payload.pages; i += 1) {
      buttons.push(`<button class="tab-button ${i === payload.page ? 'active' : ''}" data-page="${i}">${i}</button>`);
    }
    pagination.innerHTML = buttons.join('');
    pagination.querySelectorAll('[data-page]').forEach((button) => {
      button.addEventListener('click', () => {
        searchState.page = Number(button.getAttribute('data-page'));
        fetchCompetitions();
      });
    });
  }

  grid.querySelectorAll('[data-bookmark-toggle]').forEach((button) => {
    button.addEventListener('click', async () => {
      const competitionId = button.getAttribute('data-competition-id');
      if (!competitionId) return;
      const response = await fetch('/api/bookmark.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competition_id: competitionId })
      });
      const data = await response.json();
      button.textContent = data.bookmarked ? 'Bookmarked' : 'Bookmark';
    });
  });
}

async function fetchCompetitions() {
  const searchInput = document.querySelector('[data-search-input]');
  const categoryValues = [...document.querySelectorAll('[data-category-filter]:checked')].map((el) => el.value).join(',');
  const sort = document.querySelector('[data-sort-select]')?.value || searchState.sort;
  const status = document.querySelector('[data-status-filter]')?.value || 'all';
  const venue = document.querySelector('[data-venue-filter]')?.value || 'all';
  const dateFrom = document.querySelector('[data-date-from]')?.value || '';
  const dateTo = document.querySelector('[data-date-to]')?.value || '';
  const search = searchInput?.value || '';

  const params = new URLSearchParams({
    search,
    category: categoryValues,
    sort,
    status,
    venue,
    date_from: dateFrom,
    date_to: dateTo,
    page: String(searchState.page),
    per_page: '10',
  });

  const response = await fetch(`/api/competitions.php?${params.toString()}`);
  const payload = await response.json();
  renderCompetitionResults(payload);
}

window.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('[data-search-input]');
  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        searchState.page = 1;
        fetchCompetitions();
      }, 250);
    });
  }

  document.querySelectorAll('[data-category-filter], [data-sort-select], [data-status-filter], [data-venue-filter], [data-date-from], [data-date-to]').forEach((field) => {
    field.addEventListener('change', () => {
      searchState.page = 1;
      searchState.sort = document.querySelector('[data-sort-select]')?.value || 'newest';
      fetchCompetitions();
    });
  });

  const toggleButtons = document.querySelectorAll('[data-view-toggle]');
  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.getAttribute('data-view-toggle');
      document.querySelectorAll('[data-view-panel]').forEach((panel) => panel.classList.add('hidden'));
      document.querySelectorAll('[data-view-toggle]').forEach((btn) => btn.classList.remove('active'));
      document.querySelector(`[data-view-panel="${view}"]`)?.classList.remove('hidden');
      button.classList.add('active');
    });
  });

  if (document.querySelector('[data-competition-grid]')) {
    fetchCompetitions();
  }
});
