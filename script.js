/**
 * THE MAGICK MUSE — Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     NAVIGATION — Mobile Toggle
     ============================================ */

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav') && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================
     NAVIGATION — Active Link State
     ============================================ */

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ============================================
     SCROLL — Sticky Nav Shadow
     ============================================ */

  const nav = document.querySelector('.nav');
  if (nav) {
    const handleScroll = () => {
      nav.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(44, 24, 16, 0.1)'
        : '';
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ============================================
     SCROLL — Reveal on Scroll
     ============================================ */

  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  }

  /* ============================================
     SMOOTH ANCHOR SCROLL
     ============================================ */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const navH = document.querySelector('.nav')?.offsetHeight || 72;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     GRIMOIRE CARDS — hover tooltip (optional)
     ============================================ */

  // Cards already have CSS transitions; no JS needed unless tooltips are added later.

  /* ============================================
     SCREENSHOT CAROUSEL
     ============================================ */

  const carouselEl = document.querySelector('#manuscript-carousel');
  if (carouselEl) {
    const track    = carouselEl.querySelector('.carousel-track');
    const slides   = carouselEl.querySelectorAll('.carousel-slide');
    const prevBtn  = carouselEl.querySelector('.carousel-prev');
    const nextBtn  = carouselEl.querySelector('.carousel-next');
    const dotsWrap = carouselEl.querySelector('.carousel-dots');

    let current = 0;
    const total = slides.length;

    // Build dot navigation
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1} of ${total}`);
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Keyboard navigation
    carouselEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    });

    // Touch / swipe support
    let touchStartX = 0;
    carouselEl.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carouselEl.addEventListener('touchend', (e) => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 44) goTo(current + (delta > 0 ? 1 : -1));
    }, { passive: true });
  }

});
