/**
 * DECORNEST PAKISTAN - MAIN JAVASCRIPT
 * Handles navigation, mobile menu, search filters, form validation,
 * image lightbox, and reading progress.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initActiveNav();
  initBackToTop();
  initBlogSearchAndFilter();
  initLightbox();
  initForms();
  initReadingProgressBar();
  initShareButtons();
});

/* --------------------------------------------------------------------------
   1. Sticky Header
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileBackdrop');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Close drawer on clicking any link inside
  const links = drawer.querySelectorAll('a');
  links.forEach(link => link.addEventListener('click', closeDrawer));
}

/* --------------------------------------------------------------------------
   3. Active Nav Link Auto-Highlight
   -------------------------------------------------------------------------- */
function initActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkFile = href.substring(href.lastIndexOf('/') + 1);

    // Exact file match or homepage root match
    if (linkFile === currentFile || (currentFile === '' && linkFile === 'index.html') || (currentFile === 'index.html' && href.endsWith('index.html'))) {
      link.classList.add('active');
    } else if (currentPath.includes('/blogs/') && (linkFile === 'blog.html' || href.includes('blog.html'))) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   4. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   5. Blog Search & Category Filters
   -------------------------------------------------------------------------- */
function initBlogSearchAndFilter() {
  const searchInput = document.getElementById('blogSearchInput');
  const filterPills = document.querySelectorAll('.filter-pill');
  const blogCards = document.querySelectorAll('.blog-search-item');
  const noResultsMsg = document.getElementById('blogNoResults');

  if (!blogCards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  const filterCards = () => {
    let visibleCount = 0;

    blogCards.forEach(card => {
      const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
      const cardTitle = (card.querySelector('.blog-card-title')?.textContent || '').toLowerCase();
      const cardExcerpt = (card.querySelector('.blog-card-excerpt')?.textContent || '').toLowerCase();

      const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
      const matchesSearch = (searchTerm === '' || cardTitle.includes(searchTerm) || cardExcerpt.includes(searchTerm));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      filterCards();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = (pill.getAttribute('data-filter') || 'all').toLowerCase();
      filterCards();
    });
  });
}

/* --------------------------------------------------------------------------
   6. Image Lightbox
   -------------------------------------------------------------------------- */
function initLightbox() {
  let modal = document.getElementById('lightboxModal');

  // Create modal dynamically if not present in HTML
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'lightboxModal';
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" id="lightboxClose" aria-label="Close modal">&times;</button>
        <img src="" alt="Enlarged Decor View" class="lightbox-img" id="lightboxImg">
        <div class="lightbox-caption" id="lightboxCaption"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  const openLightbox = (imgSrc, captionText) => {
    if (!lightboxImg || !modal) return;
    lightboxImg.src = imgSrc;
    if (lightboxCaption) lightboxCaption.textContent = captionText || 'DecorNest Pakistan Interior Inspiration';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Attach to gallery items
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-overlay h5')?.textContent || img?.alt;
      if (img) openLightbox(img.src, caption);
    });
  });
}

/* --------------------------------------------------------------------------
   7. Forms (Contact & Newsletter Demonstration)
   -------------------------------------------------------------------------- */
function initForms() {
  // Contact Form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');

      let isValid = true;

      // Validation
      if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'Please enter your name');
        isValid = false;
      } else {
        clearFieldError(nameInput);
      }

      if (!isValidEmail(emailInput.value.trim())) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
      } else {
        clearFieldError(emailInput);
      }

      if (!subjectInput.value.trim()) {
        showFieldError(subjectInput, 'Please enter a subject');
        isValid = false;
      } else {
        clearFieldError(subjectInput);
      }

      if (!messageInput.value.trim()) {
        showFieldError(messageInput, 'Please enter your message');
        isValid = false;
      } else {
        clearFieldError(messageInput);
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Message...';

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
          showToast('Thank you! Your message was submitted successfully. (Frontend Demo - Academic Evaluation)');
        }, 800);
      }
    });
  }

  // Newsletter Forms
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (!input || !isValidEmail(input.value.trim())) {
        showToast('Please enter a valid email address.');
        return;
      }

      const btn = form.querySelector('button');
      const origText = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subscribing...';
      }

      setTimeout(() => {
        input.value = '';
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = origText;
        }
        showToast('Subscribed! Welcome to DecorNest Pakistan Inspiration Letters (Frontend Demo).');
      }, 700);
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(input, msg) {
  input.style.borderColor = '#C0392B';
  let feedback = input.nextElementSibling;
  if (!feedback || !feedback.classList.contains('form-feedback')) {
    feedback = document.createElement('div');
    feedback.className = 'form-feedback is-error';
    input.parentNode.appendChild(feedback);
  }
  feedback.textContent = msg;
  feedback.className = 'form-feedback is-error';
}

function clearFieldError(input) {
  input.style.borderColor = '';
  const feedback = input.parentNode.querySelector('.form-feedback');
  if (feedback) {
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  }
}

/* --------------------------------------------------------------------------
   8. Toast Notification Utility
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>🌿</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* --------------------------------------------------------------------------
   9. Reading Progress Bar for Blog Posts
   -------------------------------------------------------------------------- */
function initReadingProgressBar() {
  const progressBar = document.querySelector('.reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const docElem = document.documentElement;
    const docBody = document.body;
    const scrollTop = docElem['scrollTop'] || docBody['scrollTop'];
    const scrollBottom = (docElem['scrollHeight'] || docBody['scrollHeight']) - window.innerHeight;
    const scrollPercent = scrollBottom > 0 ? (scrollTop / scrollBottom) * 100 : 0;

    progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   10. Share Button
   -------------------------------------------------------------------------- */
function initShareButtons() {
  const shareButtons = document.querySelectorAll('.btn-share-article');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Article link copied to clipboard!');
        }).catch(() => {
          showToast('Article URL: ' + window.location.href);
        });
      } else {
        showToast('Article URL: ' + window.location.href);
      }
    });
  });
}

