/* =========================================================================
   블로그 콘텐츠 상세 (성수동 노트북 작업 카페 12곳) — vanilla JS 렌더러
   - 데이터: 같은 파일 상단에 정의
   - 렌더: 템플릿 문자열로 #root에 주입
   - 인터랙션: TOC 토글 / 섹션 active 추적, 스크롤 진행률, FAB 토글
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- 데이터 ---------- */
  const ARTICLE = {
    category: '성수동 카페',
    title:
      '성수동 노트북 작업 카페 12곳 — 콘센트, 와이파이, 분위기까지 다 챙겼어요',
    lead:
      '주말마다 노트북 들고 카페 투어를 다닌 에디터가 직접 가본 성수동 카페 12곳을 콘센트 자리·와이파이 속도·소음 정도까지 정리했어요.',
    author: '이주연',
    authorRole: '패스오더 매거진 에디터',
    authorBio: '주 3회 카페에서 일하는 디지털 노마드. 성수·연남·서촌 카페 200곳 이상 방문.',
    date: '2025년 11월 28일',
    readTime: 8,
    location: '성수동',
    likes: 284,
  };

  const TOC = [
    { id: 'sec-1', label: '성수동에서 작업하기 좋은 카페란?' },
    { id: 'sec-2', label: '에디터의 4가지 평가 기준' },
    { id: 'sec-3', label: '성수동 작업 카페 TOP 3' },
    { id: 'sec-4', label: '온종일 머물기 좋은 카페 5곳' },
    { id: 'sec-5', label: '잠깐 들리기 좋은 카페 4곳' },
    { id: 'sec-6', label: '오늘 정리 — 어디부터 가볼까?' },
  ];

  const TAGS = [
    '성수동', '노트북카페', '작업카페', '콘센트',
    '조용한카페', '카페투어', '성수카페추천',
  ];

  const RELATED = [
    { cat: '연남동', emoji: '💻', bg: '#E5EAEF', title: '연남동 디지털 노마드 카페 10선 — 와이파이 빠른 곳만', date: '2025.11.20', read: 6 },
    { cat: '을지로', emoji: '🍃', bg: '#E8F5E9', title: '을지로 노포 옆 작업 카페 — 한적함이 무기인 8곳', date: '2025.11.14', read: 7 },
    { cat: '성수동', emoji: '🍰', bg: '#FFF2ED', title: '성수동에서 진짜 맛있는 디저트 카페 9곳', date: '2025.10.30', read: 5 },
    { cat: '한남동', emoji: '📖', bg: '#F7F7F7', title: '한남동 조용한 1인 카페 7곳', date: '2025.10.18', read: 4 },
    { cat: '성수동', emoji: '🍷', bg: '#FCE4EC', title: '퇴근 후 들르기 좋은 성수 와인바 6곳', date: '2025.09.28', read: 5 },
  ];

  /* ---------- helpers ---------- */
  const esc = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  const fmt = (n) => n.toLocaleString('ko-KR');

  /* ---------- 헤더 (status bar + appbar + breadcrumb) ---------- */
  function renderTopBars() {
    return `
<div class="bd-statusbar">
  <span>9:41</span>
  <span class="bd-statusbar-icons">
    <svg width="16" height="11" viewBox="0 0 16 11" fill="#333"><rect x="0" y="6" width="2" height="5" rx="1"/><rect x="4" y="4" width="2" height="7" rx="1"/><rect x="8" y="2" width="2" height="9" rx="1"/><rect x="12" y="0" width="2" height="11" rx="1"/></svg>
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="#333" stroke-width="1.2"><path d="M1 4.5C2.5 3 4.5 2 7 2s4.5 1 6 2.5"/><path d="M3 6.8C4 6 5.4 5.4 7 5.4s3 .6 4 1.4"/><circle cx="7" cy="9" r="1" fill="#333"/></svg>
    <svg width="22" height="11" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="#333"/><rect x="2" y="2" width="15" height="7" rx="1" fill="#333"/><rect x="19" y="3.5" width="1.5" height="4" rx=".5" fill="#333"/></svg>
  </span>
</div>
<div class="bd-appbar">
  <button class="bd-appbar-icon" aria-label="뒤로가기">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  </button>
  <div class="bd-appbar-title"></div>
  <button class="bd-appbar-icon" aria-label="홈">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  </button>
</div>`;
  }

  function renderProgress() {
    return `<div class="bd-progress"><div class="bd-progress-fill" id="bd-progress-fill"></div></div>`;
  }

  function renderBreadcrumb() {
    return `
<nav class="bd-breadcrumb" aria-label="breadcrumb">
  <a>홈</a><span class="sep">›</span>
  <a>매거진</a><span class="sep">›</span>
  <a>${esc(ARTICLE.category)}</a><span class="sep">›</span>
  <span class="current">${esc(ARTICLE.title)}</span>
</nav>`;
  }

  /* ---------- Article head ---------- */
  function renderArticleHead() {
    return `
<header class="bd-head">
  <span class="bd-cat-chip">${esc(ARTICLE.category)}</span>
  <h1 class="bd-title">${esc(ARTICLE.title)}</h1>
  <p class="bd-lead">${esc(ARTICLE.lead)}</p>
  <div class="bd-author-row">
    <div class="bd-author-avatar">${esc(ARTICLE.author[0])}</div>
    <div class="bd-author-meta">
      <b class="bd-author-name">${esc(ARTICLE.author)}</b>
      <span class="bd-author-sub">${esc(ARTICLE.date)} · 읽기 <b>${ARTICLE.readTime}분</b></span>
    </div>
  </div>
</header>`;
  }

  /* ---------- Hero ---------- */
  function renderHero() {
    return `<div class="bd-hero" role="img" aria-label="성수동 카페 분위기"></div>`;
  }

  /* ---------- TOC ---------- */
  function renderToc() {
    const items = TOC.map(
      (t, i) =>
        `<li data-toc="${esc(t.id)}"${i === 0 ? ' class="active"' : ''}><span class="num">${String(i + 1).padStart(2, '0')}</span><span>${esc(t.label)}</span></li>`
    ).join('');
    return `
<section class="bd-toc open" id="bd-toc">
  <button class="bd-toc-head" id="bd-toc-head">
    <span class="bd-toc-emoji">☕️</span>
    <span class="bd-toc-title">목차</span>
    <span class="bd-toc-count">${TOC.length}</span>
    <span class="bd-toc-toggle">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </span>
  </button>
  <ul class="bd-toc-list">${items}</ul>
</section>`;
  }

  /* ---------- featured store inline card ---------- */
  function renderStoreCard(o) {
    return `
<aside class="bd-store-card">
  <div class="bd-store-card-top">
    <div class="bd-store-card-thumb" style="background:${o.bg || "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80') center/cover"}"></div>
    <div class="bd-store-card-info">
      ${o.tag ? `<span class="bd-store-card-tag">★ ${esc(o.tag)}</span>` : ''}
      <button type="button" class="bd-store-card-name">
        <span>${esc(o.name)}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div class="bd-store-card-addr">${esc(o.addr)}</div>
      <div class="bd-store-card-stats">
        <span>스토리 <b>${esc(fmt(o.stories || 0))}</b></span>
        <span class="dot"></span>
        <span>주문 <b>${esc(fmt(o.orders || 0))}</b></span>
      </div>
    </div>
  </div>
  <p class="bd-store-card-desc">${esc(o.desc)}</p>
  <button class="bd-store-card-btn primary">3초만에 주문하기
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  </button>
</aside>`;
  }

  function renderMenuCard(m) {
    return `
<aside class="bd-menu-card">
  <div class="bd-menu-card-thumb" style="background:${m.bg || "url('https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=400&q=80') center/cover"}"></div>
  <div class="bd-menu-card-body">
    <div class="bd-menu-card-name">${esc(m.name)}</div>
    <div class="bd-menu-card-store">${esc(m.store)}</div>
    <div class="bd-menu-card-desc">${esc(m.desc)}</div>
    <div class="bd-menu-card-foot">
      <span class="bd-menu-card-price">${esc(fmt(m.price))}원</span>
      <span class="bd-menu-card-cta">장바구니에 담기 →</span>
    </div>
  </div>
</aside>`;
  }

  function renderFigure(emoji, bg, caption) {
    return `
<figure class="bd-figure">
  <div class="bd-figure-img" style="background:${bg}" role="img" aria-label="${esc(caption || '')}"></div>
  ${caption ? `<figcaption class="bd-figure-cap">${esc(caption)}</figcaption>` : ''}
</figure>`;
  }

  /* ---------- Article body ---------- */
  function renderBody() {
    const intro = `
<p class="bd-p">성수동에서 일주일에 두세 번 작업을 한다. 그러다 보니 <span class="bd-quote-soft">'콘센트가 있는 자리, 와이파이가 빠른 곳, 4시간 머물러도 눈치 안 보이는 곳'</span>의 조건이 명확해졌다. 이 글에서 정리한 12곳은 모두 직접 노트북을 들고 가서 90분 이상 작업해 본 곳이다.</p>`;

    const sec1 = `
<h2 class="bd-h2" id="sec-1"><span class="num">01</span>성수동에서 작업하기 좋은 카페란?</h2>
<p class="bd-p">흔히 '카공족 카페'라고 검색하면 분위기 있고 조명만 예쁜 곳이 많이 나온다. 하지만 정작 가보면 콘센트가 1자리뿐이거나, 와이파이가 끊기거나, 옆 자리 회의 소리가 너무 커서 30분도 못 버티는 경우가 많다.</p>
<p class="bd-p">이 글의 기준은 <b>'노트북으로 진짜 일이 되는 곳'</b>이다. 카페에서 일을 해본 사람이라면 공감할 만한, 까다로운 4가지 조건으로 걸러냈다.</p>
<p class="bd-p">성수동은 작업 카페의 격전지다. 카페가 많아도 좋은 곳은 결국 정해져 있다. 이 글이 그 시간을 줄여드릴 수 있다면 좋겠다.</p>`;

    const sec2 = `
<h2 class="bd-h2" id="sec-2"><span class="num">02</span>에디터의 4가지 평가 기준</h2>
<p class="bd-p">각 카페를 100점 기준으로 평가했다. 80점 이상만 이 글에 실었다.</p>
<ul class="bd-criteria">
  <li><span class="ic">1</span><div><b>콘센트 비율</b> — 1인 좌석 대비 콘센트 자리 비율. 70% 이상이면 만점.</div></li>
  <li><span class="ic">2</span><div><b>와이파이 속도</b> — 실측 다운로드 100Mbps 이상이면 만점. (Speedtest 측정)</div></li>
  <li><span class="ic">3</span><div><b>소음 정도</b> — 평일 오후 2시 기준 50dB 이하면 만점.</div></li>
  <li><span class="ic">4</span><div><b>4시간 룰</b> — 4시간 이상 머물러도 회전 압박이 없으면 만점.</div></li>
</ul>
<p class="bd-p">이 4개 항목을 모두 70점 이상 받은 카페만 추렸고, 그 중에서도 평균 90점 이상은 'TOP 3'로 별도 표시했다.</p>`;

    const sec3 = `
<h2 class="bd-h2" id="sec-3"><span class="num">03</span>성수동 작업 카페 TOP 3</h2>
<p class="bd-p">먼저 가장 추천하는 3곳. 평일이든 주말이든 자리만 잡으면 무조건 일이 되는 곳이다.</p>
<h3 class="bd-h3">1. 에슬로우커피 성수점 — 1인 좌석 18석, 모두 콘센트</h3>
<p class="bd-p">성수역 3번 출구에서 5분 거리, 2층 통창. <b>1인 좌석 18석에 콘센트가 모두 붙어있다.</b> 와이파이는 380Mbps. 8시간 머물러도 눈치 안 봐도 되는 분위기. 음료 가격은 다소 있는 편이지만 그만한 가치가 있다.</p>
${renderStoreCard({
  tag: '에디터 PICK', name: '에슬로우커피 성수점', stories: 42, orders: 8230,
  addr: '성수역 3번 출구 도보 5분', emoji: '☕️',
  desc: '1인 좌석 18석 모두 콘센트, 와이파이 380Mbps. 8시간 머물러도 눈치 안 보여요.',
})}
<p class="bd-p">특히 시그니처 메뉴인 에스프레소 토닉은 4시간짜리 작업의 페어링으로 추천. 토닉의 가벼운 단맛이 졸음을 잡아준다.</p>
${renderMenuCard({
  emoji: '🥤', name: '에스프레소 토닉', store: '에슬로우커피 성수점',
  desc: '산미 적은 에스프레소 + 토닉. 4시간짜리 작업의 시그니처 페어링.',
  price: 6500,
})}
<h3 class="bd-h3">2. 포레스트 라운지 — 도서관급 정숙</h3>
<p class="bd-p">성수역 1번 출구 8분. <b>매장 전체가 '대화 자제' 분위기.</b> 키보드 소리도 좀 신경쓰일 정도로 조용하다. 집중이 필요한 작업, 화상 회의 직전 자료 정리 같은 데에 최고.</p>
${renderStoreCard({
  tag: '조용함 1위', name: '포레스트 라운지', stories: 18, orders: 2140,
  addr: '성수역 1번 출구 도보 8분', emoji: '🌿',
  bg: "url('https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=80') center/cover",
  desc: '도서관급 정숙. 키보드 소리도 신경쓰일 정도. 완전 몰입형 작업 환경.',
})}
<h3 class="bd-h3">3. 코너 스튜디오 — 디자이너 손님 비율 1위</h3>
<p class="bd-p">성수동 카페 중 가장 디자이너스럽다. 24인치 듀얼모니터를 들고 와도 어색하지 않은 분위기. 책상 폭이 80cm 이상이라 노트북 + 노트 + 음료 모두 올려도 여유롭다.</p>
${renderFigure('', "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80') center/cover", '코너 스튜디오 2층 — 통유리창 옆 1인석. 평일 오전이면 자리 잡기 쉽다')}`;

    const sec4 = `
<h2 class="bd-h2" id="sec-4"><span class="num">04</span>온종일 머물기 좋은 카페 5곳</h2>
<p class="bd-p">9시 출근, 6시 퇴근까지 가능한 곳들. 점심 시간에 자리를 비워도 짐을 두고 다녀올 수 있는 분위기인지가 핵심.</p>
<h3 class="bd-h3">4. 더 라이브러리 성수</h3>
<p class="bd-p">서가가 인테리어인 북카페. 오전 8시 오픈, 밤 11시까지. <b>좌석 38석 중 콘센트 좌석 28석.</b> 매장 한가운데 8인용 공유 책상이 핵심. 조명이 백색광이라 눈이 덜 피곤하다.</p>
<h3 class="bd-h3">5. 성수 크라프트 베이커리 — 빵집 옆 작업실</h3>
<p class="bd-p">빵집인데 2층이 작업 공간으로 분리되어 있다. 1층 베이커리 향이 적당히 올라와 기분이 좋다. 커피 6,500원 + 빵 가격 부담은 있지만 분위기는 보장.</p>
<h3 class="bd-h3">6. 어반플랜트 성수</h3>
<p class="bd-p">식물 인테리어. 산소가 많아서 그런지 졸림이 덜하다(주관). 콘센트 비율 70%, 와이파이 220Mbps.</p>
<h3 class="bd-h3">7. 모먼트 성수</h3>
<p class="bd-p">성수동 작업 카페 인스타 후기 1위. 사진은 좀 과장된 느낌이지만 실제로 가도 분위기는 좋다. <b>주말 오후엔 자리 잡기 어렵다는 점만 주의.</b></p>
<h3 class="bd-h3">8. 타임 앤 코</h3>
<p class="bd-p">6인용 큰 테이블이 4개. 팀 단위로 가기 좋다. 1인 자리는 4석으로 한정적.</p>`;

    const sec5 = `
<h2 class="bd-h2" id="sec-5"><span class="num">05</span>잠깐 들리기 좋은 카페 4곳</h2>
<p class="bd-p">30분~1시간 정도 가볍게 일할 때 좋은 곳들. 좌석은 적지만 회전이 빨라 자리 잡기 쉽다.</p>
<ul class="bd-list">
  <li><b>스피드 카페 성수</b> — 테이크아웃 위주, 4인석 2개. 12분짜리 미팅 직전에 좋다.</li>
  <li><b>리틀 컵 성수</b> — 카운터 자리 8석. 3시간 이상 머물면 눈치 보임.</li>
  <li><b>오월의 정원</b> — 외부 테이블이 멋지지만 와이파이가 약함.</li>
  <li><b>드립 앤 칠</b> — 드립 커피 전문, 한 잔으로 1시간 즐기기 좋음.</li>
</ul>
${renderFigure('', "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80') center/cover", '짧게 들르기 좋은 곳들 — 한 잔 마시고 떠나는 게 매너')}`;

    const sec6 = `
<h2 class="bd-h2" id="sec-6"><span class="num">06</span>오늘 정리 — 어디부터 가볼까?</h2>
<p class="bd-p">처음 가본다면 <b>1번 에슬로우커피 성수점</b>을 추천한다. 좌석 컨디션, 와이파이, 분위기 모두 평균 이상이다. 조용함이 중요하다면 <b>2번 포레스트 라운지</b>, 분위기와 사진이 중요하다면 <b>7번 모먼트 성수</b>가 좋다.</p>
<p class="bd-p">어느 매장이든 <b>패스오더 앱</b>에서 미리 주문하면 줄 안 서고 받을 수 있다. 자리 잡고 나서 음료 받으러 왔다 갔다 하는 시간이 아깝다면 특히 추천.</p>
<p class="bd-p" style="color:#7D7D7D;font-size:13px;line-height:21px;">카페 정보는 매주 한 번 업데이트해요. 새로 발견한 곳이 있으면 댓글이나 인스타 DM으로 알려주세요.</p>`;

    return `<article class="bd-body">${intro}${sec1}${sec2}${sec3}${sec4}${sec5}${sec6}</article>`;
  }

  /* ---------- 주력 매장 CTA ---------- */
  function renderCtaCard() {
    return `
<aside class="bd-cta-card">
  <h3 class="bd-cta-title">성수동에서<br><b>줄 안 서고</b> 바로 주문해 보세요</h3>
  <div class="bd-cta-store">
    <div class="bd-cta-store-icon" style="background:url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80') center/cover"></div>
    <div>
      <div class="bd-cta-store-name">에슬로우커피 성수점</div>
      <div class="bd-cta-store-sub">성수역 3번 출구 도보 5분</div>
    </div>
  </div>
  <button class="bd-cta-btn">앱으로 3초만에 주문하기</button>
</aside>`;
  }

  /* ---------- 태그 / 좋아요 ---------- */
  function renderTags() {
    const items = TAGS.map(
      (t) => `<span class="bd-tag"><span class="hash">#</span>${esc(t)}</span>`
    ).join('');
    return `<div class="bd-tags">${items}</div>`;
  }

  function renderEngage() {
    return `
<div class="bd-engage">
  <button class="bd-engage-btn" id="bd-like">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    좋아요 <b id="bd-like-count">${ARTICLE.likes}</b>
  </button>
  <button class="bd-engage-btn" aria-label="공유하기">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
    공유하기
  </button>
</div>`;
  }

  /* ---------- 작성자 카드 ---------- */
  function renderAuthorCard() {
    return `
<aside class="bd-author-card">
  <div class="bd-author-card-avatar">${esc(ARTICLE.author[0])}</div>
  <div class="bd-author-card-body">
    <div class="bd-author-card-name">${esc(ARTICLE.author)}</div>
    <div class="bd-author-card-role">${esc(ARTICLE.authorRole)}</div>
    <div class="bd-author-card-bio">${esc(ARTICLE.authorBio)}</div>
  </div>
</aside>`;
  }

  /* ---------- 관련 글 ---------- */
  function renderRelated() {
    const rows = RELATED.map(
      (r) => `
<article class="bd-related-row">
  <div class="bd-related-thumb" style="background:${r.bg}">${esc(r.emoji)}</div>
  <div class="bd-related-body">
    <span class="bd-related-badge">${esc(r.cat)}</span>
    <span class="bd-related-title">${esc(r.title)}</span>
  </div>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
</article>`
    ).join('');
    return `
<section class="bd-section">
  <header class="bd-section-head">
    <h3 class="bd-section-title">관련 글</h3>
    <button class="bd-section-more">전체 보기
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  </header>
  <div class="bd-related-list">${rows}</div>
</section>`;
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    return `
<footer class="bd-footer">
  <div class="bd-footer-brand">패스오더<span class="dot">·</span>매거진</div>
  <div class="bd-footer-tagline">줄 서지 않고 주문하는 방법, 매주 한 편씩.</div>
  <div class="bd-footer-links">
    <a>서비스 소개</a><a>이용약관</a><a>개인정보처리방침</a>
  </div>
  <div class="bd-footer-copy">© 2025 패스오더 (Paytalab Co., Ltd.)</div>
</footer>`;
  }

  /* ---------- mount ---------- */
  function mount() {
    const root = document.getElementById('root');
    root.innerHTML = `
<div class="bd-screen" data-screen-label="블로그 콘텐츠 상세">
  ${renderTopBars()}
  <div class="bd-scroll" id="bd-scroll">
    ${renderProgress()}
    ${renderBreadcrumb()}
    ${renderArticleHead()}
    ${renderHero()}
    ${renderToc()}
    ${renderBody()}
    ${renderCtaCard()}
    ${renderTags()}
    ${renderEngage()}
    ${renderAuthorCard()}
    <div class="bd-block-divider"></div>
    ${renderRelated()}
    ${renderFooter()}
    <div class="bd-bottom-space"></div>
  </div>
</div>`;

    /* TOC toggle */
    const toc = document.getElementById('bd-toc');
    document.getElementById('bd-toc-head').addEventListener('click', () => {
      toc.classList.toggle('open');
      toc.classList.toggle('closed');
    });

    /* TOC item click → scroll to section */
    const scroller = document.getElementById('bd-scroll');
    const tocItems = document.querySelectorAll('.bd-toc-list li');
    tocItems.forEach((li) => {
      li.addEventListener('click', () => {
        const id = li.getAttribute('data-toc');
        const target = document.getElementById(id);
        if (!target) return;
        const top = target.offsetTop - 64;
        scroller.scrollTo({ top, behavior: 'smooth' });
      });
    });

    /* progress bar + active TOC */
    const fill = document.getElementById('bd-progress-fill');
    const sections = TOC.map((t) => document.getElementById(t.id)).filter(Boolean);
    const onScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      const pct = max > 0 ? Math.min(100, (scroller.scrollTop / max) * 100) : 0;
      fill.style.width = pct + '%';
      const probe = scroller.scrollTop + 120;
      let idx = 0;
      sections.forEach((s, i) => { if (s.offsetTop <= probe) idx = i; });
      tocItems.forEach((li, i) => li.classList.toggle('active', i === idx));
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });

    /* like toggle */
    const likeBtn = document.getElementById('bd-like');
    const likeCount = document.getElementById('bd-like-count');
    let liked = false;
    let count = ARTICLE.likes;
    likeBtn.addEventListener('click', () => {
      liked = !liked;
      count += liked ? 1 : -1;
      likeCount.textContent = count;
      likeBtn.classList.toggle('liked', liked);
    });

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
