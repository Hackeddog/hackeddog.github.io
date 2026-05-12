const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
const root = document.documentElement;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastScrollY = window.scrollY;
let ticking = false;

year.textContent = new Date().getFullYear();

const updateScrollBackground = () => {
  const currentScrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollProgress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
  const direction = currentScrollY >= lastScrollY ? 1 : -1;

  root.style.setProperty('--scroll-y', `${currentScrollY}px`);
  root.style.setProperty('--scroll-progress', scrollProgress.toFixed(4));
  root.style.setProperty('--scroll-direction', direction);
  document.body.classList.toggle('scrolling-down', direction === 1);
  document.body.classList.toggle('scrolling-up', direction === -1);

  lastScrollY = Math.max(currentScrollY, 0);
  ticking = false;
};

const requestScrollUpdate = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollBackground);
    ticking = true;
  }
};

updateScrollBackground();
window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', updateScrollBackground);

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('show');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    navLinks.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

const revealElements = document.querySelectorAll('.section, .card, .hero-content, .section-header');

revealElements.forEach((element, index) => {
  element.classList.add('reveal');
  element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 90}ms`);
});

if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

contactForm.addEventListener('submit', () => {
  formStatus.textContent = 'Sending your message to mickulms.7@gmail.com...';
});
