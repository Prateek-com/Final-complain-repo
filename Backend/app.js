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

  // Home page link clicks (instruction ) 
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(el.dataset.goto);
    });
  });

  // --- Home page stats  
  function updateHomeStats() {
    const complaints = getComplaints();
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
    const pending = total - resolved;
    const homeTotal = document.getElementById('home-total');
    const homeResolved = document.getElementById('home-resolved');
    const homePending = document.getElementById('home-pending');
    if (homeTotal) homeTotal.textContent = total;
    if (homeResolved) homeResolved.textContent = resolved;
    if (homePending) homePending.textContent = pending;
  }
