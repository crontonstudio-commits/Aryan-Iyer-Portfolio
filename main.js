/* ============================================================
   ARYAN IYER — PORTFOLIO  |  main.js
   Shared script for: index.html, about.html, work.html, contact.html
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. MOBILE NAV — hamburger toggle
  ---------------------------------------------------------- */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when any mobile link is tapped
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  function closeMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ----------------------------------------------------------
     2. HEADER — scroll shadow
  ---------------------------------------------------------- */
  const header = document.getElementById('site-header');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     3. SCROLL-IN ANIMATIONS — .fade-up elements
  ---------------------------------------------------------- */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  /* ----------------------------------------------------------
     4. ACTIVE NAV LINK — highlight current page
  ---------------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     5. WORK PAGE — filter buttons
  ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.filter;
        filterPortfolioCards(category);
      });
    });
  }

  function filterPortfolioCards(category) {
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
      const tag = card.querySelector('.portfolio-tag');
      if (!tag) return;

      const match = !category || category === 'all' || tag.textContent.trim().toLowerCase().includes(category.toLowerCase());

      if (match) {
        card.style.display = '';
        // Re-trigger fade animation
        card.classList.remove('visible');
        void card.offsetWidth; // force reflow
        card.classList.add('visible');
      } else {
        card.style.display = 'none';
      }
    });
  }

  /* ----------------------------------------------------------
     6. CONTACT FORM — submission handler
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const form       = e.currentTarget;
    const submitBtn  = form.querySelector('[type="submit"]');
    const successMsg = document.getElementById('formSuccess');

    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#e05555';
        field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
      }
    });
    if (!valid) return;

    // Simulate async send
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    setTimeout(() => {
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <span>→</span>';
      }
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }
    }, 1200);
  }

  /* ----------------------------------------------------------
     7. SMOOTH SCROLL — in-page anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ----------------------------------------------------------
     8. PORTFOLIO CARD — keyboard accessibility (Enter/Space)
  ---------------------------------------------------------- */
  document.querySelectorAll('.portfolio-card[tabindex="0"]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

})();

/* ----------------------------------------------------------
   CURSOR — re-register hover targets after filter changes
---------------------------------------------------------- */
function registerCursorHovers() {
  const hoverSel = 'a, button, .portfolio-card, .service-card, .svc-card, .filter-btn, .skill-tag, .stat-item, .faq-item, input, textarea, select';
  document.querySelectorAll(hoverSel).forEach(el => {
    if (el.dataset.cursorBound) return;
    el.dataset.cursorBound = '1';
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}
document.addEventListener('DOMContentLoaded', registerCursorHovers);
