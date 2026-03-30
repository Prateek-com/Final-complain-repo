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

  // --- Home page stats ---
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

    // Initialize home stats on load
  updateHomeStats();

    // --- LocalStorage helpers ---
  function getComplaints() {
      return JSON.parse(localStorage.getItem('complaints') || '[]');
  
  }

 function saveComplaints(list) {
    localStorage.setItem('complaints', JSON.stringify(list));
  }

  function isLoggedIn() {
    return sessionStorage.getItem('authority_logged_in') === 'true';
  }

 // --- Generate Ticket ID ---
  function generateTicketId() {
    const num = Math.floor(10000 + Math.random() * 90000);
    return 'TKT-2026-' + num;
  }

   // --- Complaint Form ---
  const form = document.getElementById('complaint-form');
  const successMsg = document.getElementById('success-msg');
    const ticketDisplay = document.getElementById('ticket-display');

    form.addEventListener('submit', e => {
    e.preventDefault();
    const ticket = generateTicketId();
    const complaint = {
      ticketId: ticket,
      name: document.getElementById('name').value.trim(),
      mobile: document.getElementById('mobile').value.trim(),
      category: document.getElementById('category').value,
      area: document.getElementById('area').value.trim(),
      description: document.getElementById('description').value.trim(),
      status: 'SUBMITTED',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const complaints = getComplaints();
    complaints.unshift(complaint);
    saveComplaints(complaints);

    ticketDisplay.textContent = ticket;
    form.classList.add('hidden');
    successMsg.classList.remove('hidden');
  });

  document.getElementById('new-complaint-btn').addEventListener('click', () => {
    form.reset();
    form.classList.remove('hidden');
    successMsg.classList.add('hidden');
  } 

    // --- Status Check ---
  const searchBtn = document.getElementById('search-btn');
    const ticketInput = document.getElementById('ticket-input');
      const statusResult = document.getElementById('status-result');
      const statusError = document.getElementById('status-error');

       searchBtn.addEventListener('click', () => {
    const id = ticketInput.value.trim().toUpperCase();
     statusResult.classList.add('hidden');
     statusError.classList.add('hidden');
    

    if (!id) return;

    const complaint = getComplaints().find(c => c.ticketId === id);
     if (!complaint) {
      statusError.classList.remove('hidden');
      return;
    }

    document.getElementById('r-ticket').textContent = complaint.ticketId;
    document.getElementById('r-name').textContent = complaint.name;
    document.getElementById('r-mobile').textContent = complaint.mobile;
    document.getElementById('r-category').textContent = complaint.category;
    document.getElementById('r-area').textContent = complaint.area;
     document.getElementById('r-desc').textContent = complaint.description;
     document.getElementById('r-date').textContent = complaint.date;
     document.getElementById('r-status').innerHTML = makeBadge(complaint.status);
     statusResult.classList.remove('hidden');
      });

      ticketInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchBtn.click();
  });
// --- Badge helper ---
  function makeBadge(status) {
    const cls = {
      'SUBMITTED': 'badge-submitted',
      'IN_PROGRESS': 'badge-in-progress',
      'RESOLVED': 'badge-resolved'
    }[status] || 'badge-submitted';
    const label = status.replace('_', ' ');
    return `<span class="badge ${cls}">${label}</span>`;
  }

  / --- Login ---
  const loginForm = document.getElementById('login-form');
   const loginError = document.getElementById('login-error');
  loginError.classList.add('hidden');
loginForm.reset();
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
 const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
      sessionStorage.setItem('authority_logged_in', 'true');
        loginError.classList.add('hidden');
loginForm.reset();

       if (!document.querySelector('[data-page="dashboard"]')) {
        const dashLink = document.createElement('a');
        dashLink.href = '#';
          dashLink.className = 'nav-link';
        dashLink.dataset.page = 'dashboard';
          dashLink.textContent = 'Dashboard';
         dashLink.addEventListener('click', ev => {
          ev.preventDefault();
           showPage('dashboard');
           renderDashboard()
              });
           document.querySelector('nav').appendChild(dashLink);
       }

       showPage('dashboard');
      renderDashboard();
      } else {
      loginError.classList.remove('hidden');
    }
  });
           
 // --- Logout ---
  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('authority_logged_in');
 const dashLink = document.querySelector('[data-page="dashboard"]');
