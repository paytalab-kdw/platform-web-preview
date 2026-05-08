/* =========================================================================
   매장 상세 (에슬로우커피 라운지점) — vanilla JS 렌더러
   - 데이터: 같은 파일 상단에 정의
   - 렌더: 템플릿 문자열로 #root에 주입
   - 인터랙션: 히어로 dot, 소식 캐러셀 dot
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- 데이터 ---------- */
  const STORE = {
    name: '에슬로우커피 라운지점',
    desc1: '대한민국 대표 프리미엄 더치커피전문점 입니다.',
    desc2: '토스트 무료 셀프이용합니다.',
    address: '서울특별시 강남구 테헤란로86길 13 (대치동)',
    distance: '159m · 걸어서 3분',
    hours: '영업 중 · 18:30까지',
    orders: '8,691',
    badges: ['매장이벤트', '매장', '적립', '100원 이벤트'],
    promo: '100원 커피 혜택!',
  };

  const STORE_IMAGE_URL =
    'https://passorder-static.passorder.site/default/empty_store.image';
  const HERO_IMAGES = [
    `#1F1108 url(${STORE_IMAGE_URL}) center/cover no-repeat`,
    `#1F1108 url(${STORE_IMAGE_URL}) center/cover no-repeat`,
    `#1F1108 url(${STORE_IMAGE_URL}) center/cover no-repeat`,
    `#1F1108 url(${STORE_IMAGE_URL}) center/cover no-repeat`,
  ];

  const _img = (url) => `#1F1108 url(${url}) center/cover no-repeat`;
  const POPULAR_MENUS = [
    {
      name: '♥100원 아메리카노♥',
      type: 'deal',
      price: 100,
      oldPrice: 3000,
      desc: '테이크아웃만 가능, 주문폭주로 준비가 늦어질 수 있어요.',
      tags: [],
      bg: _img('https://passorder-static.passorder.site/default/100won-deal-menu.image'),
    },
    {
      name: '아메리카노',
      type: 'discount',
      price: 2000,
      oldPrice: 3600,
      desc: '에티오피아 예가체프 첼바 내츄럴 (다채롭고 복합적인 꽃향, 은은한 과일산미)',
      tags: ['passorder', 'takeout'],
      bg: _img('https://passorder-static.passorder.site/store/4bad0a44-a979-42a5-a8e5-0a8adb2c5806/menu/9d71cf51-8dd6-47fd-9811-810c84a7a9d0/999/250624-094308-331746.image'),
    },
    {
      name: '카페라떼',
      type: 'discount',
      price: 2500,
      oldPrice: 4000,
      desc: '벨벳처럼 부드러운 우유 거품, HOT or ICE 선택/사이즈 선택',
      tags: ['passorder'],
      bg: _img('https://passorder-static.passorder.site/store/4bad0a44-a979-42a5-a8e5-0a8adb2c5806/menu/9d71cf51-8dd6-47fd-9811-810c84a7a9d0/999/250625-045045-669303.image'),
    },
    {
      name: '레몬에이드',
      type: 'regular',
      price: 4500,
      oldPrice: null,
      desc: '상큼한 레몬과 청량한 탄산의 조화',
      tags: [],
      bg: _img('https://passorder-static.passorder.site/store/4bad0a44-a979-42a5-a8e5-0a8adb2c5806/menu/580dd4bb-5128-4475-b462-6e8513555204/999/250625-045313-533794.image'),
    },
    {
      name: '딸기라떼',
      type: 'regular',
      price: 5000,
      oldPrice: null,
      desc: '신선한 딸기와 부드러운 우유의 만남',
      tags: [],
      bg: _img('https://passorder-static.passorder.site/store/4bad0a44-a979-42a5-a8e5-0a8adb2c5806/menu/580dd4bb-5128-4475-b462-6e8513555204/999/250625-045740-343242.image'),
    },
    {
      name: '녹차라떼',
      type: 'regular',
      price: 4800,
      oldPrice: null,
      desc: '진한 녹차와 부드러운 우유의 풍미',
      tags: [],
      bg: _img('https://passorder-static.passorder.site/store/4bad0a44-a979-42a5-a8e5-0a8adb2c5806/menu/580dd4bb-5128-4475-b462-6e8513555204/None/250625-045910-661326.image'),
    },
  ];

  const NEWS_ITEMS = [
    {
      tag: '진행 중',
      type: '사장님 할인',
      title: '오픈 시간 모닝 1,000원 할인 이벤트',
      desc: '오픈시간 모닝 시간대에 아메리카노를 주문하면 700원 할인 받을 수 있어요. 매일 진행됩니다.',
      discount: '700원 할인',
      period: '2025년 12월 05일 ~',
      schedule: '매일 07:30-10:00',
      repeat: '반복 사용 가능',
      views: '1천+',
      bg: 'linear-gradient(135deg,#FFCBB8,#FF9F7C)',
      emoji: '☕',
    },
    {
      tag: '진행 중',
      type: '신메뉴',
      title: '겨울 시즌 신메뉴 출시 & 전 메뉴 15% 할인',
      desc: '겨울 한정 신메뉴 출시를 기념해 전 메뉴 15% 할인 이벤트를 진행합니다. 많은 참여 부탁드립니다.',
      discount: '전 메뉴 15% 할인',
      period: '2025년 12월 01일 ~ 12월 31일',
      schedule: '매일 종일',
      repeat: '1인 1회',
      views: '2.4천',
      bg: 'linear-gradient(135deg,#E5EAEF,#A1ABB6)',
      emoji: '🥐',
    },
    {
      tag: '예정',
      type: '쿠폰',
      title: '신규 회원 환영 2,000원 즉시 할인 쿠폰',
      desc: '신규 가입 회원에게 즉시 사용 가능한 2,000원 할인 쿠폰을 지급해 드립니다.',
      discount: '2,000원 즉시 할인',
      period: '2026년 01월 01일 ~',
      schedule: '신규 가입 시',
      repeat: '1회 한정',
      views: '421',
      bg: 'linear-gradient(135deg,#FEF6EE,#FFE4DB)',
      emoji: '🎁',
    },
  ];

  const STORY_ITEMS = [
    {
      user: '경윤',
      date: '2023.07.11',
      text: '친절하세요🙂🙂🙂🙂🙂',
      likes: 5,
      bg: 'linear-gradient(135deg,#3D2817,#7D6147)',
      emoji: '🥤',
      avatarBg: '#FFCBB8',
    },
    {
      user: '고리룽죽겟지?',
      date: '2023.06.15',
      text: '젤 부드러운 아아',
      likes: 2,
      bg: 'linear-gradient(135deg,#A88968,#5A3B1F)',
      emoji: '🥛',
      avatarBg: '#E5EAEF',
    },
    {
      user: '민지',
      date: '2023.05.28',
      text: '사장님 너무 친절하시고 커피도 맛있어요~',
      likes: 8,
      bg: 'linear-gradient(135deg,#C5A983,#8B6F4E)',
      emoji: '☕',
      avatarBg: '#FFE4DB',
    },
  ];

  const TOTAL_STORIES = 192;

  /* ---------- helpers ---------- */
  const fmt = (n) => n.toLocaleString('ko-KR') + '원';
  const esc = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  /* ---------- 헤더 (프로모 + 히어로) ---------- */
  function renderHeader() {
    const badgePalette = [
      { bg: '#0AC4B1', color: '#fff' },
      { bg: '#FFC107', color: '#fff' },
      { bg: '#132D48', color: '#fff' },
      { bg: '#FF7949', color: '#fff' },
    ];
    const badges = STORE.badges
      .map((b, i) => {
        const p = badgePalette[i] || { bg: '#132D48', color: '#fff' };
        return `<span class="sd-hero-badge" style="background:${p.bg};color:${p.color}">${
          i === 0 ? '🏷 ' : ''
        }${esc(b)}</span>`;
      })
      .join('');
    const dots = HERO_IMAGES.map(
      (_, i) =>
        `<button class="sd-hero-dot${i === 0 ? ' active' : ''}" data-hero="${i}" aria-label="이미지 ${i + 1}"></button>`
    ).join('');
    return `
<div class="sd-header">
  <div class="sd-promo">
    <div class="sd-promo-left">
      <span class="sd-promo-icon">🎁</span>
      <span class="sd-promo-text">${esc(STORE.promo)}</span>
    </div>
    <button class="sd-promo-cta">
      선착순 받기
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  </div>
  <div class="sd-hero">
    <div class="sd-hero-bg" id="sd-hero-bg" style="background:${HERO_IMAGES[0]}"></div>
    <button class="sd-hero-home" aria-label="홈">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </button>
    <div class="sd-hero-badges">${badges}</div>
    <div class="sd-hero-bottom">
      <span class="sd-hero-stat">주문수 ${esc(STORE.orders)}</span>
      <div class="sd-hero-dots">${dots}</div>
      <span class="sd-hero-status"><span class="sd-hero-status-dot"></span>지금 수령 가능!</span>
    </div>
  </div>
</div>`;
  }

  /* ---------- 매장 정보 ---------- */
  function renderStoreInfo() {
    return `
<div class="sd-info">
  <h1 class="sd-info-name">${esc(STORE.name)}</h1>
  <p class="sd-info-desc">${esc(STORE.desc1)}<br>${esc(STORE.desc2)}</p>
  <ul class="sd-info-meta">
    <li><span class="sd-info-meta-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7D7D7D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>${esc(STORE.address)}</li>
    <li><span class="sd-info-meta-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7D7D7D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>${esc(STORE.distance)}</li>
    <li><span class="sd-info-meta-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7D7D7D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>${esc(STORE.hours)}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7D7D7D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:4px"><polyline points="6 9 12 15 18 9"/></svg></li>
  </ul>
  <div class="sd-actions">
    <button class="sd-action-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>전화</button>
    <button class="sd-action-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>지도보기</button>
  </div>
  <button class="sd-point-banner">
    <span class="sd-point-icon">P</span>
    <span class="sd-point-text">
      <span class="sd-point-eyebrow">이 매장에서 사용할 수 있어요</span>
      <span class="sd-point-title"><b>10%</b> 할인하는 포인트가 있어요</span>
    </span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  </button>
</div>`;
  }

  /* ---------- 인기 메뉴 ---------- */
  function renderMenuRow(m, idx) {
    const isDeal = m.type === 'deal';
    const isDiscount = m.type === 'discount';
    const tags = m.tags || [];
    const oldPrice = m.oldPrice
      ? `<span class="sd-menu-price-old${isDiscount ? ' discount' : ''}">${esc(fmt(m.oldPrice))}</span>`
      : '';
    let tagsHtml = '';
    if (isDiscount && tags.length) {
      const passorder = tags.includes('passorder')
        ? `<span class="sd-menu-tag sd-menu-tag-passorder"><svg class="sd-menu-tag-icon" viewBox="0 0 12 12" fill="currentColor" aria-hidden><path d="M6 1.2l1.4 2.8 3.1.45-2.25 2.2.53 3.1L6 8.3 3.22 9.75l.53-3.1L1.5 4.45l3.1-.45z"/></svg>패스오더할인</span>`
        : '';
      const takeout = tags.includes('takeout')
        ? `<span class="sd-menu-tag sd-menu-tag-takeout"><svg class="sd-menu-tag-icon" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden><path d="M2.5 4.5h7l-.7 5a.8.8 0 0 1-.8.7H4a.8.8 0 0 1-.8-.7l-.7-5z"/><path d="M4 4.5V3.2A1.2 1.2 0 0 1 5.2 2h1.6A1.2 1.2 0 0 1 8 3.2v1.3"/></svg>테이크아웃할인</span>`
        : '';
      tagsHtml = `<div class="sd-menu-tags">${passorder}${takeout}</div>`;
    }
    return `
<div class="sd-menu-row">
  <div class="sd-menu-row-body">
    <div class="sd-menu-name">${esc(m.name)}</div>
    <div class="sd-menu-price-row">
      <b class="sd-menu-price">${esc(fmt(m.price))}</b>${oldPrice}
    </div>
    ${m.desc ? `<p class="sd-menu-desc">${esc(m.desc)}</p>` : ''}
    ${tagsHtml}
  </div>
  <div class="sd-menu-thumb" style="background:${m.bg}">
    ${isDeal ? '<span class="sd-menu-thumb-tag">100원</span>' : ''}
  </div>
</div>`;
  }

  function renderPopularMenu() {
    const rows = POPULAR_MENUS.map(renderMenuRow).join('');
    return `
<section class="sd-section" data-screen-label="인기 메뉴">
  <header class="sd-section-head">
    <div>
      <h2 class="sd-section-title">인기 메뉴<span class="sd-section-count">${POPULAR_MENUS.length}</span></h2>
      <p class="sd-section-sub">최근 1개월 주문 데이터 기준</p>
    </div>
    <button class="sd-section-more">전체보기<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7D7D7D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
  </header>
  <div class="sd-menu-list">${rows}</div>
</section>`;
  }

  /* ---------- 소식 ---------- */
  function renderNewsCard(n) {
    return `
<article class="sd-news-card">
  <div class="sd-news-body">
    <div class="sd-news-row">
      <div class="sd-news-text">
        <div class="sd-news-tags">
          <span class="sd-news-tag sd-news-tag-progress">${esc(n.tag)}</span>
          <span class="sd-news-tag sd-news-tag-type">${esc(n.type)}</span>
        </div>
        <h3 class="sd-news-title">${esc(n.title)}</h3>
        <span class="sd-news-views">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1" aria-hidden><ellipse cx="6" cy="6" rx="5" ry="3"/><circle cx="6" cy="6" r="1.5" fill="currentColor" stroke="none"/></svg>
          ${esc(n.views)}
        </span>
      </div>
      <div class="sd-news-thumb" style="background:${n.bg}"><span>${esc(n.emoji)}</span></div>
    </div>
    <div class="sd-news-meta-wrap">
      ${n.desc ? `<p class="sd-news-meta-desc">${esc(n.desc)}</p>` : ''}
      <ul class="sd-news-meta">
        <li><span class="sd-news-meta-icon"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><circle cx="6" cy="6" r="5.5" fill="#AAA"/><path d="M4.3 7.7L7.7 4.3" stroke="#fff" stroke-width="0.9" stroke-linecap="round"/><circle cx="4.5" cy="4.5" r="0.65" fill="#fff"/><circle cx="7.5" cy="7.5" r="0.65" fill="#fff"/></svg></span>${esc(n.discount)}</li>
        <li><span class="sd-news-meta-icon"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#AAA" stroke-width="1" aria-hidden><rect x="1.5" y="2.5" width="9" height="8" rx="1"/><line x1="1.5" y1="5" x2="10.5" y2="5"/><line x1="4" y1="1.5" x2="4" y2="3.5"/><line x1="8" y1="1.5" x2="8" y2="3.5"/></svg></span>${esc(n.period)}</li>
        <li><span class="sd-news-meta-icon"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#AAA" stroke-width="1" aria-hidden><circle cx="6" cy="6" r="4.5"/><polyline points="6 3.5 6 6 7.6 7.1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>${esc(n.schedule)}</li>
        <li><span class="sd-news-meta-icon"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#AAA" stroke-width="1" aria-hidden><circle cx="6" cy="6" r="4.5"/><line x1="6" y1="3.8" x2="6" y2="6.5" stroke-linecap="round"/><circle cx="6" cy="8.4" r="0.55" fill="#AAA" stroke="none"/></svg></span>${esc(n.repeat)}</li>
      </ul>
    </div>
  </div>
</article>`;
  }

  function renderNewsSection() {
    const slides = NEWS_ITEMS.map(
      (n) => `<div class="sd-news-slide">${renderNewsCard(n)}</div>`
    ).join('');
    const dots = NEWS_ITEMS.map(
      (_, i) =>
        `<button class="sd-news-dot${i === 0 ? ' active' : ''}" data-news="${i}" aria-label="소식 ${i + 1}"></button>`
    ).join('');
    return `
<section class="sd-section" data-screen-label="소식">
  <header class="sd-section-head">
    <div>
      <h2 class="sd-section-title">소식<span class="sd-section-count">${NEWS_ITEMS.length}</span></h2>
      <p class="sd-section-sub">진행 중인 이벤트와 혜택</p>
    </div>
    <span class="sd-section-pager"><b id="sd-news-idx">1</b> / ${NEWS_ITEMS.length}</span>
  </header>
  <div class="sd-news-cta-shared">
    <div class="sd-news-cta-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2.5 L14.6 9 L21.5 9.6 L16.2 14 L17.8 21 L12 17.2 L6.2 21 L7.8 14 L2.5 9.6 L9.4 9 Z" fill="#A5E9DF" stroke="#78DFD4" stroke-width="0.8" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="sd-news-cta-text">
      <span>패스오더에서만 참여할 수 있어요</span>
      <b>아래의 이벤트로 할인 받고 주문해 보세요</b>
    </div>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden><polyline points="9 18 15 12 9 6"/></svg>
  </div>
  <div class="sd-news-track" id="sd-news-track">${slides}</div>
  <div class="sd-news-dots">${dots}</div>
</section>`;
  }

  /* ---------- 스토리 ---------- */
  function renderStoryItem(s) {
    return `
<article class="sd-story-item">
  <header class="sd-story-head">
    <div class="sd-story-avatar" style="background:${esc(s.avatarBg)}">${esc(s.user[0])}</div>
    <div class="sd-story-meta">
      <b class="sd-story-user">${esc(s.user)}</b>
      <span class="sd-story-date">${esc(s.date)}</span>
    </div>
  </header>
  <div class="sd-story-body">
    <div class="sd-story-text-wrap">
      <p class="sd-story-text">${esc(s.text)}</p>
      <span class="sd-story-stat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF7949" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        좋아요 ${s.likes}
      </span>
    </div>
    <div class="sd-story-photo" style="background:${s.bg}"><span>${esc(s.emoji)}</span></div>
  </div>
</article>`;
  }

  function renderStorySection() {
    const items = STORY_ITEMS.map(renderStoryItem).join('');
    return `
<section class="sd-section" data-screen-label="스토리">
  <header class="sd-section-head">
    <div>
      <h2 class="sd-section-title">스토리<span class="sd-section-count">${TOTAL_STORIES}</span></h2>
      <p class="sd-section-sub">고객이 남긴 후기 3건 미리보기</p>
    </div>
  </header>
  <div class="sd-story-feed">${items}</div>
  <button class="sd-story-cta">
    <span class="sd-story-cta-text">앱에서 스토리 <b>${TOTAL_STORIES - 3}건 더 보기</b></span>
    <span class="sd-story-cta-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
  </button>
</section>`;
  }

  /* ---------- 하단 CTA ---------- */
  function renderCtaBar() {
    return `
<div class="sd-ctabar">
  <button class="sd-ctabar-icon" aria-label="공유하기">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
  </button>
  <button class="sd-ctabar-cta">주문하기<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
</div>`;
  }

  /* ---------- 마운트 ---------- */
  function mount() {
    const root = document.getElementById('root');
    root.innerHTML = `
<div class="sd-screen" data-screen-label="매장 상세">
  <div class="sd-scroll">
    ${renderHeader()}
    ${renderStoreInfo()}
    <div class="sd-block-divider"></div>
    ${renderPopularMenu()}
    <div class="sd-block-divider"></div>
    ${renderNewsSection()}
    <div class="sd-block-divider"></div>
    ${renderStorySection()}
    <div class="sd-bottom-space"></div>
  </div>
  ${renderCtaBar()}
</div>`;

    /* 히어로 dot */
    const heroBg = document.getElementById('sd-hero-bg');
    document.querySelectorAll('.sd-hero-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const i = +dot.dataset.hero;
        heroBg.style.background = HERO_IMAGES[i];
        document.querySelectorAll('.sd-hero-dot').forEach((d, j) => {
          d.classList.toggle('active', j === i);
        });
      });
    });

    /* 소식 캐러셀 */
    const track = document.getElementById('sd-news-track');
    const newsIdxEl = document.getElementById('sd-news-idx');
    const newsDots = document.querySelectorAll('.sd-news-dot');
    const updateNewsIdx = () => {
      const w = track.offsetWidth;
      const i = Math.round(track.scrollLeft / w);
      newsIdxEl.textContent = i + 1;
      newsDots.forEach((d, j) => d.classList.toggle('active', j === i));
    };
    track.addEventListener('scroll', updateNewsIdx, { passive: true });
    newsDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const i = +dot.dataset.news;
        track.scrollTo({ left: i * track.offsetWidth, behavior: 'smooth' });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
