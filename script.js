const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
const root = document.documentElement;

year.textContent = new Date().getFullYear();

const updateScrollBackground = () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  root.style.setProperty('--scroll-y', `${window.scrollY}px`);
  root.style.setProperty('--scroll-progress', scrollProgress.toFixed(4));
};

updateScrollBackground();
window.addEventListener('scroll', updateScrollBackground, { passive: true });
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

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const message = formData.get('message').trim();

  if (!name || !email || !message) {
    formStatus.textContent = 'Please complete all fields before sending.';
    return;
  }

  // GitHub Pages only hosts static files, so this simulates a backend response.
  // Replace this block with a real API endpoint when you deploy a backend service.
  formStatus.textContent = `Thanks, ${name}! Your message is ready to send.`;
  contactForm.reset();
});
