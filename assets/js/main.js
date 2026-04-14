/**
 * SAC / Smart AI Creative
 * main.js — Vanilla JS（ライブラリ不使用）
 * パフォーマンス優先：will-change / transform / opacity のみ使用
 */

'use strict';

/* ============================================================
   ページロードアニメーション
   0.3s遅延後にHero文字stagger開始 + オーバーレイフェードアウト
   ============================================================ */
function initPageLoad() {
  const overlay = document.querySelector('.page-transition');

  window.addEventListener('load', () => {
    // 0.3s遅延でアニメーション開始
    setTimeout(() => {
      document.body.classList.add('is-loaded');
      if (overlay) {
        overlay.classList.add('is-hidden');
        setTimeout(() => { overlay.style.display = 'none'; }, 900);
      }
    }, 300);
  });

  // フォールバック（3秒後にも発動していなければ強制起動）
  setTimeout(() => {
    if (!document.body.classList.contains('is-loaded')) {
      document.body.classList.add('is-loaded');
      if (overlay) overlay.classList.add('is-hidden');
    }
  }, 3000);
}

/* ============================================================
   ヘッダースクロール
   scrollY > 80 でクラス追加 → CSSトランジション 0.4s
   ============================================================ */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const THRESHOLD = 80;
  let ticking = false;

  function update() {
    if (window.scrollY > THRESHOLD) {
      header.classList.add('is-scrolled');
      header.classList.remove('header-dark');
    } else {
      header.classList.remove('is-scrolled');
      if (document.querySelector('.hero')) {
        header.classList.add('header-dark');
      }
    }
    ticking = false;
  }

  update();

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   ハンバーガーメニュー（フルスクリーンオーバーレイ）
   ============================================================ */
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.contains('is-open');
    btn.classList.toggle('is-open');
    nav.classList.toggle('is-open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
    btn.setAttribute('aria-expanded', String(!isOpen));
    btn.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
  });

  // リンククリックで閉じる
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('is-open');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // Escキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.classList.contains('is-open')) {
      btn.classList.remove('is-open');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   モバイルMANAGEMENTサブメニュー展開
   max-height + opacityで制御
   ============================================================ */
function initMobileSubMenu() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const sub = document.querySelector('.mobile-nav-sub');
  if (!toggle || !sub) return;

  toggle.addEventListener('click', () => {
    const isOpen = sub.classList.contains('is-open');
    sub.classList.toggle('is-open');
    sub.setAttribute('aria-hidden', String(isOpen));
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

/* ============================================================
   スクロールアニメーション（Intersection Observer）
   fadeUp: translateY(40px) → 0 / opacity 0 → 1 / 0.8s
   ============================================================ */
function initScrollAnimation() {
  const targets = document.querySelectorAll('[data-scroll]');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.05
    }
  );

  targets.forEach(el => observer.observe(el));
}

/* ============================================================
   WORKSページ：カテゴリフィルター（他ページ用）
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
        card.classList.toggle('is-hidden',
          cat !== 'ALL' && card.dataset.category !== cat
        );
      });
    });
  });
}

/* ============================================================
   スムーズスクロール（アンカーリンク）
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h')
      ) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   アクティブナビリンク
   ============================================================ */
function initActiveNav() {
  const current = window.location.pathname.replace(/^.*\//, '') || 'index.html';
  document.querySelectorAll('.nav-link, .footer-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const file = href.replace(/^.*\//, '');
    if (file === current) link.classList.add('is-active');
  });
}

/* ============================================================
   初期化
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  initHeaderScroll();
  initHamburger();
  initMobileSubMenu();
  initScrollAnimation();
  initWorksFilter();
  initSmoothScroll();
  initActiveNav();
});
