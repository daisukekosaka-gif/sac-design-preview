/**
 * SAC / Smart AI Production
 * main.js - メインスクリプト
 */

'use strict';

/* ============================================================
   ページロードアニメーション
   ============================================================ */
function initPageLoad() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  // ロード完了後にフェードアウト
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      overlay.classList.add('is-hidden');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 700);
    });
  });

  // フォールバック: DOMContentLoaded でも動作
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      overlay.classList.add('is-hidden');
    }, 300);
  });
}

/* ============================================================
   ヘッダースクロール
   スクロール量に応じてクラスを付与し背景色を変化させる
   ============================================================ */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const THRESHOLD = 80;

  function updateHeader() {
    if (window.scrollY > THRESHOLD) {
      header.classList.add('is-scrolled');
      // ヒーロー上でのみ白文字にする設定を解除
      header.classList.remove('header-dark');
    } else {
      header.classList.remove('is-scrolled');
      // ヒーローがある場合は白文字に
      if (document.querySelector('.hero')) {
        header.classList.add('header-dark');
      }
    }
  }

  // 初期状態
  updateHeader();

  // スクロールイベント（パッシブで登録しパフォーマンス向上）
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* ============================================================
   ハンバーガーメニュー開閉
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
  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
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
   スクロールアニメーション
   IntersectionObserver を使用してビューポートに入った要素をフェードイン
   ============================================================ */
function initScrollAnimation() {
  const targets = document.querySelectorAll('[data-scroll]');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // 一度表示したら監視解除
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -60px 0px', // 少し手前から発火
      threshold: 0.05
    }
  );

  targets.forEach(el => observer.observe(el));
}

/* ============================================================
   WORKSページ：カテゴリフィルター
   data-category 属性でフィルタリング
   ============================================================ */
function initWorksFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  if (!filterBtns.length || !workCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      // アクティブ状態の更新
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // カードの表示/非表示
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

      // href="#" のみの場合はスキップ
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });
}

/* ============================================================
   アクティブナビリンクの設定
   現在のページに対応するナビリンクにis-activeクラスを付与
   ============================================================ */
function initActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .footer-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // パスの末尾のファイル名で比較
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
