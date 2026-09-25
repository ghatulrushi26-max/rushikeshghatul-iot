/**
 * ==============================================================================
 * RUSHIKESH D. GHATUL - PORTFOLIO INTERACTIVE LOGIC
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initProjects();
  initCertificates();
  initModal();
  initContactForm();
  initBackToTop();
});

/* ==============================================================================
   1. THEME SWITCHER (Dark / Light)
   ============================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} mode`);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'fas fa-moon';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      themeIcon.className = 'fas fa-sun';
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }
}

/* ==============================================================================
   2. STICKY NAVBAR, SCROLLSPY & MOBILE MENU
   ============================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navLinksContainer = document.querySelector('.nav-links');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile menu toggle
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ScrollSpy & Sticky Navbar
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Add shadow class to navbar on scroll
    if (scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        currentSectionId = sectionId;
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ==============================================================================
   3. PROJECTS DYNAMIC RENDERING & FILTERING
   ============================================================================== */
function initProjects() {
  const container = document.getElementById('projects-container');
  const filterBtns = document.querySelectorAll('.project-filter-btn');

  if (!container || !window.projectsData) return;

  function renderProjects(category = 'all') {
    container.innerHTML = '';
    const filtered = category === 'all'
      ? window.projectsData
      : window.projectsData.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fas fa-folder-open" style="font-size: 2.5rem; margin-bottom: 12px; display: block; color: var(--accent-cyan);"></i>
          <p>No projects found in this category.</p>
        </div>`;
      return;
    }

    filtered.forEach(project => {
      const card = document.createElement('article');
      card.className = 'project-card';

      // GitHub link button
      let githubBtn = `<span class="btn-coming-soon"><i class="fab fa-github"></i> Code Coming Soon</span>`;
      if (project.githubUrl) {
        githubBtn = `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm"><i class="fab fa-github"></i> GitHub</a>`;
      }

      // Live Demo link button
      let demoBtn = `<span class="btn-coming-soon"><i class="fas fa-external-link-alt"></i> Demo Coming Soon</span>`;
      if (project.liveDemoUrl) {
        demoBtn = `<a href="${project.liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
      }

      const techBadges = project.technologies
        ? project.technologies.map(t => `<span class="tech-pill">${t}</span>`).join('')
        : '';

      card.innerHTML = `
        <div class="project-thumb">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
          <span class="project-category-badge">${project.category}</span>
        </div>
        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.description}</p>
          ${project.contribution ? `
            <div class="project-contribution">
              <strong><i class="fas fa-code-branch"></i> My Contribution</strong>
              ${project.contribution}
            </div>` : ''}
          <div class="project-techs">${techBadges}</div>
          <div class="project-links">
            ${githubBtn}
            ${demoBtn}
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // Initial render
  renderProjects('all');

  // Filter button click events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderProjects(cat);
    });
  });
}

/* ==============================================================================
   4. CERTIFICATES GALLERY & DYNAMIC CATEGORY FILTERING
   ============================================================================== */
function initCertificates() {
  const container = document.getElementById('certificates-container');
  const filterBtns = document.querySelectorAll('.cert-filter-btn');

  if (!container || !window.certificatesData) return;

  function renderCertificates(selectedCategory = 'all') {
    container.innerHTML = '';

    const list = selectedCategory === 'all'
      ? window.certificatesData
      : window.certificatesData.filter(c => {
          const itemCat = (c.category || '').toLowerCase().trim();
          const targetCat = selectedCategory.toLowerCase().trim();
          return itemCat === targetCat || itemCat.includes(targetCat);
        });

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fas fa-certificate" style="font-size: 2.5rem; margin-bottom: 14px; display: block; color: var(--accent-amber);"></i>
          <h4 style="color: var(--text-primary); margin-bottom: 8px;">No certificates currently listed in this category</h4>
          <p style="font-size: 0.9rem;">You can easily add new certificates by appending them to <code style="color: var(--accent-cyan);">js/certificates.js</code></p>
        </div>`;
      return;
    }

    list.forEach(cert => {
      const card = document.createElement('article');
      card.className = 'certificate-card';

      const isPdf = cert.file.toLowerCase().endsWith('.pdf');
      const fileTypeIcon = isPdf ? 'fa-file-pdf' : 'fa-image';

      card.innerHTML = `
        <div class="cert-thumbnail-wrap" data-file="${cert.file}" data-title="${cert.title}" data-org="${cert.organization}" data-type="${isPdf ? 'pdf' : 'image'}">
          <img src="${cert.image || cert.file}" alt="${cert.title}" loading="lazy">
          <span class="cert-category-tag">${cert.category}</span>
          <span class="cert-type-indicator" title="${isPdf ? 'PDF Document' : 'Image File'}">
            <i class="fas ${fileTypeIcon}"></i>
          </span>
        </div>
        <div class="cert-body">
          <h3 class="cert-title">${cert.title}</h3>
          <div class="cert-org"><i class="fas fa-building"></i> ${cert.organization}</div>
          <div class="cert-date"><i class="far fa-calendar-alt"></i> ${cert.date}</div>
          ${cert.description ? `<p class="cert-description">${cert.description}</p>` : ''}
          <div class="cert-actions">
            <button type="button" class="btn btn-primary btn-sm view-cert-btn" 
              data-file="${cert.file}" 
              data-title="${cert.title}" 
              data-org="${cert.organization}"
              data-type="${isPdf ? 'pdf' : 'image'}">
              <i class="fas fa-eye"></i> View Certificate
            </button>
            <a href="${cert.file}" download class="btn btn-secondary btn-sm" title="Download Certificate">
              <i class="fas fa-download"></i> Download
            </a>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Attach click triggers to thumbnails and view buttons
    container.querySelectorAll('.view-cert-btn, .cert-thumbnail-wrap').forEach(el => {
      el.addEventListener('click', (e) => {
        // Prevent click if clicking the download button
        if (e.target.closest('a[download]')) return;

        const file = el.getAttribute('data-file');
        const title = el.getAttribute('data-title');
        const org = el.getAttribute('data-org');
        const type = el.getAttribute('data-type');
        openModal({ file, title, org, type });
      });
    });
  }

  // Initial render
  renderCertificates('all');

  // Filter button events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderCertificates(cat);
    });
  });
}

