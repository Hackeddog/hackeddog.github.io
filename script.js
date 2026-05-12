const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
const resumeDownloads = document.querySelectorAll('.resume-download');
const starfield = document.querySelector('#starfield');
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

if (starfield && !prefersReducedMotion) {
  const context = starfield.getContext('2d');
  const particles = [];
  const particleCount = 90;
  let width = 0;
  let height = 0;
  let animationFrameId;

  const resizeStarfield = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    starfield.width = width * pixelRatio;
    starfield.height = height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    z: Math.random() * 1.8 + 0.25,
    speed: Math.random() * 0.7 + 0.18,
    size: Math.random() * 1.8 + 0.45,
    hue: Math.random() > 0.72 ? '157, 78, 221' : '0, 245, 255',
  });

  const seedParticles = () => {
    particles.length = 0;
    for (let index = 0; index < particleCount; index += 1) {
      particles.push(createParticle());
    }
  };

  const drawStarfield = () => {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      particle.x += particle.speed * particle.z + Number(root.style.getPropertyValue('--scroll-direction')) * 0.08;
      particle.y += particle.speed * 0.22;

      if (particle.x > width + 24 || particle.y > height + 24) {
        particles[index] = { ...createParticle(), x: -24, y: Math.random() * height };
        return;
      }

      context.beginPath();
      context.fillStyle = `rgba(${particle.hue}, ${0.35 + particle.z * 0.22})`;
      context.shadowColor = `rgba(${particle.hue}, 0.8)`;
      context.shadowBlur = 12;
      context.arc(particle.x, particle.y, particle.size * particle.z, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.strokeStyle = `rgba(${particle.hue}, 0.18)`;
      context.lineWidth = 1;
      context.moveTo(particle.x - particle.speed * 18, particle.y - particle.speed * 5);
      context.lineTo(particle.x, particle.y);
      context.stroke();
    });

    animationFrameId = window.requestAnimationFrame(drawStarfield);
  };

  resizeStarfield();
  seedParticles();
  drawStarfield();

  window.addEventListener('resize', () => {
    window.cancelAnimationFrame(animationFrameId);
    resizeStarfield();
    seedParticles();
    drawStarfield();
  });
}

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

resumeDownloads.forEach((link) => {
  link.addEventListener('click', async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(link.href);
      const resumeBlob = await response.blob();
      const resumeUrl = URL.createObjectURL(resumeBlob);
      const temporaryLink = document.createElement('a');

      temporaryLink.href = resumeUrl;
      temporaryLink.download = link.getAttribute('download') || 'FrancisMickuLamsin_Resume.pdf';
      document.body.appendChild(temporaryLink);
      temporaryLink.click();
      temporaryLink.remove();
      URL.revokeObjectURL(resumeUrl);
    } catch (error) {
      window.location.href = link.href;
    }
  });
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
