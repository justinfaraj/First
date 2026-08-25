// ---------- SHARED NAV + FOOTER (single source of truth) ----------
// Injected into every page via #site-nav / #site-footer placeholders so
// future section additions only need to change the NAV_GROUPS list here.

const NAV_GROUPS = [
  {
    label: 'Home',
    items: [
      { text: 'Meet Meaghan', section: 'about-meaghan' },
    ],
  },
  {
    label: 'About',
    items: [
      { text: "Meaghan's Story", href: 'about-meaghan.html' },
      { text: 'Testimonials', href: '#' },
      { text: 'Documents', href: '#' },
    ],
  },
  {
    label: 'Contact',
    items: [
      { text: 'Book a Session', href: 'book-a-session.html' },
      { text: 'Send a Message', href: '#' },
      { text: 'FAQ', href: '#' },
    ],
  },
];

// A "section" link scrolls within the current page if that section
// exists here, otherwise it navigates to the homepage and scrolls there.
// window.SITE_HOME_PAGE lets a page override the homepage URL (e.g. a
// hosted preview where "index.html" isn't a real sibling file); it
// defaults to the normal relative link used on the live site.
function resolveHref(item) {
  if (item.href) return item.href;
  const onThisPage = document.getElementById(item.section);
  const homePage = window.SITE_HOME_PAGE || 'index.html';
  return onThisPage ? `#${item.section}` : `${homePage}#${item.section}`;
}

function renderNav() {
  const dropdowns = NAV_GROUPS.map((group) => `
    <div class="menu-col dropdown">
      <button class="dropdown-toggle" type="button" aria-expanded="false">
        ${group.label}
        <svg class="chev" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <ul class="dropdown-panel">
        ${group.items.map((item) => `<li><a href="${resolveHref(item)}">${item.text}</a></li>`).join('')}
      </ul>
    </div>
  `).join('');

  const mobileGroups = NAV_GROUPS.map((group) => `
    <h4>${group.label}</h4>
    <ul>
      ${group.items.map((item) => `<li><a href="${resolveHref(item)}">${item.text}</a></li>`).join('')}
    </ul>
  `).join('');

  return `
    <div class="mobile-nav">
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
      <nav class="mobile-menu" id="mobile-menu" hidden>
        ${mobileGroups}
      </nav>
    </div>

    <nav class="corner-menu" aria-label="Primary">
      ${dropdowns}
    </nav>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="site-footer-inner">
        <p class="footer-copyright">Copyright &copy; 2025 Eagle Point Coaching LLC. All Rights Reserved.</p>
        <p class="footer-credit">Website developed by Justin Farajollah. Email <a href="mailto:farajollahjustin@gmail.com" class="footer-link">farajollahjustin@gmail.com</a> to make your website vision a reality.</p>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const navSlot = document.getElementById('site-nav');
  if (navSlot) navSlot.innerHTML = renderNav();

  const footerSlot = document.getElementById('site-footer');
  if (footerSlot) footerSlot.innerHTML = renderFooter();

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
