(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // Constants
  // ─────────────────────────────────────────────────────────────────────────

  const SCREENS = ['menu-empty', 'menu-with-cart', 'menu-detail', 'cart-sheet', 'inapp-modal'];
  const LABELS = {
    'menu-empty': '빈 상태',
    'menu-with-cart': '담은 상태',
    'menu-detail': '메뉴 상세',
    'cart-sheet': '장바구니',
    'inapp-modal': '앱 전환',
  };

  const FRAME_W = 414;
  const FRAME_H = 896;
  // Screens whose content scrolls naturally as a single page.
  const NATURAL_FLOW = new Set(['menu-empty', 'menu-with-cart']);
  // Screens where the floating cart bar should appear (when cart is non-empty)
  const CART_BAR_SCREENS = new Set(['menu-empty', 'menu-with-cart']);

  // Detail option upcharges
  const SIZE_DELTA = { 'Tall': 0, 'Grande': 500, 'Venti': 1000 };
  const OPT_DELTA = { '샷 추가': 500, '시럽 추가': 300 };
  const SIZE_ORDER = ['Tall', 'Grande', 'Venti'];

  // ─────────────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────────────

  /** @type {{name:string, desc:string, price:number, oldPrice:number|null, emoji:string, soldOut:boolean, badge:string|null}[]} */
  const MENU = [];

  const state = {
    current: 'menu-empty',
    prev: null,
    /** Detail-screen working selection */
    selection: null, // {menu, size, options:Set, qty}
    /** Cart entries */
    cart: [], // [{menu, size, options:string[], qty}]
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Money helpers
  // ─────────────────────────────────────────────────────────────────────────

  function fmtKRW(n) { return Math.round(n).toLocaleString('ko-KR') + '원'; }

  function unitPrice(menu, size, options) {
    const base = menu.price;
    const sd = SIZE_DELTA[size] || 0;
    const od = (options || []).reduce((s, o) => s + (OPT_DELTA[o] || 0), 0);
    return base + sd + od;
  }

  function lineTotal(line) { return unitPrice(line.menu, line.size, line.options) * line.qty; }
  function cartTotal() { return state.cart.reduce((s, l) => s + lineTotal(l), 0); }
  function cartItemCount() { return state.cart.reduce((s, l) => s + l.qty, 0); }

  // ─────────────────────────────────────────────────────────────────────────
  // Menu data extraction (from menu-empty's .mp-item DOM)
  // ─────────────────────────────────────────────────────────────────────────

  function extractMenuData() {
    const root = document.querySelector('[data-screen="menu-empty"]');
    if (!root) return;
    root.querySelectorAll('.mp-item').forEach(card => {
      const name = textOf(card.querySelector('.mp-item-name'));
      if (!name) return;
      const desc = textOf(card.querySelector('.mp-item-desc'));
      const priceEl = card.querySelector('.mp-item-price');
      const oldPriceEl = card.querySelector('.mp-item-price-old');
      const emoji = textOf(card.querySelector('.mp-item-thumb-emoji'));
      const tag = textOf(card.querySelector('.mp-item-thumb-tag'));
      const soldOut = card.classList.contains('disabled');
      const price = parsePrice(priceEl);
      const oldPrice = oldPriceEl ? parsePrice(oldPriceEl) : null;
      MENU.push({ name, desc, price, oldPrice, emoji, soldOut, badge: tag || null });
    });
  }

  function parsePrice(el) {
    if (!el) return 0;
    const m = textOf(el).replace(/[^\d]/g, '');
    return m ? parseInt(m, 10) : 0;
  }

  function findMenu(name) { return MENU.find(m => m.name === name) || null; }

  // ─────────────────────────────────────────────────────────────────────────
  // Screen toggling
  // ─────────────────────────────────────────────────────────────────────────

  // Overlay screens are rendered as fixed-positioned panels over the
  // currently-active list screen, instead of switching the whole frame.
  // This keeps the bottom-sheet CTAs anchored to the actual viewport.
  const OVERLAY_SCREENS = new Set(['menu-detail', 'cart-sheet', 'inapp-modal']);
  const BASE_FOR_OVERLAY = 'menu-with-cart';

  function setActiveScreen(name) {
    document.querySelectorAll('.screen').forEach(el => {
      el.classList.toggle('active', el.dataset.screen === name);
    });
    document.querySelectorAll('.dev-nav button[data-go]').forEach(b => {
      b.classList.toggle('active', b.dataset.go === name);
    });
  }

  function show(name) {
    if (!SCREENS.includes(name)) return;
    if (name !== state.current) state.prev = state.current;

    if (OVERLAY_SCREENS.has(name)) {
      // Pick a base list screen to sit beneath the overlay.
      const base = (state.prev && !OVERLAY_SCREENS.has(state.prev))
        ? state.prev
        : BASE_FOR_OVERLAY;
      setActiveScreen(base);
      state.current = name;
      // Highlight the dev-nav button for the overlay screen too.
      document.querySelectorAll('.dev-nav button[data-go]').forEach(b => {
        if (b.dataset.go === name) b.classList.add('active');
      });
      if (name === 'menu-detail') {
        detailSheetEl = findDetailSheet();
        renderDetail();
      }
      if (name === 'cart-sheet') renderCartSheet();
      if (name === 'inapp-modal') renderModal();
      openOverlay(name);
      refit();
      updateCartBar();
      return;
    }

    closeOverlay();
    setActiveScreen(name);
    state.current = name;
    refit();
    updateCartBar();
    window.scrollTo(0, 0);
  }
  window.__showScreen = show;
  window.__state = state;
  window.__menu = MENU;

  // ─────────────────────────────────────────────────────────────────────────
  // Bottom-sheet / modal overlay (positioned fixed to viewport)
  // ─────────────────────────────────────────────────────────────────────────

  /** Map of overlay screen name → DOM elements that were moved out. */
  const overlayMoves = new Map();

  function ensureOverlayContainer() {
    let overlay = document.getElementById('mp-overlay');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'mp-overlay';
    overlay.innerHTML = '<div class="mp-overlay-backdrop"></div><div class="mp-overlay-stage"></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.mp-overlay-backdrop').addEventListener('click', () => {
      // Default close: go back to base list screen.
      const back = state.prev && !OVERLAY_SCREENS.has(state.prev) ? state.prev : BASE_FOR_OVERLAY;
      show(back);
    });
    return overlay;
  }

  function openOverlay(name) {
    const overlay = ensureOverlayContainer();
    const stage = overlay.querySelector('.mp-overlay-stage');
    // Restore any previously-moved panel before opening a new one.
    restoreOverlayPanels();

    const sourceScreen = document.querySelector(`[data-screen="${name}"]`);
    if (!sourceScreen) return;
    const panelSelector = name === 'inapp-modal' ? '.mp-modal' : '.mp-sheet';
    const panel = sourceScreen.querySelector(panelSelector);
    if (!panel) return;
    const placeholder = document.createComment(`mp-overlay placeholder:${name}`);
    panel.parentNode.insertBefore(placeholder, panel);
    stage.appendChild(panel);
    overlayMoves.set(name, { panel, placeholder });

    overlay.dataset.kind = name;
    overlay.classList.add('active');
    // Re-bind detailSheetEl reference since it now lives in the overlay.
    if (name === 'menu-detail') detailSheetEl = panel;
  }

  function closeOverlay() {
    const overlay = document.getElementById('mp-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    restoreOverlayPanels();
  }

  function restoreOverlayPanels() {
    overlayMoves.forEach(({ panel, placeholder }) => {
      if (placeholder.parentNode) {
        placeholder.parentNode.insertBefore(panel, placeholder);
        placeholder.parentNode.removeChild(placeholder);
      }
    });
    overlayMoves.clear();
  }

  function ensureFrame() {
    const stage = document.querySelector('.stage');
    if (!stage || stage.querySelector(':scope > .frame')) return;
    const frame = document.createElement('div');
    frame.className = 'frame';
    Array.from(stage.querySelectorAll(':scope > .screen')).forEach(s => frame.appendChild(s));
    stage.appendChild(frame);
  }

  function applyScale() {
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const scale = vw / FRAME_W;
    document.documentElement.style.setProperty('--scale', String(scale));
    refit();
  }

  function unlockInnerScroll() {
    document.querySelectorAll('.screen').forEach(scr => {
      if (!NATURAL_FLOW.has(scr.dataset.screen)) return;
      scr.querySelectorAll('*').forEach(el => {
        if (el.dataset._unlocked) return;
        const s = getComputedStyle(el);
        const ovs = [s.overflow, s.overflowX, s.overflowY];
        if (!ovs.some(v => v === 'auto' || v === 'scroll')) return;
        const sh = el.scrollHeight;
        el.style.overflow = 'visible';
        el.style.maxHeight = 'none';
        if (sh > el.clientHeight) el.style.height = sh + 'px';
        el.dataset._unlocked = '1';
        let p = el.parentElement;
        while (p && p !== scr) {
          if (!p.dataset._relaxed) {
            const ps = getComputedStyle(p);
            if (ps.position !== 'absolute' && ps.position !== 'fixed') {
              p.style.height = 'auto';
              p.style.minHeight = '0';
              p.style.blockSize = 'auto';
            }
            p.dataset._relaxed = '1';
          }
          p = p.parentElement;
        }
      });
    });
  }

  function refit() {
    unlockInnerScroll();
    const screen = document.querySelector('.screen.active');
    if (!screen) return;
    const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale')) || 1;
    const frame = document.querySelector('.frame');
    let contentH;
    if (NATURAL_FLOW.has(screen.dataset.screen)) {
      screen.style.height = 'auto';
      contentH = Math.max(FRAME_H, screen.scrollHeight);
      screen.style.height = contentH + 'px';
    } else {
      screen.style.height = FRAME_H + 'px';
      contentH = FRAME_H;
    }
    if (frame) frame.style.height = (contentH * scale) + 'px';
  }
  window.addEventListener('resize', applyScale);
  window.addEventListener('orientationchange', applyScale);

  // ─────────────────────────────────────────────────────────────────────────
  // Dev navigation (top-right)
  // ─────────────────────────────────────────────────────────────────────────

  function buildNav() {
    const nav = document.createElement('div');
    nav.className = 'dev-nav';
    const toggle = document.createElement('button');
    toggle.className = 'toggle';
    toggle.textContent = '−';
    toggle.title = '접기/펼치기';
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      const collapsed = nav.classList.toggle('collapsed');
      toggle.textContent = collapsed ? '+' : '−';
    });
    nav.appendChild(toggle);
    if ((document.documentElement.clientWidth || window.innerWidth) < 480) {
      nav.classList.add('collapsed');
      toggle.textContent = '+';
    }
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = '화면 이동';
    nav.appendChild(label);
    SCREENS.forEach(s => {
      const b = document.createElement('button');
      b.dataset.go = s;
      b.textContent = LABELS[s];
      b.addEventListener('click', e => { e.stopPropagation(); show(s); });
      nav.appendChild(b);
    });
    document.body.appendChild(nav);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Text utils
  // ─────────────────────────────────────────────────────────────────────────

  function textOf(el) { return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }

  function ancestors(el, maxDepth) {
    const arr = [];
    let cur = el, d = 0;
    while (cur && cur !== document.body && d < maxDepth) {
      arr.push(cur);
      cur = cur.parentElement;
      d++;
    }
    return arr;
  }

  // Find the smallest ancestor whose normalised textContent equals one of
  // the target strings (used for buttons like 닫기).
  function ancestorEquals(el, strings, maxDepth) {
    maxDepth = maxDepth || 12;
    for (const a of ancestors(el, maxDepth)) {
      if (strings.includes(textOf(a))) return a;
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Menu detail rendering
  // ─────────────────────────────────────────────────────────────────────────

  let detailSheetEl = null;

  function findDetailSheet() {
    return document.querySelector('[data-screen="menu-detail"] .mp-sheet');
  }

  /** Open detail for a given menu name (called from menu-card click). */
  function openDetail(name) {
    const menu = findMenu(name);
    if (!menu) return;
    state.selection = {
      menu,
      size: 'Tall',
      options: new Set(),
      qty: 1,
    };
    show('menu-detail');
  }

  function getDetailRoot() {
    return document.querySelector('#mp-overlay .mp-sheet.role-detail-sheet')
        || document.querySelector('[data-screen="menu-detail"] .mp-sheet');
  }

  function getCartRoot() {
    return document.querySelector('#mp-overlay .mp-sheet.role-cart-sheet-panel')
        || document.querySelector('[data-screen="cart-sheet"] .mp-sheet');
  }

  function getModalRoot() {
    return document.querySelector('#mp-overlay .mp-modal')
        || document.querySelector('[data-screen="inapp-modal"] .mp-modal');
  }

  function renderDetail() {
    const root = getDetailRoot();
    if (!root || !state.selection) return;
    const sel = state.selection;

    // Header text
    setText(root.querySelector('.mp-dlg-name'), sel.menu.name);
    setText(root.querySelector('.mp-dlg-desc'), sel.menu.desc);
    setText(root.querySelector('.mp-dlg-price'), fmtKRW(sel.menu.price));
    const emojiEl = root.querySelector('.mp-dlg-img-emoji');
    if (emojiEl) emojiEl.textContent = sel.menu.emoji || '☕';

    // Size options (radio): toggle .checked, update marker .dot
    const sizeSection = findSection(root, '사이즈');
    if (sizeSection) {
      sizeSection.querySelectorAll('.mp-opt').forEach(opt => {
        const label = textOf(opt.querySelector('.mp-opt-label'));
        opt.classList.toggle('checked', label === sel.size);
      });
    }

    // Additional options (checkbox): toggle .checked
    const optSection = findSection(root, '추가 옵션');
    if (optSection) {
      optSection.querySelectorAll('.mp-opt').forEach(opt => {
        const label = textOf(opt.querySelector('.mp-opt-label'));
        opt.classList.toggle('checked', sel.options.has(label));
      });
    }

    // Quantity
    const qtySection = findSection(root, '수량');
    if (qtySection) {
      const val = qtySection.querySelector('.mp-qty .val');
      if (val) val.textContent = String(sel.qty);
      const minus = qtySection.querySelector('.mp-qty button[aria-label="수량 감소"]');
      if (minus) minus.disabled = sel.qty <= 1;
    }

    // CTA price
    const cta = root.querySelector('.mp-cta-primary');
    if (cta) {
      const total = unitPrice(sel.menu, sel.size, Array.from(sel.options)) * sel.qty;
      cta.textContent = `${fmtKRW(total)} · 장바구니 담기`;
    }
  }

  function findSection(root, title) {
    return Array.from(root.querySelectorAll('.mp-dlg-section')).find(sec =>
      textOf(sec.querySelector('.mp-dlg-section-title')) === title
    ) || null;
  }

  function setText(el, t) { if (el) el.textContent = t; }

  // ─────────────────────────────────────────────────────────────────────────
  // Category tabs: click to jump to the matching section in the list
  // ─────────────────────────────────────────────────────────────────────────

  // Tab text → section id (in the menu list). The leading "전체" tab scrolls
  // back to the top; other tabs map by visible label.
  const CATEGORY_TAB_MAP = {
    '선착순 한정 이벤트': 'cat-event',
    'COFFEE': 'cat-coffee',
    'FRESH JUICE': 'cat-juice',
    'HEAL TEA': 'cat-tea',
    'DESSERT': 'cat-dessert',
  };

  function wireCategoryTabs() {
    document.addEventListener('click', ev => {
      const tab = ev.target instanceof Element ? ev.target.closest('.mp-cat') : null;
      if (!tab) return;
      // Only handle taps inside the active list screen.
      const screen = tab.closest('.screen');
      if (!screen || !NATURAL_FLOW.has(screen.dataset.screen)) return;
      ev.stopPropagation();

      // Mark this tab active within the same nav.
      tab.parentElement.querySelectorAll('.mp-cat').forEach(b => b.classList.toggle('active', b === tab));

      // Resolve target section.
      const label = (tab.firstChild && tab.firstChild.nodeType === 3 ? tab.firstChild.nodeValue : tab.textContent).trim();
      let target = null;
      if (label === '전체') {
        // Scroll back to the top of the list.
        const firstSection = screen.querySelector('.mp-cat-section');
        target = firstSection;
      } else {
        const id = CATEGORY_TAB_MAP[label];
        if (id) target = screen.querySelector('#' + id);
      }
      if (!target) return;

      // Page scrolls naturally (NATURAL_FLOW), so window.scrollTo with the
      // section's absolute Y position works. Subtract the header + tab nav
      // sticky height so the section title isn't hidden under them.
      const offset = 96; // approximate header + tab area (in viewport px)
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, true);
  }

  // Wire detail interactions (delegated, called once at boot)
  function wireDetailInteractions() {
    // Listen on document so we catch clicks on the panel whether it lives in
    // its source [data-screen="menu-detail"] subtree or has been moved into
    // the body-level #mp-overlay container.
    document.addEventListener('click', ev => {
      if (state.current !== 'menu-detail') return;
      const detailRoot = getDetailRoot();
      if (!detailRoot || !detailRoot.contains(ev.target)) return;
      const target = ev.target;
      if (!(target instanceof Element)) return;

      // Click on a size or option row
      const opt = target.closest('.mp-opt');
      if (opt) {
        ev.stopPropagation();
        const label = textOf(opt.querySelector('.mp-opt-label'));
        if (SIZE_ORDER.includes(label)) {
          state.selection.size = label;
        } else if (label in OPT_DELTA) {
          if (state.selection.options.has(label)) state.selection.options.delete(label);
          else state.selection.options.add(label);
        }
        renderDetail();
        return;
      }

      // Quantity buttons
      const qty = target.closest('.mp-qty button');
      if (qty) {
        ev.stopPropagation();
        const isMinus = qty.getAttribute('aria-label') === '수량 감소';
        if (isMinus && state.selection.qty > 1) state.selection.qty--;
        else if (!isMinus) state.selection.qty++;
        renderDetail();
        return;
      }

      // CTA button
      const cta = target.closest('.mp-cta-primary');
      if (cta) {
        ev.stopPropagation();
        addToCart();
        show(state.cart.length > 0 ? 'menu-with-cart' : 'menu-empty');
        return;
      }
    }, true);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Cart logic
  // ─────────────────────────────────────────────────────────────────────────

  function addToCart() {
    const sel = state.selection;
    if (!sel) return;
    const opts = Array.from(sel.options);
    // Merge with same menu+size+options if already in cart
    const existing = state.cart.find(l =>
      l.menu.name === sel.menu.name &&
      l.size === sel.size &&
      sameSet(l.options, opts)
    );
    if (existing) existing.qty += sel.qty;
    else state.cart.push({ menu: sel.menu, size: sel.size, options: opts, qty: sel.qty });
  }

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    const sa = new Set(a), sb = new Set(b);
    for (const x of sa) if (!sb.has(x)) return false;
    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Floating cart bar
  // ─────────────────────────────────────────────────────────────────────────

  let cartBarEl = null; // the .mp-cartbar button (moved out)
  let cartBarFrame = null; // floating wrapper

  function setupFloatingCartBar() {
    const src = document.querySelector('[data-screen="menu-with-cart"] .mp-cartbar');
    if (!src) return;

    // Wrap in a floating frame so it scales like the main frame.
    cartBarFrame = document.createElement('div');
    cartBarFrame.className = 'cart-floating';
    const inner = document.createElement('div');
    inner.className = 'cart-floating-inner';
    cartBarEl = src;
    src.parentElement.removeChild(src);
    inner.appendChild(src);
    cartBarFrame.appendChild(inner);
    document.body.appendChild(cartBarFrame);

    cartBarEl.addEventListener('click', ev => {
      ev.stopPropagation();
      show('cart-sheet');
    });
  }

  function updateCartBar() {
    if (!cartBarFrame || !cartBarEl) return;
    const visible = CART_BAR_SCREENS.has(state.current) && state.cart.length > 0;
    cartBarFrame.hidden = !visible;
    if (!visible) return;
    const cnt = cartItemCount();
    setText(cartBarEl.querySelector('.mp-cartbar-count'), String(cnt));
    setEyebrow(cartBarEl.querySelector('.mp-cartbar-eyebrow'), `담은 메뉴 ${cnt}개`);
    setEyebrow(cartBarEl.querySelector('.mp-cartbar-total'), `합계 ${fmtKRW(cartTotal())}`);
  }

  // The eyebrow/total were originally split into multiple text spans for
  // styling; we just replace innerHTML wrappers' visible text by clearing
  // children and putting a single text node.
  function setEyebrow(el, value) {
    if (!el) return;
    el.textContent = value;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Cart sheet rendering
  // ─────────────────────────────────────────────────────────────────────────

  let cartLineTemplate = null;
  function renderCartSheet() {
    const sheet = getCartRoot();
    if (!sheet) return;
    const body = sheet.querySelector('.mp-sheet-body');
    if (!body) return;

    // Capture template from the first existing line on first call
    if (!cartLineTemplate) {
      const firstLine = body.querySelector('.mp-cart-line');
      if (firstLine) cartLineTemplate = firstLine.cloneNode(true);
    }

    // Remove all current lines (but keep the .mp-cart-total at the end)
    body.querySelectorAll('.mp-cart-line').forEach(n => n.remove());
    const totalRow = body.querySelector('.mp-cart-total');

    state.cart.forEach((line, idx) => {
      if (!cartLineTemplate) return;
      const node = cartLineTemplate.cloneNode(true);
      const thumb = node.querySelector('.mp-cart-thumb');
      if (thumb) thumb.textContent = line.menu.emoji || '☕';
      setText(node.querySelector('.mp-cart-line-name'), line.menu.name);
      setText(node.querySelector('.mp-cart-line-options'), describeLine(line));
      setText(node.querySelector('.mp-cart-line-price'), fmtKRW(unitPrice(line.menu, line.size, line.options) * line.qty));
      const valEl = node.querySelector('.mp-qty-mini .val');
      if (valEl) valEl.textContent = String(line.qty);
      const minus = node.querySelector('.mp-qty-mini button[aria-label="수량 감소"]');
      if (minus) minus.disabled = line.qty <= 1;
      // Wire handlers
      node.querySelector('.mp-cart-line-trash')?.addEventListener('click', ev => {
        ev.stopPropagation();
        state.cart.splice(idx, 1);
        afterCartMutation();
      });
      node.querySelectorAll('.mp-qty-mini button').forEach(b => {
        b.addEventListener('click', ev => {
          ev.stopPropagation();
          const isMinus = b.getAttribute('aria-label') === '수량 감소';
          if (isMinus && line.qty > 1) line.qty--;
          else if (!isMinus) line.qty++;
          afterCartMutation();
        });
      });
      body.insertBefore(node, totalRow);
    });

    // Header count
    const cnt = sheet.querySelector('.mp-sheet-top-title .count');
    if (cnt) {
      const distinctCount = state.cart.length;
      cnt.innerHTML = `<span class="__om-t">(</span>${distinctCount}<span class="__om-t">)</span>`;
    }

    // Total + CTA
    setText(sheet.querySelector('.mp-cart-total-value'), fmtKRW(cartTotal()));
    const cta = sheet.querySelector('.mp-sheet-cta .mp-cta-primary');
    if (cta) cta.innerHTML = `<span class="__om-t">주문하기 (</span>${fmtKRW(cartTotal())}<span class="__om-t">)</span>`;
  }

  function describeLine(line) {
    const parts = [line.size];
    line.options.forEach(o => parts.push(o));
    return parts.join(', ');
  }

  function afterCartMutation() {
    if (state.cart.length === 0) {
      // Cart became empty → bounce back to menu-empty
      show('menu-empty');
      return;
    }
    renderCartSheet();
    updateCartBar();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // In-app modal rendering
  // ─────────────────────────────────────────────────────────────────────────

  let modalLineTemplate = null;
  function renderModal() {
    const modal = getModalRoot();
    if (!modal) return;
    const card = modal.querySelector('.mp-summary-card');
    if (!card) return;

    if (!modalLineTemplate) {
      const firstLine = card.querySelector('.mp-summary-line');
      if (firstLine) modalLineTemplate = firstLine.cloneNode(true);
    }

    // Clear existing summary-line entries (keep store/divider/grandtotal)
    card.querySelectorAll('.mp-summary-line').forEach(n => n.remove());

    const divider = card.querySelector('.mp-summary-divider');
    state.cart.forEach(line => {
      if (!modalLineTemplate) return;
      const node = modalLineTemplate.cloneNode(true);
      const optsTxt = describeLine(line);
      setText(node.querySelector('.name'), `${line.menu.name} (${optsTxt})`);
      const qtyEl = node.querySelector('.qty');
      if (qtyEl) qtyEl.innerHTML = `<span class="__om-t">× </span>${line.qty}`;
      card.insertBefore(node, divider);
    });

    setText(card.querySelector('.mp-summary-grandtotal .v'), fmtKRW(cartTotal()));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Top-level click delegation
  // ─────────────────────────────────────────────────────────────────────────

  document.addEventListener('click', function (ev) {
    const target = ev.target;
    if (!(target instanceof Element)) return;
    if (target.closest('.dev-nav')) return;
    if (target.closest('.cart-floating')) return; // handled by cart bar's own listener

    const cur = state.current;

    if (cur === 'menu-detail') {
      // X close button inside the detail sheet
      if (target.closest('.mp-sheet-close')) {
        ev.stopPropagation();
        show(state.prev === 'menu-with-cart' ? 'menu-with-cart' : 'menu-empty');
        return;
      }
      // Outside the bottom sheet → close back to previous screen
      if (detailSheetEl && !detailSheetEl.contains(target)) {
        ev.stopPropagation();
        show(state.prev === 'menu-with-cart' ? 'menu-with-cart' : 'menu-empty');
      }
      // Inside-sheet interactions handled in wireDetailInteractions().
      return;
    }

    if (cur === 'cart-sheet') {
      // Close X button
      const close = target.closest('.mp-sheet-close');
      if (close) { ev.stopPropagation(); show(state.prev || 'menu-with-cart'); return; }
      // Order CTA
      const cta = target.closest('.mp-sheet-cta .mp-cta-primary');
      if (cta) { ev.stopPropagation(); show('inapp-modal'); return; }
      return;
    }

    if (cur === 'inapp-modal') {
      const close = ancestorEquals(target, ['닫기', '×'], 6) || target.closest('.mp-modal-close');
      if (close) { ev.stopPropagation(); show(state.prev || 'menu-with-cart'); return; }
      const install = target.closest('.mp-modal-cta .mp-cta-primary, .mp-modal-cta button');
      if (install) { ev.stopPropagation(); alert('앱 설치 페이지로 이동 (프로토타입)'); return; }
      return;
    }

    // menu-empty / menu-with-cart: tap a menu card to open detail
    if (NATURAL_FLOW.has(cur)) {
      const card = target.closest('.mp-item');
      if (card && !card.classList.contains('disabled')) {
        ev.stopPropagation();
        const name = textOf(card.querySelector('.mp-item-name'));
        if (name) openDetail(name);
        return;
      }
    }
  }, true);

  // ─────────────────────────────────────────────────────────────────────────
  // Init
  // ─────────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    ensureFrame();
    extractMenuData();
    setupFloatingCartBar();
    wireDetailInteractions();
    wireCategoryTabs();
    applyScale();
    buildNav();
    show('menu-empty');
  });
})();
