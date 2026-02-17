(function() {
  // --- Navigation ---
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');

  function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');
    if (pageId === 'home') updateHomeStats();
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page === 'dashboard' && !isLoggedIn()) {
        showPage('login');
        return;
      }
      showPage(page);
      if (page === 'dashboard') renderDashboard();
    });
  });

  // --- Home page link clicks (instruction links & any data-goto elements) ---
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(el.dataset.goto);
    });
  });