/* ==============================================================================
   5. LIGHTBOX / MODAL VIEWER (Supports PDF & Images)
   ============================================================================== */
let modalState = {
  isOpen: false,
  currentFile: ''
};

function initModal() {
  const modal = document.getElementById('media-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-body-content');
  const downloadBtn = document.getElementById('modal-download-btn');
  const openExternalBtn = document.getElementById('modal-external-btn');

  if (!modal) return;

  function closeModal() {
    modal.classList.remove('active');
    modalState.isOpen = false;
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalState.isOpen) {
      closeModal();
    }
  });

  // Global openModal function
  window.openModal = function({ file, title, org, type }) {
    const modalTitle = document.getElementById('modal-item-title');
    const modalOrg = document.getElementById('modal-item-org');

    if (modalTitle) modalTitle.textContent = title;
    if (modalOrg) modalOrg.textContent = org;
    if (downloadBtn) downloadBtn.setAttribute('href', file);
    if (openExternalBtn) openExternalBtn.setAttribute('href', file);

    modalBody.innerHTML = '';

    if (type === 'image' || (!type && !file.toLowerCase().endsWith('.pdf'))) {
      const img = document.createElement('img');
      img.src = file;
      img.alt = title;
      img.className = 'modal-preview-media';
      modalBody.appendChild(img);
    } else {
      // PDF Document: Provide direct responsive iframe and quick new-tab preview button
      modalBody.innerHTML = `
        <div style="width: 100%; text-align: center; margin-bottom: 14px;">
          <iframe src="${file}" class="modal-iframe" title="${title}"></iframe>
          <p style="margin-top: 10px; font-size: 0.85rem; color: var(--text-muted);">
            If the PDF preview does not display inside your browser, click 
            <a href="${file}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-cyan); text-decoration: underline;">
              Open in New Tab
            </a>
          </p>
        </div>
      `;
    }

    modal.classList.add('active');
    modalState.isOpen = true;
    modalState.currentFile = file;
    document.body.style.overflow = 'hidden';
  };
}

/* ==============================================================================
   6. CONTACT FORM (Client-side Mailto & Extensible Formspree Option)
   ============================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in your name, email, and message.', 'error');
      return;
    }

    // Default Email Recipient (Editable in placeholder)
    const recipientEmail = 'rushikesh.ghatul@example.com'; // User can replace with personal email
    const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject || 'Contact from ' + name}`);
    const emailBody = encodeURIComponent(
      `Hello Rushikesh,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent from your portfolio website.`
    );

    const mailtoUrl = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;

    // Open default mail client
    window.location.href = mailtoUrl;

    showToast('Opening your email client to send message...');
    form.reset();
  });
}

/* ==============================================================================
   7. BACK TO TOP BUTTON
   ============================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==============================================================================
   8. TOAST NOTIFICATION HELPER
   ============================================================================== */
function showToast(message, type = 'info') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Copy to clipboard utility (for email or phone)
window.copyToClipboard = function(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${label || text} to clipboard!`);
  }).catch(() => {
    showToast(`Could not copy automatically. Text: ${text}`);
  });
};
