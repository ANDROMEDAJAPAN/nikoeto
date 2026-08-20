/* =========================================================
   衛藤仁胡 | Eto Niko — interactions
   ========================================================= */

/* ---- 運営設定: 公開前にここを実URLに差し替える ---- */
const CONFIG = {
  shopUrl: '',       // 例: 'https://xxxx.thebase.in'  (BASEショップURL)
  instagramUrl: '',  // 例: 'https://www.instagram.com/xxxx/'
};

document.addEventListener('DOMContentLoaded', () => {

  /* ---- external links ---- */
  document.querySelectorAll('[data-shop-link]').forEach(a => {
    if (CONFIG.shopUrl) { a.href = CONFIG.shopUrl; a.target = '_blank'; a.rel = 'noopener'; }
  });
  document.querySelectorAll('[data-instagram-link]').forEach(a => {
    if (CONFIG.instagramUrl) { a.href = CONFIG.instagramUrl; a.target = '_blank'; a.rel = 'noopener'; }
    else a.href = '#contact';
  });

  /* ---- loading veil ---- */
  const veil = document.getElementById('veil');
  window.setTimeout(() => veil.classList.add('off'), 1400);

  /* ---- header ---- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav ---- */
  const burger = document.getElementById('navBurger');
  burger.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  document.querySelectorAll('.site-nav a').forEach(a =>
    a.addEventListener('click', () => document.body.classList.remove('nav-open')));

  /* ---- 動/静 toggle ---- */
  const toggle = document.getElementById('motionToggle');
  const videos = () => document.querySelectorAll('.motion-item video');
  const applyStill = (still) => {
    document.body.classList.toggle('still', still);
    toggle.setAttribute('aria-pressed', String(still));
    videos().forEach(v => still ? v.pause() : playIfVisible(v));
    try { localStorage.setItem('niko-still', still ? '1' : '0'); } catch (e) {}
  };
  toggle.addEventListener('click', () =>
    applyStill(!document.body.classList.contains('still')));

  let saved = null;
  try { saved = localStorage.getItem('niko-still'); } catch (e) {}
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (saved === '1' || (saved === null && prefersReduced)) applyStill(true);

  /* ---- reveal on scroll ---- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ---- videos: play only when visible & in 動 mode ---- */
  const playIfVisible = (v) => {
    if (document.body.classList.contains('still')) return;
    const r = v.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) v.play().catch(() => {});
  };
  const videoObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting && !document.body.classList.contains('still')) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.35 });
  videos().forEach(v => videoObs.observe(v));

  /* ---- gentle parallax on stage figures ---- */
  const stages = document.querySelectorAll('.stage-fig img');
  let ticking = false;
  const parallax = () => {
    ticking = false;
    if (document.body.classList.contains('still')) return;
    const vh = window.innerHeight;
    stages.forEach(img => {
      const r = img.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh; // -0.5 .. 0.5
      img.style.transform = `translateY(${p * -14}px)`;
    });
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
  }, { passive: true });

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
    window.setTimeout(() => { lb.hidden = true; lbImg.src = ''; }, 450);
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
