window.KLSTUDIOS_CONTENT = window.KLSTUDIOS_CONTENT || {};

const renderContentSections = (pageContent, pageKey) => {
  const homeQuickLinks = document.getElementById('home-quick-links');
  if (homeQuickLinks && Array.isArray(pageContent.quickLinks)) {
    homeQuickLinks.innerHTML = pageContent.quickLinks.map((item) => `
      <a href="${item.href || '#'}" class="home-link-card">
        <i class="${item.icon || 'fa-solid fa-star'}"></i>
        <h3>${item.title || ''}</h3>
        <p>${item.text || ''}</p>
        <span class="card-link-arrow">Learn more <i class="fa-solid fa-arrow-right"></i></span>
      </a>
    `).join('');
  }

  const featuredProjectsGrid = document.getElementById('featured-projects-grid');
  if (featuredProjectsGrid && Array.isArray(pageContent.featuredProjects)) {
    featuredProjectsGrid.innerHTML = pageContent.featuredProjects.map((item) => `
      <a href="${item.href || 'portfolio.html'}" class="featured-card">
        <img src="${item.image || 'assets/banner.png'}" alt="${item.alt || ''}" loading="lazy">
        <div class="featured-card-overlay">
          <span class="port-category">${item.category || ''}</span>
          <h3>${item.title || ''}</h3>
        </div>
      </a>
    `).join('');
  }

  const processGrid = document.getElementById('process-grid');
  if (processGrid && Array.isArray(pageContent.process)) {
    processGrid.innerHTML = pageContent.process.map((step) => `
      <div class="process-step">
        <div class="process-num">${step.num || ''}</div>
        <h3>${step.title || ''}</h3>
        <p>${step.text || ''}</p>
      </div>
    `).join('');
  }

  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (testimonialsGrid && Array.isArray(pageContent.testimonials)) {
    testimonialsGrid.innerHTML = pageContent.testimonials.map((item) => `
      <blockquote class="testimonial-card">
        <div class="testimonial-stars" aria-hidden="true">
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
        </div>
        <p>&ldquo;${item.quote || ''}&rdquo;</p>
        <footer><strong>${item.author || ''}</strong> — ${item.role || ''}</footer>
      </blockquote>
    `).join('');
  }

  const photographyServicesGrid = document.getElementById('photography-services-grid');
  if (photographyServicesGrid && Array.isArray(pageContent.services)) {
    const serviceIcons = ['fa-user', 'fa-champagne-glasses', 'fa-store'];
    const glowClasses = ['bg-orange', 'bg-purple', 'bg-cyan'];
    photographyServicesGrid.innerHTML = pageContent.services.map((service, index) => `
      <div class="service-card" id="service-${index + 1}">
        <div class="service-glow-effect ${glowClasses[index] || 'bg-orange'}"></div>
        <div class="service-icon service-icon-gold"><i class="fa-solid ${serviceIcons[index] || 'fa-star'}"></i></div>
        <h3>${service.title || ''}</h3>
        <p>${service.description || ''}</p>
        <ul class="service-features">
          <li><i class="fa-solid fa-check"></i> Studio or On-Location</li>
          <li><i class="fa-solid fa-check"></i> Wardrobe &amp; Styling Guidance</li>
          <li><i class="fa-solid fa-check"></i> High-Resolution Deliverables</li>
        </ul>
      </div>
    `).join('');
  }
};

window.applyKLStudiosContent = function applyKLStudiosContent() {
  const root = window.KLSTUDIOS_CONTENT || {};
  const pageKey = document.body?.dataset?.page || 'home';
  const pageContent = root.pages?.[pageKey] || {};
  const combinedContent = { ...(root.site || {}), ...(pageContent || {}) };

  const resolveValue = (path, fallback = '') => {
    if (!path) return fallback;
    const parts = path.split('.');
    const searchRoots = [];
    if (parts[0] === 'site') {
      searchRoots.push(root.site || {});
      searchRoots.push(pageContent);
    } else {
      searchRoots.push(combinedContent);
      searchRoots.push(root.site || {});
    }

    for (const rootObject of searchRoots) {
      let current = rootObject;
      let found = true;
      for (const part of parts) {
        if (current == null || typeof current !== 'object' || !(part in current)) {
          found = false;
          break;
        }
        current = current[part];
      }
      if (found) return current ?? fallback;
    }

    let current = combinedContent;
    for (const part of parts) {
      if (current == null || typeof current !== 'object') return fallback;
      current = current[part];
    }
    return current ?? fallback;
  };

  document.querySelectorAll('[data-content]').forEach((element) => {
    const path = element.getAttribute('data-content');
    const value = resolveValue(path, element.textContent.trim());
    if (value === '' || value == null) return;
    element.textContent = value;
  });

  document.querySelectorAll('[data-content-html]').forEach((element) => {
    const path = element.getAttribute('data-content-html');
    const value = resolveValue(path, element.innerHTML);
    if (value === '' || value == null) return;
    element.innerHTML = value;
  });

  document.querySelectorAll('[data-content-image]').forEach((element) => {
    const path = element.getAttribute('data-content-image');
    const value = resolveValue(path, element.getAttribute('src'));
    if (value) {
      element.setAttribute('src', value);
      const altPath = element.getAttribute('data-content-image-alt');
      if (altPath) {
        const altValue = resolveValue(altPath, element.getAttribute('alt'));
        if (altValue) element.setAttribute('alt', altValue);
      }
    }
  });

  document.querySelectorAll('[data-content-href]').forEach((element) => {
    const path = element.getAttribute('data-content-href');
    const value = resolveValue(path, element.getAttribute('href'));
    if (value) element.setAttribute('href', value);
  });

  renderContentSections(pageContent, pageKey);

  const pageMeta = pageContent.meta || {};
  if (pageMeta.title) {
    const titleTag = document.querySelector('title');
    if (titleTag) titleTag.textContent = pageMeta.title;
  }
  if (pageMeta.description) {
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.setAttribute('content', pageMeta.description);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.applyKLStudiosContent();
});
