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

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  window.location.href = `mailto:mickulms.7@gmail.com?subject=${subject}&body=${body}`;
  formStatus.textContent = `Thanks, ${name}! Your email app should open with the message addressed to mickulms.7@gmail.com.`;
  contactForm.reset();
});
