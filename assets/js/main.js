/**
 * SAC / Smart AI Production
 * main.js - メインスクリプト（Vanilla JS・ライブラリ不使用）
 */

'use strict';

/* ============================================================
   ページロードアニメーション
   オーバーレイをフェードアウトし、ヒーロー文字アニメーション開始
   ============================================================ */
function initPageLoad() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      // ヒーロー文字スタッガーアニメーション開始
      document.body.classList.add('is-loaded');

      // オーバーレイフェードアウト
      overlay.classList.add('is-hidden');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 900);
    });
  });

  // フォールバック
  setTimeout(() => {
    document.body.classList.add('is-loaded');
    if (overlay) overlay.classList.add('is-hidden');
  }, 2000);
}

/* ============================================================
   ヘッダースクロール
   スクロール量に応じて透明→白背景へトランジション（0.3s）
   ============================================================ */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const THRESHOLD = 80;
  let ticking = false;

  function updateHeader() {
    if (window.scrollY > THRESHOLD) {
      header.classList.add('is-scrolled');
      header.classList.remove('header-dark');
    } else {
      header.classList.remove('is-scrolled');
      // ヒーローがある場合は白文字に復帰
      if (document.querySelector('.hero')) {
        header.classList.add('header-dark');
      }
    }
    ticking = false;
  }

  // 初期状態
  updateHeader();

  // パッシブスクロールでパフォーマンス向上（requestAnimationFrame節約）
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   ハンバーガーメニュー開閉（フルスクリーンオーバーレイ）
   ============================================================ */
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  const body = document.body;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('is-open');

    hamburger.classList.toggle('is-open');
    mobileNav.classList.toggle('is-open');

    // スクロールロック
    body.style.overflow = isOpen ? '' : 'hidden';

    // アクセシビリティ
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
  });

  // モバイルナビのリンクをクリックしたら閉じる
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      body.style.overflow = '';
    });
  });

  // Escキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
      hamburger.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      body.style.overflow = '';
    }
  });
}

/* ============================================================
   スクロールアニメーション（Intersection Observer）
   ビューポートに入った要素をフェードイン
   will-change・transform使用でパフォーマンス優先
   ============================================================ */
function initScrollAnimation() {
  const targets = document.querySelectorAll('[data-scroll]');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // 一度表示したら監視解除（パフォーマンス）
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
   WORKSページ：カテゴリフィルター
   ============================================================ */
function initWorksFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  if (!filterBtns.length || !workCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      workCards.forEach(card => {
        if (category === 'ALL' || card.dataset.category === category) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
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
   アクティブナビリンクの設定
   ============================================================ */
function initActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .footer-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkFile = href.replace(/^.*\//, '');
    const currentFile = currentPath.replace(/^.*\//, '') || 'index.html';

    if (linkFile === currentFile || (currentFile === '' && linkFile === 'index.html')) {
      link.classList.add('is-active');
    }
  });
}

/* ============================================================
   初期化
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  initHeaderScroll();
  initHamburger();
  initScrollAnimation();
  initWorksFilter();
  initSmoothScroll();
  initActiveNav();
});
