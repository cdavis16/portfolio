/* ============================================================
   CLAIRE DAVIS — PORTFOLIO
   Interactions & Animations
   ============================================================ */

(function () {
  'use strict';

  /* ── Page Mask ──────────────────────────────────────────────── */
  const mask = document.createElement('div');
  mask.className = 'page-mask';
  document.body.appendChild(mask);

  window.addEventListener('load', () => {
    setTimeout(() => {
      mask.style.pointerEvents = 'none';
    }, 900);
  });

  /* ── Custom Cursor ───────────────────────────────────────────── */
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.innerHTML = '<div class="cursor__ring"></div><div class="cursor__dot"></div>';
  document.body.appendChild(cursor);

  const dot  = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state
  const hoverTargets = 'a, button, [data-cursor-hover]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  /* ── Nav Scroll State ─────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Nav Dropdown Toggle ────────────────────────────────────── */
  const navToggle = document.querySelector('.nav__toggle');
  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('dropdown-open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        nav.classList.remove('dropdown-open');
      }
    });

    // Close dropdown when a link is clicked
    const dropdownLinks = nav.querySelectorAll('.nav__dropdown a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('dropdown-open');
      });
    });
  }

  /* ── Scroll Reveal ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Project Row Hover Preview ────────────────────────────────── */
  const projectRows = document.querySelectorAll('.project-row[data-preview]');

  projectRows.forEach(row => {
    const previewId = row.dataset.preview;
    const preview   = document.getElementById(previewId);
    if (!preview) return;

    row.addEventListener('mouseenter', () => {
      preview.classList.add('visible');
    });

    row.addEventListener('mouseleave', () => {
      preview.classList.remove('visible');
    });

    document.addEventListener('mousemove', (e) => {
      if (preview.classList.contains('visible')) {
        const x = e.clientX + 24;
        const y = e.clientY - preview.offsetHeight / 2;
        const maxX = window.innerWidth  - preview.offsetWidth  - 16;
        const maxY = window.innerHeight - preview.offsetHeight - 16;
        preview.style.left = Math.min(x, maxX) + 'px';
        preview.style.top  = Math.max(16, Math.min(y, maxY)) + 'px';
      }
    });
  });

  /* ── Page Transition ──────────────────────────────────────────── */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
    if (link.target === '_blank') return;

    e.preventDefault();

    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff';
    const exitMask = document.createElement('div');
    exitMask.style.cssText = `
      position: fixed; inset: 0;
      background: ${bg};
      z-index: 9000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s cubic-bezier(0.4, 0, 1, 1);
    `;
    document.body.appendChild(exitMask);

    requestAnimationFrame(() => {
      exitMask.style.opacity = '1';
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });

  /* ── Marquee pause on hover ───────────────────────────────────── */
  const marquee = document.querySelector('.marquee-track');
  if (marquee) {
    marquee.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
    });
    marquee.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  }

  /* ── Scroll Progress (project pages) ─────────────────────────── */
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const h   = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      progressBar.style.transform = `scaleX(${pct / 100})`;
    }, { passive: true });
  }

  /* ── Stagger children ─────────────────────────────────────────── */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

})();
