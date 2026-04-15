/* ============================================================
   SAC — main.js
   Vanilla JS のみ。外部ライブラリ禁止。
   - ヘッダーの scroll 切替
   - モバイルメニュー開閉
   - Hero イントロアニメーション
   - Intersection Observer のリビール
   - Works SCENE 01 の背景パララックス
   - カスタムカーソル（デスクトップのみ）
   - セクション別カーソルカラー切替
   ============================================================ */

(() => {
  'use strict';

  /* ==========================================================
     1. HEADER — scroll で .scrolled 付与
     ========================================================== */
  const header = document.getElementById('siteHeader');

  const onScrollHeader = () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ==========================================================
     2. モバイルメニュー 開閉
     ========================================================== */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const accordions  = document.querySelectorAll('.mobile-accordion');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // メニュー内リンクをクリックしたら閉じる
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // MANAGEMENT アコーディオン
  accordions.forEach(acc => {
    const toggle = acc.querySelector('.mobile-accordion-toggle');
    toggle?.addEventListener('click', () => {
      const open = acc.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ==========================================================
     3. HERO イントロアニメーション
        - ONE PROMPT を1文字ずつ spans に分割し、順次せり上がらせる
        - ゴールドライン / サブテキスト もフェードイン
     ========================================================== */
  const runHeroIntro = () => {
    const title1   = document.getElementById('heroTitle1');
    const title2   = document.getElementById('heroTitle2');
    const subJa    = document.getElementById('heroSubJa');
    const goldLine = document.getElementById('heroGoldLine');
    const scrollEl = document.querySelector('.hero-scroll');
    const brandEl  = document.querySelector('.hero-brand-vertical');

    // 文字分割（空白は &nbsp; で維持）
    if (title1) {
      const text = title1.dataset.split || title1.textContent;
      title1.textContent = '';
      [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.transitionDelay = (i * 0.035) + 's';
        title1.appendChild(span);
      });
    }

    // 100ms後にアニメーション開始
    requestAnimationFrame(() => {
      setTimeout(() => {
        goldLine?.classList.add('is-visible');
        title1?.classList.add('is-visible');
        title2?.classList.add('is-visible');
        subJa?.classList.add('is-visible');
        scrollEl?.classList.add('is-visible');
        brandEl?.classList.add('is-visible');
      }, 100);
    });
  };

  /* ==========================================================
     4. Intersection Observer — .js-reveal のリビール
     ========================================================== */
  const runRevealObserver = () => {
    const revealEls = document.querySelectorAll('.js-reveal');
    if (!('IntersectionObserver' in window) || revealEls.length === 0) {
      // フォールバック: 全て表示
      revealEls.forEach(el => el.classList.add('revealed'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    });

    revealEls.forEach(el => io.observe(el));
  };

  /* ==========================================================
     5. WORKS SCENE 01 — 背景パララックス
        requestAnimationFrame でスムーズに追随
     ========================================================== */
  const runScene01Parallax = () => {
    const bgEl = document.getElementById('scene01Bg');
    const scene = document.querySelector('.scene-01');
    if (!bgEl || !scene) return;

    // will-change は CSS 側でも付与済み（保険）
    bgEl.style.willChange = 'transform';

    let ticking = false;
    const update = () => {
      const rect = scene.getBoundingClientRect();
      // セクションが画面内にある場合のみ計算
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        // scene-01 の画面中央からのオフセットで計算
        const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.12;
        bgEl.style.transform = `translateY(${offset}px) scale(1.04)`;
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  };

  /* ==========================================================
     6. カスタムカーソル（デスクトップ & hover対応デバイスのみ）
     ========================================================== */
  const runCustomCursor = () => {
    const cursor = document.querySelector('.cursor');
    const ring   = document.querySelector('.cursor-ring');
    if (!cursor || !ring) return;

    // タッチ/モバイルでは無効
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (!canHover || window.innerWidth <= 900) return;

    document.body.classList.add('cursor-ready');
    // デフォルトで非表示なのでマウス移動が来たら表示状態に
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // cursor は即時追随
      cursor.style.transform =
        `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    // ring はlerp(0.1)で遅延追随
    const loop = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform =
        `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    // ホバー対象を拡大
    const hoverTargets = document.querySelectorAll('[data-cursor="hover"]');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // マウスがウィンドウを離れたら薄く
    window.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-ready');
    });
    window.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-ready');
    });
  };

  /* ==========================================================
     7. セクション別 カーソルカラー切替
        白背景セクション（ABOUT / SERVICE / INFO）上では黒ベース
        ダークセクション（HERO / WORKS / CREATORS / CONTACT）では白ベース
     ========================================================== */
  const runCursorColorSwitch = () => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (window.innerWidth <= 900) return;

    // 白背景と判定するセクションのID
    const lightSections = ['about', 'service', 'info']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (!('IntersectionObserver' in window) || lightSections.length === 0) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 画面中央（50%）を超えたら light に切替
        if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
          document.body.classList.add('cursor-light');
        } else {
          document.body.classList.remove('cursor-light');
        }
      });
    }, {
      root: null,
      threshold: [0, 0.35, 0.6, 1]
    });

    lightSections.forEach(el => io.observe(el));
  };

  /* ==========================================================
     起動
     ========================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    runHeroIntro();
    runRevealObserver();
    runScene01Parallax();
    runCustomCursor();
    runCursorColorSwitch();
  });
})();
