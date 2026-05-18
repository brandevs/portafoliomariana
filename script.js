/**
 * MARIANA FITNESS — script.js
 * Funcionalidades:
 *  - Scroll suave (nativo via CSS + fallback JS)
 *  - Navbar: fondo al scroll + active link
 *  - Menú hamburger mobile
 *  - Animaciones scroll reveal (IntersectionObserver)
 *  - Botón "Volver arriba"
 */

'use strict';

/* ============================================================
   1. NAVBAR — fondo al hacer scroll
   ============================================================ */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // llamar al cargar por si ya hay scroll


/* ============================================================
   2. NAVBAR — link activo según sección visible
   ============================================================ */
const sections      = document.querySelectorAll('section[id], header[id]');
const navLinks      = document.querySelectorAll('.navbar__link');
const sectionIds    = ['inicio', 'sobre', 'mision', 'servicios', 'planes', 'contacto'];

function updateActiveLink() {
  let currentId = '';
  const scrollMid = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollMid >= top && scrollMid < bottom) {
      currentId = section.id;
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === currentId);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


/* ============================================================
   3. HAMBURGER MENU — mobile
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  // Evitar scroll del body cuando el menú está abierto
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Cerrar menú al hacer click en un link
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

// Cerrar al hacer click fuera
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* ============================================================
   4. SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Una vez visible, dejamos de observar (la animación ya se disparó)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,       // 12% del elemento visible dispara la animación
    rootMargin: '0px 0px -60px 0px'
  }
);

// Observar todos los elementos con clase .reveal
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


/* ============================================================
   5. BOTÓN VOLVER ARRIBA
   ============================================================ */
const backToTopBtn = document.getElementById('back-to-top');

function handleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', handleBackToTop, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   6. SCROLL SUAVE — fallback para browsers sin soporte nativo
   ============================================================ */
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  // Si el browser soporta scroll-behavior: smooth (ya manejado por CSS)
  if ('scrollBehavior' in document.documentElement.style) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Fallback manual
  const targetTop  = target.getBoundingClientRect().top + window.scrollY - 70;
  const startTop   = window.scrollY;
  const distance   = targetTop - startTop;
  const duration   = 700;
  let startTime    = null;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startTop + distance * easeInOutQuad(progress));
    if (elapsed < duration) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Interceptar todos los enlaces ancla del documento
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const targetId = href.slice(1);
    const target   = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      smoothScrollTo(targetId);
    }
  });
});


/* ============================================================
   7. ANIMACIÓN DE CONTADOR (stats opcionales, futuro uso)
   ============================================================ */
function animateCounter(el, end, duration = 1500) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * end);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = end;
  };
  requestAnimationFrame(step);
}

// Activar contadores cuando son visibles (si los hay en el HTML)
document.querySelectorAll('[data-count]').forEach(counter => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      animateCounter(counter, parseInt(counter.dataset.count));
      observer.disconnect();
    }
  }, { threshold: 0.5 });
  observer.observe(counter);
});


/* ============================================================
   8. PARALLAX SUAVE en el hero
   ============================================================ */
const heroImg = document.querySelector('.hero__img');

function handleParallax() {
  if (!heroImg || window.innerWidth < 768) return;
  const scrolled = window.scrollY;
  // Mueve la imagen de forma sutil
  heroImg.style.transform = `translateY(${scrolled * 0.15}px)`;
}

window.addEventListener('scroll', handleParallax, { passive: true });


/* ============================================================
   9. EFECTO HOVER en plan cards — resaltar el label
   ============================================================ */
document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.plan-card__label').style.background = '#aa00aa';
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.plan-card__label').style.background = '';
  });
});


/* ============================================================
   10. INIT — marcar elementos ya visibles al cargar la página
   ============================================================ */
(function init() {
  // Si la página se cargó con scroll (link externo con hash), revelar de inmediato
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add('visible');
    }
  });

  // Log de carga exitosa en consola (útil en dev)
  console.log('%cMariana Fitness 💪 — JS cargado correctamente', 'color:#cc00cc; font-weight:bold; font-size:14px;');
})();
