/**
 * SAC / Smart AI Creative
 * main.js — Vanilla JS（ライブラリ不使用）
 * パフォーマンス: transform / opacity のみアニメーション
 */

'use strict';

/* ============================================================
   1. Hero イントロアニメーション
   DOMContentLoaded 後 200ms 遅延でスタート
   ============================================================ */
function initHeroIntro() {
  const goldLine = document.querySelector('.js-hero-gold');
  const chars = document.querySelector('.hero-chars');
  const fades = document.querySelectorAll('.js-hero-fade');

  if (!goldLine && !chars) return;

  setTimeout(() => {
    /* ゴールドライン: width 0 → 32px */
    if (goldLine) goldLine.classList.add('is-active');

    /* "ONE PROMPT": translateY(100%) → 0 */
    setTimeout(() => {
      if (chars) chars.classList.add('is-active');
    }, 100);

    /* "CHANGE THE WORLD" + 和文サブ: opacity フェードイン */
    fades.forEach(el => {
      const delay = parseFloat(el.dataset.delay || 0) * 1000;
      setTimeout(() => el.classList.add('is-active'), delay);
    });

    /* 和文サブ（.hero-sub）を直接操作 */
    const heroSub = document.querySelector('.hero-sub');
    if (heroSub) {
      setTimeout(() => heroSub.classList.add('is-active'), 700);
    }
  }, 200);
}

/* ============================================================
   2. ヘッダースクロール
   scrollY > 60px で .is-scrolled 追加
   ============================================================ */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  let ticking = false;

  function update() {
    if (window.scrollY > 60) {
      header.classList.add('is-scrolled');
      header.classList.remove('header-dark');
    } else {
      header.classList.remove('is-scrolled');
      if (document.querySelector('.hero')) header.classList.add('header-dark');
    }
    ticking = false;
  }

  update();
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

/* ============================================================
   3. ハンバーガーメニュー + モバイルサブメニュー
   ============================================================ */
function initMobileNav() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobileNav');
  const subToggle = document.getElementById('mobileSubToggle');
  const subMenu = document.getElementById('mobileSubMenu');
  if (!btn || !nav) return;

  /* ハンバーガー開閉 */
  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('is-open');
    nav.classList.toggle('is-open');
    document.body.style.overflow = open ? 'hidden' : '';
    btn.setAttribute('aria-expanded', String(open));
  });

  /* リンククリックで閉じる */
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('is-open');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  /* MANAGEMENTサブメニュー アコーディオン */
  if (subToggle && subMenu) {
    subToggle.addEventListener('click', () => {
      const open = subMenu.classList.toggle('is-open');
      subToggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* Escape で閉じる */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.classList.contains('is-open')) {
      btn.classList.remove('is-open');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   4. Intersection Observer — .js-reveal
   子要素の stagger: index × 0.08s の delay
   ============================================================ */
function initReveal() {
  const items = document.querySelectorAll('.js-reveal');
  if (!items.length) return;

  /* 親セクション内の index を計算して stagger delay を設定 */
  const sections = document.querySelectorAll('section, .works-strip, .service-list');
  sections.forEach(sec => {
    const children = sec.querySelectorAll('.js-reveal');
    children.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.05
  });

  items.forEach(el => observer.observe(el));
}

/* ============================================================
   5. Works Feature パララックス
   背景を translateY で微妙にズラす
   ============================================================ */
function initParallax() {
  const feature = document.querySelector('.works-feature');
  if (!feature) return;

  feature.style.willChange = 'background-position';
  let ticking = false;

  function update() {
    const rect = feature.getBoundingClientRect();
    const viewH = window.innerHeight;
    /* 要素がビューポート内にある場合のみ */
    if (rect.bottom > 0 && rect.top < viewH) {
      const offset = (rect.top / viewH) * -60;
      feature.style.backgroundPositionY = `calc(50% + ${offset}px)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

/* ============================================================
   6. カスタムカーソル（デスクトップのみ）
   ============================================================ */
function initCursor() {
  /* タッチデバイスではスキップ */
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0;  // マウス座標
  let fx = 0, fy = 0;  // フォロワー座標

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  /* follower は lerp で追随 */
  function animate() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  /* data-cursor 属性でホバー時テキスト表示 */
  const hoverTargets = document.querySelectorAll('[data-cursor]');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const label = el.dataset.cursor;
      cursor.classList.add('is-hover');
      cursor.setAttribute('data-label', label);
      follower.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hover');
      cursor.removeAttribute('data-label');
      follower.classList.remove('is-hover');
    });
  });
}

/* ============================================================
   7. WORKSページ：カテゴリフィルター（他ページ用）
   ============================================================ */
function initWorksFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;
      btns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      cards.forEach(card => {
        card.classList.toggle('is-hidden', cat !== 'ALL' && card.dataset.category !== cat);
      });
    });
  });
}

/* ============================================================
   8. スムーズスクロール
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const h = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - h - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   初期化
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initHeroIntro();
  initHeaderScroll();
  initMobileNav();
  initReveal();
  initParallax();
  initCursor();
  initWorksFilter();
  initSmoothScroll();
});
