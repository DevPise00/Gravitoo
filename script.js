  let currentPage = 'home';
  // Define the base URL for your backend API.
  // This makes it easy to switch between development and production URLs.
  const API_BASE_URL = 'http://localhost:3001';
  let sidebarCollapsed = false;

  const pageMap = { home:'page-home', rentals:'page-rentals', ai:'page-ai', diagnose:'page-diagnose', notif: 'page-notif', cart: 'page-cart' };
  const snavMap = { home:'snav-home', rentals:'snav-rentals', ai:'snav-ai', diagnose:'snav-diagnose', notif: 'snav-notif' };
  const mbnMap  = { home:'mbn-home', rentals:'mbn-rentals', ai:'mbn-ai', diagnose:'mbn-diagnose', notif: 'mbn-notif' };
  const titleMap = { home:'Dashboard', rentals:'Rentals', ai:'FarmGuru', diagnose:'AI Diagnose', notif: 'Notifications', cart: 'My Orders' };

  // ===================== AUTHENTICATION =====================
  function handleLogin() {
    // In a real scenario, this will open Google Auth and contact your backend.
    // For now, it unlocks the app visually.
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-shell').style.display = '';
    document.getElementById('mobile-bottom-nav').style.display = '';
  }

  function switchPage(page) {
    // if (page === 'notif') page = 'home'; // Removed to enable notifications page
    document.getElementById(pageMap[currentPage]).classList.remove('active');
    document.getElementById(snavMap[currentPage])?.classList.remove('active');
    document.getElementById(mbnMap[currentPage])?.classList.remove('active');

    currentPage = page;
    document.getElementById(pageMap[page]).classList.add('active');
    document.getElementById(snavMap[page])?.classList.add('active');
    document.getElementById(mbnMap[page])?.classList.add('active');
    document.getElementById('topbar-title').textContent = titleMap[page] || 'Gravitoo';

    // If we are switching to the rentals page, load the data from the backend.
    if (page === 'rentals') {
      loadMyRentals();
    }

    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main-area');
    sidebar.classList.toggle('collapsed', sidebarCollapsed);
    main.classList.toggle('sidebar-collapsed', sidebarCollapsed);
  }

  function openMobileSidebar() {
    document.getElementById('sidebar').classList.add('mobile-open');
    document.getElementById('sidebar-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    document.getElementById('sidebar').classList.remove('mobile-open');
    document.getElementById('sidebar-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function setRentalTab(mode) {
    const isHire = mode === 'hire';
    document.getElementById('tab-hire').classList.toggle('rmt-active', isHire);
    document.getElementById('tab-sell').classList.toggle('rmt-active', !isHire);
    document.getElementById('hire-panel').style.display = isHire ? 'block' : 'none';
    document.getElementById('sell-panel').style.display = isHire ? 'none' : 'block';
  }

  // ===================== DATA FETCHING =====================
  // This new section will handle communication with your Node.js backend.

  async function loadMyRentals() {
    const container = document.getElementById('my-listings-container');
    container.innerHTML = '<p>Loading listings...</p>'; // Show a loading indicator

    try {
      const response = await fetch(`${API_BASE_URL}/api/rentals`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const listings = await response.json();

      container.innerHTML = ''; // Clear loading indicator

      if (listings.length === 0) {
        container.innerHTML = '<p>You have no active listings. Add one using the form!</p>';
        return;
      }

      listings.forEach(listing => {
        const isPaused = listing.status === 'Paused';
        const statusColor = isPaused ? '#FF8F00' : 'var(--green)';
        const icon = listing.type === 'Machine' ? '🚜' : '👷';

        const listingCard = `
          <div class="my-listing-card">
            <div class="my-listing-img">${icon}</div>
            <div class="my-listing-info">
              <div class="my-listing-name">${listing.name}</div>
              <div class="my-listing-rate">₹${listing.rate} / ${listing.rateType}</div>
              <div class="my-listing-stats"><span class="my-listing-stat" style="color:${statusColor};">● ${listing.status}</span><span class="my-listing-stat">${listing.bookings} bookings</span></div>
            </div>
            <div class="my-listing-earn"><div class="my-listing-earn-val">₹${listing.earned.toLocaleString('en-IN')}</div><div class="my-listing-earn-lbl">earned</div></div>
          </div>`;
        container.innerHTML += listingCard;
      });
    } catch (error) {
      container.innerHTML = `<p style="color:red;">Error loading rentals: ${error.message}</p>`;
      console.error('Failed to fetch rentals:', error);
    }
  }

  // lf-option toggle
  document.querySelectorAll('.lf-option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.closest('.lf-select-row').querySelectorAll('.lf-option').forEach(o => o.classList.remove('lf-option-active'));
      opt.classList.add('lf-option-active');
    });
  });
  document.querySelectorAll('.lf-avail-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('lf-avail-on'));
  });
  document.querySelectorAll('.lf-rate-toggle span').forEach(s => {
    s.addEventListener('click', () => {
      s.closest('.lf-rate-toggle').querySelectorAll('span').forEach(x => x.classList.remove('lf-rate-active'));
      s.classList.add('lf-rate-active');
    });
  });

  // ===================== EVENT LISTENERS =====================
  // This is a better way to handle clicks than using onclick="" in the HTML.
  // It separates your content (HTML) from your behavior (JavaScript).

  document.getElementById('collapse-btn').addEventListener('click', toggleSidebar);
  document.getElementById('hamburger-btn').addEventListener('click', openMobileSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', closeMobileSidebar);
  document.getElementById('topbar-notif-btn').addEventListener('click', () => switchPage('notif'));
  document.getElementById('topbar-cart-btn').addEventListener('click', () => switchPage('cart'));
  document.getElementById('view-full-btn').addEventListener('click', () => switchPage('ai'));
