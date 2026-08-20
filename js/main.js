/* =========================================================
   衛藤仁胡 | Eto Niko — interactions
   ========================================================= */

/* ---- 運営設定: 公開前にここを実URLに差し替える ---- */
const CONFIG = {
  shopUrl: '',       // 例: 'https://xxxx.thebase.in'  (BASEショップURL)
  instagramUrl: '',  // 例: 'https://www.instagram.com/xxxx/'
};

document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---- external links ---- */
  document.querySelectorAll('[data-shop-link]').forEach(a => {
    if (CONFIG.shopUrl) { a.href = CONFIG.shopUrl; a.target = '_blank'; a.rel = 'noopener'; }
  });
  document.querySelectorAll('[data-instagram-link]').forEach(a => {
    if (CONFIG.instagramUrl) { a.href = CONFIG.instagramUrl; a.target = '_blank'; a.rel = 'noopener'; }
    else a.href = '#contact';
  });

  /* ---- text preparation: line masks & char splitting ---- */
  document.querySelectorAll('[data-anim="lines"] .line').forEach(line => {
    const inner = document.createElement('span');
    inner.className = 'line-inner';
    while (line.firstChild) inner.appendChild(line.firstChild);
    line.appendChild(inner);
  });

  const heroName = document.getElementById('heroName');
  if (heroName) {
    const text = heroName.textContent;
    heroName.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      s.style.transitionDelay = `${1100 + i * 120}ms`;
      heroName.appendChild(s);
    });
    requestAnimationFrame(() => requestAnimationFrame(() =>
      heroName.classList.add('chars-in')));
  }

  /* ---- loading veil ---- */
  const veil = document.getElementById('veil');
  window.setTimeout(() => veil.classList.add('off'), prefersReduced ? 200 : 1500);

  /* ---- header: shrink + hide on scroll down ---- */
  const header = document.getElementById('siteHeader');
  let lastY = window.scrollY;
  const onScrollHeader = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    if (!document.body.classList.contains('nav-open')) {
      header.classList.toggle('hidden', y > 500 && y > lastY + 4);
    }
    if (y < lastY - 4 || y <= 500) header.classList.remove('hidden');
    lastY = y;
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---- mobile nav ---- */
  const burger = document.getElementById('navBurger');
  burger.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  document.querySelectorAll('.site-nav a').forEach(a =>
    a.addEventListener('click', () => document.body.classList.remove('nav-open')));

  /* ---- 動/静 toggle ---- */
  const toggle = document.getElementById('motionToggle');
  const applyStill = (still) => {
    document.body.classList.toggle('still', still);
    toggle.setAttribute('aria-pressed', String(still));
    try { localStorage.setItem('niko-still', still ? '1' : '0'); } catch (e) {}
  };
  toggle.addEventListener('click', () =>
    applyStill(!document.body.classList.contains('still')));
  let saved = null;
  try { saved = localStorage.getItem('niko-still'); } catch (e) {}
  if (saved === '1' || (saved === null && prefersReduced)) applyStill(true);

  /* ---- entrance animations ---- */
  const staggerGroups = new Map(); // container -> counter (for grid stagger)
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      // grid items: stagger by arrival order within their parent
      if (el.dataset.anim === 'up' && el.parentElement.classList.contains('col-grid')) {
        const parent = el.parentElement;
        const n = staggerGroups.get(parent) || 0;
        el.style.setProperty('--d', `${(n % 4) * 90}ms`);
        staggerGroups.set(parent, n + 1);
        window.setTimeout(() => staggerGroups.set(parent, 0), 400);
      } else if (el.dataset.delay) {
        el.style.setProperty('--d', `${el.dataset.delay}ms`);
      }
      el.classList.add('in');
      revealObs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('[data-anim]').forEach(el => revealObs.observe(el));

  /* ---- parallax (hero photo, kanji watermarks, about photo) ---- */
  const pxEls = document.querySelectorAll('[data-parallax]');
  const kanjiStages = document.querySelectorAll('.stage');
  let ticking = false;
  const parallax = () => {
    ticking = false;
    if (document.body.classList.contains('still') || prefersReduced) return;
    const vh = window.innerHeight;
    pxEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translateY(${p * parseFloat(el.dataset.parallax) * -160}px)`;
    });
    kanjiStages.forEach(st => {
      const r = st.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      st.style.setProperty('--ky', `${p * 60}px`);
    });
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
  }, { passive: true });
  parallax();

  /* ---- custom cursor ---- */
  const cursor = document.getElementById('cursor');
  const cursorLabel = cursor.querySelector('.cursor-label');
  if (!isTouch && !prefersReduced) {
    let cx = -100, cy = -100, tx = -100, ty = -100, cursorOn = false;
    document.addEventListener('mousemove', (ev) => {
      tx = ev.clientX; ty = ev.clientY;
      if (!cursorOn) { cursorOn = true; cursor.classList.add('on'); cx = tx; cy = ty; }
    });
    document.addEventListener('mouseleave', () => { cursorOn = false; cursor.classList.remove('on'); });
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const mode = el.getAttribute('data-cursor');
        if (mode === 'view') { cursor.classList.add('view'); cursorLabel.textContent = 'VIEW'; }
        else cursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('view', 'hover');
        cursorLabel.textContent = '';
      });
    });
  }

  /* ---- magnetic buttons ---- */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = 0.25;
      el.addEventListener('mousemove', (ev) => {
        if (document.body.classList.contains('still')) return;
        const r = el.getBoundingClientRect();
        const dx = ev.clientX - (r.left + r.width / 2);
        const dy = ev.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
        el.style.transform = '';
        window.setTimeout(() => { el.style.transition = ''; }, 600);
      });
    });
  }

  /* ---- subtle 3D tilt on stage artworks ---- */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', (ev) => {
        if (document.body.classList.contains('still')) return;
        const r = el.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width - 0.5;
        const py = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 5}deg) rotateX(${py * -5}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), box-shadow .8s';
        el.style.transform = '';
        window.setTimeout(() => { el.style.transition = ''; }, 800);
      });
    });
  }

  /* ---- lightbox ---- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbNote = document.getElementById('lbNote');
  const lbPrice = document.getElementById('lbPrice');

  const openLb = (a) => {
    lbImg.src = a.getAttribute('href');
    lbImg.alt = a.dataset.title || '';
    lbTitle.textContent = a.dataset.title || '';
    lbNote.textContent = a.dataset.note || '';
    lbPrice.textContent = a.dataset.price || '';
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('on'));
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    lb.classList.remove('on');
    document.body.style.overflow = '';
    window.setTimeout(() => { lb.hidden = true; lbImg.src = ''; }, 500);
  };
  document.querySelectorAll('.zoomable').forEach(a => {
    a.addEventListener('click', (ev) => { ev.preventDefault(); openLb(a); });
  });
  document.getElementById('lbClose').addEventListener('click', closeLb);
  lb.addEventListener('click', (ev) => { if (ev.target === lb) closeLb(); });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !lb.hidden) closeLb();
  });
});
