(function () {
    const config = window.SITE_CONFIG || {};
    const NAV_ITEMS = config.navItems || [];

    const activePage = document.body.dataset.page || 'home';
    const headerEl = document.getElementById('site-header');
    if (!headerEl) return;

    const navItemsHtml = NAV_ITEMS.map(item => {
        const isActive = item.key === activePage;
        const classes = ['nav-link', isActive ? 'active' : '', item.cta ? 'btn-nav' : ''].filter(Boolean).join(' ');
        return `<li><a href="${item.href}" class="${classes}">${item.label}</a></li>`;
    }).join('');

    const brand = config.brand || {};

    headerEl.className = 'main-header';
    headerEl.id = 'main-header';
    headerEl.innerHTML = `
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <div class="nav-container">
            <a href="${brand.homeHref || 'index.html'}" class="logo-area" id="nav-logo-link" aria-label="${brand.name} — Home">
                <img src="${brand.logo || 'assets/logo.png'}" alt="${brand.logoAlt || brand.name}" class="header-logo" id="header-logo" width="180" height="72">
            </a>
            <nav class="nav-menu" id="nav-menu">
                <ul>${navItemsHtml}</ul>
            </nav>
            <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle Navigation Menu">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </button>
        </div>
    `;
})();
