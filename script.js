document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.body.classList.add('reduced-motion');
  }

  // Vertical edge label tracks whichever section is currently in view
  const sectionLabel = document.getElementById('section-label');
  const sections = document.querySelectorAll('[data-label]');
  if (sectionLabel && sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sectionLabel.textContent = entry.target.dataset.label;
          sectionLabel.classList.toggle('on-dark', entry.target.classList.contains('section-dark'));
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  // Corner-menu dropdowns
  const dropdowns = document.querySelectorAll('.corner-menu .dropdown');
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    toggle.addEventListener('click', () => {
      const wasOpen = dropdown.classList.contains('open');
      dropdowns.forEach((d) => {
        d.classList.remove('open');
        d.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        dropdown.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.corner-menu .dropdown')) {
      dropdowns.forEach((d) => {
        d.classList.remove('open');
        d.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Hamburger menu (narrow screens)
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.hasAttribute('hidden');
      if (isOpen) {
        mobileMenu.setAttribute('hidden', '');
      } else {
        mobileMenu.removeAttribute('hidden');
      }
      navToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.setAttribute('hidden', '');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.hasAttribute('hidden') && !e.target.closest('.mobile-nav')) {
        mobileMenu.setAttribute('hidden', '');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
