import { useEffect, useRef, useState } from 'react';
import '../../styles/magazine.css';
import { ARTICLE, TOC, TAGS, RELATED, fmt } from './data';

interface StoreCardProps {
  tag?: string;
  name: string;
  stories?: number;
  orders?: number;
  addr: string;
  emoji?: string;
  desc: string;
  bg?: string;
}

function StoreCard(o: StoreCardProps) {
  return (
    <aside className="bd-store-card">
      <div className="bd-store-card-top">
        <div
          className="bd-store-card-thumb"
          style={{
            background:
              o.bg ||
              "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80') center/cover",
          }}
        />
        <div className="bd-store-card-info">
          {o.tag && <span className="bd-store-card-tag">★ {o.tag}</span>}
          <button type="button" className="bd-store-card-name">
            <span>{o.name}</span>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className="bd-store-card-addr">{o.addr}</div>
          <div className="bd-store-card-stats">
            <span>스토리 <b>{fmt(o.stories || 0)}</b></span>
            <span className="dot" />
            <span>주문 <b>{fmt(o.orders || 0)}</b></span>
          </div>
        </div>
      </div>
      <p className="bd-store-card-desc">{o.desc}</p>
      <button className="bd-store-card-btn primary">
        3초만에 주문하기
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </aside>
  );
}

interface MenuCardProps {
  name: string;
  store: string;
  desc: string;
  price: number;
  bg?: string;
}

function MenuCard(m: MenuCardProps) {
  return (
    <aside className="bd-menu-card">
      <div
        className="bd-menu-card-thumb"
        style={{
          background:
            m.bg ||
            "url('https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=400&q=80') center/cover",
        }}
      />
      <div className="bd-menu-card-body">
        <div className="bd-menu-card-name">{m.name}</div>
        <div className="bd-menu-card-store">{m.store}</div>
        <div className="bd-menu-card-desc">{m.desc}</div>
        <div className="bd-menu-card-foot">
          <span className="bd-menu-card-price">{fmt(m.price)}원</span>
          <span className="bd-menu-card-cta">장바구니에 담기 →</span>
        </div>
      </div>
    </aside>
  );
}

function Figure({ bg, caption }: { bg: string; caption?: string }) {
  return (
    <figure className="bd-figure">
      <div className="bd-figure-img" style={{ background: bg }} role="img" aria-label={caption || ''} />
      {caption && <figcaption className="bd-figure-cap">{caption}</figcaption>}
    </figure>
  );
}

interface MagazinePageProps {
  preview?: boolean;
}

const PREVIEW_CHECKLIST: { group: string; items: string[] }[] = [
  {
    group: '메타 정보',
    items: [
      '타이틀이 운영 발행에 적합한 표현인지',
      '슬러그가 URL-safe 하며 중복되지 않는지',
      '카테고리·태그가 알맞게 매칭되었는지',
      'OG 이미지(썸네일) / 메타 description 누락 여부',
    ],
  },
  {
    group: '본문 표현',
    items: [
      'Notion → 본문 변환 결과에 깨진 블록이 없는지',
      '본문 내 이미지가 모두 로딩되고 캡션이 정확한지',
      'TOC 항목과 실제 H2 섹션이 일치하는지',
      '강조·인용·리스트 스타일이 의도대로 노출되는지',
    ],
  },
  {
    group: '제휴 카드 / CTA',
    items: [
      '가게 카드(StoreCard) 매장 정보·주소·통계 데이터 정확성',
      '메뉴 카드(MenuCard) 가격·설명 최신 여부',
      '하단 CTA 매장이 본문 추천 매장과 일치하는지',
      '주문 CTA 클릭 시 패스오더 앱 진입 링크가 살아있는지',
    ],
  },
  {
    group: '운영 안전',
    items: [
      '`noindex, nofollow` 메타 적용 여부',
      '관련 글 5건이 운영 발행 상태인지',
      '저작권 / 광고성 표기 가이드라인 위배가 없는지',
      '모바일·태블릿 폭에서 레이아웃 깨짐이 없는지',
    ],
  },
];

const PREVIEW_META = {
  slug: 'seongsu-cafe-12',
  buildAt: '2026-05-08 14:32',
  builder: '이주연',
  notionUrl: 'https://www.notion.so/passorder/seongsu-cafe-12',
  backofficeUrl: 'https://backoffice.passorder.com/magazine?slug=seongsu-cafe-12',
  status: 'Preview Built',
};

export default function MagazinePage({ preview = false }: MagazinePageProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const [tocOpen, setTocOpen] = useState(true);
  const [activeTocIdx, setActiveTocIdx] = useState(0);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) =>
    setChecked((c) => ({ ...c, [key]: !c[key] }));

  const totalChecks = PREVIEW_CHECKLIST.reduce((sum, g) => sum + g.items.length, 0);
  const doneChecks = Object.values(checked).filter(Boolean).length;

  useEffect(() => {
    const scroller = scrollerRef.current;
    const fill = fillRef.current;
    if (!scroller || !fill) return;
    const sections = TOC.map((t) => document.getElementById(t.id)).filter((x): x is HTMLElement => !!x);

    const onScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      const pct = max > 0 ? Math.min(100, (scroller.scrollTop / max) * 100) : 0;
      fill.style.width = pct + '%';
      const probe = scroller.scrollTop + 120;
      let idx = 0;
      sections.forEach((s, i) => { if (s.offsetTop <= probe) idx = i; });
      setActiveTocIdx(idx);
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const scroller = scrollerRef.current;
    const target = document.getElementById(id);
    if (!scroller || !target) return;
    scroller.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
  };

  return (
    <div
      className={`bd-screen${preview ? ' bd-screen-preview' : ''}`}
      data-screen-label={preview ? '매거진 콘텐츠 프리뷰' : '매거진 콘텐츠 상세'}
    >
      <div className="bd-statusbar">
        <span>9:41</span>
        <span className="bd-statusbar-icons">
          <svg width={16} height={11} viewBox="0 0 16 11" fill="#333">
            <rect x={0} y={6} width={2} height={5} rx={1} />
            <rect x={4} y={4} width={2} height={7} rx={1} />
            <rect x={8} y={2} width={2} height={9} rx={1} />
            <rect x={12} y={0} width={2} height={11} rx={1} />
          </svg>
          <svg width={14} height={11} viewBox="0 0 14 11" fill="none" stroke="#333" strokeWidth={1.2}>
            <path d="M1 4.5C2.5 3 4.5 2 7 2s4.5 1 6 2.5" />
            <path d="M3 6.8C4 6 5.4 5.4 7 5.4s3 .6 4 1.4" />
            <circle cx={7} cy={9} r={1} fill="#333" />
          </svg>
          <svg width={22} height={11} viewBox="0 0 22 11" fill="none">
            <rect x={0.5} y={0.5} width={18} height={10} rx={2} stroke="#333" />
            <rect x={2} y={2} width={15} height={7} rx={1} fill="#333" />
            <rect x={19} y={3.5} width={1.5} height={4} rx={0.5} fill="#333" />
          </svg>
        </span>
      </div>
      <div className="bd-appbar">
        <button className="bd-appbar-icon" aria-label="뒤로가기">
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="bd-appbar-title" />
        <button className="bd-appbar-icon" aria-label="홈">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>

      {preview && (
        <div className="bd-preview-banner" role="status" aria-label="미리보기 모드">
          <div className="bd-preview-banner-row">
            <span className="bd-preview-badge">PREVIEW</span>
            <span className="bd-preview-title">미리보기 모드 — 운영 발행 전</span>
            <span className="bd-preview-status">{PREVIEW_META.status}</span>
          </div>
          <div className="bd-preview-meta">
            <span><b>슬러그</b> /preview/{PREVIEW_META.slug}</span>
            <span className="bd-preview-dot">·</span>
            <span><b>빌드</b> {PREVIEW_META.buildAt}</span>
            <span className="bd-preview-dot">·</span>
            <span><b>작성자</b> {PREVIEW_META.builder}</span>
            <span className="bd-preview-dot">·</span>
            <span>
              <b>색인</b> <code>noindex, nofollow</code>
            </span>
          </div>
          <div className="bd-preview-actions">
            <a className="bd-preview-link" href={PREVIEW_META.notionUrl} target="_blank" rel="noreferrer">
              Notion 페이지 열기
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
            <a className="bd-preview-link" href={PREVIEW_META.backofficeUrl}>
              백오피스로 돌아가기
            </a>
            <span className="bd-preview-progress">
              체크 {doneChecks}/{totalChecks}
            </span>
          </div>
        </div>
      )}

      <div className="bd-scroll" ref={scrollerRef}>
        <div className="bd-progress">
          <div className="bd-progress-fill" ref={fillRef} />
        </div>

        <nav className="bd-breadcrumb" aria-label="breadcrumb">
          <a>홈</a>
          <span className="sep">›</span>
          <a>매거진</a>
          <span className="sep">›</span>
          <a>{ARTICLE.category}</a>
          <span className="sep">›</span>
          <span className="current">{ARTICLE.title}</span>
        </nav>

        <header className="bd-head">
          <span className="bd-cat-chip">{ARTICLE.category}</span>
          <h1 className="bd-title">{ARTICLE.title}</h1>
          <p className="bd-lead">{ARTICLE.lead}</p>
          <div className="bd-author-row">
            <div className="bd-author-avatar">{ARTICLE.author[0]}</div>
            <div className="bd-author-meta">
              <b className="bd-author-name">{ARTICLE.author}</b>
              <span className="bd-author-sub">
                {ARTICLE.date} · 읽기 <b>{ARTICLE.readTime}분</b>
              </span>
            </div>
          </div>
        </header>

        <div className="bd-hero" role="img" aria-label="성수동 카페 분위기" />

        <section className={`bd-toc ${tocOpen ? 'open' : 'closed'}`} id="bd-toc">
          <button className="bd-toc-head" onClick={() => setTocOpen((o) => !o)}>
            <span className="bd-toc-emoji">☕️</span>
            <span className="bd-toc-title">목차</span>
            <span className="bd-toc-count">{TOC.length}</span>
            <span className="bd-toc-toggle">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>
          <ul className="bd-toc-list">
            {TOC.map((t, i) => (
              <li
                key={t.id}
                data-toc={t.id}
                className={i === activeTocIdx ? 'active' : undefined}
                onClick={() => scrollTo(t.id)}
              >
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <span>{t.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {preview && (
          <section className="bd-preview-checklist" aria-label="프리뷰 점검 체크리스트">
            <header className="bd-preview-checklist-head">
              <div>
                <span className="bd-preview-checklist-eyebrow">발행 전 점검</span>
                <h2 className="bd-preview-checklist-title">QA 체크리스트</h2>
                <p className="bd-preview-checklist-desc">
                  아래 항목을 모두 확인한 뒤 백오피스 사이드 패널에서 <b>이 버전으로 발행</b>을 눌러 주세요.
                  체크 상태는 미리보기 화면 안에서만 유지되며 운영에 영향을 주지 않습니다.
                </p>
              </div>
              <div className="bd-preview-checklist-counter">
                <b>{doneChecks}</b>
                <span>/ {totalChecks}</span>
              </div>
            </header>
            <div className="bd-preview-checklist-grid">
              {PREVIEW_CHECKLIST.map((g) => (
                <div className="bd-preview-checklist-group" key={g.group}>
                  <div className="bd-preview-checklist-group-title">{g.group}</div>
                  <ul>
                    {g.items.map((it, i) => {
                      const key = `${g.group}-${i}`;
                      const on = !!checked[key];
                      return (
                        <li key={key}>
                          <label className={`bd-preview-check${on ? ' on' : ''}`}>
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() => toggleCheck(key)}
                            />
                            <span className="bd-preview-check-box" aria-hidden>
                              {on && (
                                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </span>
                            <span className="bd-preview-check-label">{it}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <footer className="bd-preview-checklist-foot">
              ⚠️ 본 페이지는 사내 네트워크 한정 미리보기입니다. 외부 공유 / 캡처 배포 시 발행 정책 위반이 될 수 있어요.
            </footer>
          </section>
        )}

        <article className="bd-body">
          <p className="bd-p">
            성수동에서 일주일에 두세 번 작업을 한다. 그러다 보니 <span className="bd-quote-soft">'콘센트가 있는 자리, 와이파이가 빠른 곳, 4시간 머물러도 눈치 안 보이는 곳'</span>의 조건이 명확해졌다. 이 글에서 정리한 12곳은 모두 직접 노트북을 들고 가서 90분 이상 작업해 본 곳이다.
          </p>

          <h2 className="bd-h2" id="sec-1"><span className="num">01</span>성수동에서 작업하기 좋은 카페란?</h2>
          <p className="bd-p">흔히 '카공족 카페'라고 검색하면 분위기 있고 조명만 예쁜 곳이 많이 나온다. 하지만 정작 가보면 콘센트가 1자리뿐이거나, 와이파이가 끊기거나, 옆 자리 회의 소리가 너무 커서 30분도 못 버티는 경우가 많다.</p>
          <p className="bd-p">이 글의 기준은 <b>'노트북으로 진짜 일이 되는 곳'</b>이다. 카페에서 일을 해본 사람이라면 공감할 만한, 까다로운 4가지 조건으로 걸러냈다.</p>
          <p className="bd-p">성수동은 작업 카페의 격전지다. 카페가 많아도 좋은 곳은 결국 정해져 있다. 이 글이 그 시간을 줄여드릴 수 있다면 좋겠다.</p>

          <h2 className="bd-h2" id="sec-2"><span className="num">02</span>에디터의 4가지 평가 기준</h2>
          <p className="bd-p">각 카페를 100점 기준으로 평가했다. 80점 이상만 이 글에 실었다.</p>
          <ul className="bd-criteria">
            <li><span className="ic">1</span><div><b>콘센트 비율</b> — 1인 좌석 대비 콘센트 자리 비율. 70% 이상이면 만점.</div></li>
            <li><span className="ic">2</span><div><b>와이파이 속도</b> — 실측 다운로드 100Mbps 이상이면 만점. (Speedtest 측정)</div></li>
            <li><span className="ic">3</span><div><b>소음 정도</b> — 평일 오후 2시 기준 50dB 이하면 만점.</div></li>
            <li><span className="ic">4</span><div><b>4시간 룰</b> — 4시간 이상 머물러도 회전 압박이 없으면 만점.</div></li>
          </ul>
          <p className="bd-p">이 4개 항목을 모두 70점 이상 받은 카페만 추렸고, 그 중에서도 평균 90점 이상은 'TOP 3'로 별도 표시했다.</p>

          <h2 className="bd-h2" id="sec-3"><span className="num">03</span>성수동 작업 카페 TOP 3</h2>
          <p className="bd-p">먼저 가장 추천하는 3곳. 평일이든 주말이든 자리만 잡으면 무조건 일이 되는 곳이다.</p>
          <h3 className="bd-h3">1. 에슬로우커피 성수점 — 1인 좌석 18석, 모두 콘센트</h3>
          <p className="bd-p">성수역 3번 출구에서 5분 거리, 2층 통창. <b>1인 좌석 18석에 콘센트가 모두 붙어있다.</b> 와이파이는 380Mbps. 8시간 머물러도 눈치 안 봐도 되는 분위기. 음료 가격은 다소 있는 편이지만 그만한 가치가 있다.</p>
          <StoreCard
            tag="에디터 PICK"
            name="에슬로우커피 성수점"
            stories={42}
            orders={8230}
            addr="성수역 3번 출구 도보 5분"
            emoji="☕️"
            desc="1인 좌석 18석 모두 콘센트, 와이파이 380Mbps. 8시간 머물러도 눈치 안 보여요."
          />
          <p className="bd-p">특히 시그니처 메뉴인 에스프레소 토닉은 4시간짜리 작업의 페어링으로 추천. 토닉의 가벼운 단맛이 졸음을 잡아준다.</p>
          <MenuCard
            name="에스프레소 토닉"
            store="에슬로우커피 성수점"
            desc="산미 적은 에스프레소 + 토닉. 4시간짜리 작업의 시그니처 페어링."
            price={6500}
          />
          <h3 className="bd-h3">2. 포레스트 라운지 — 도서관급 정숙</h3>
          <p className="bd-p">성수역 1번 출구 8분. <b>매장 전체가 '대화 자제' 분위기.</b> 키보드 소리도 좀 신경쓰일 정도로 조용하다. 집중이 필요한 작업, 화상 회의 직전 자료 정리 같은 데에 최고.</p>
          <StoreCard
            tag="조용함 1위"
            name="포레스트 라운지"
            stories={18}
            orders={2140}
            addr="성수역 1번 출구 도보 8분"
            emoji="🌿"
            bg="url('https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=80') center/cover"
            desc="도서관급 정숙. 키보드 소리도 신경쓰일 정도. 완전 몰입형 작업 환경."
          />
          <h3 className="bd-h3">3. 코너 스튜디오 — 디자이너 손님 비율 1위</h3>
          <p className="bd-p">성수동 카페 중 가장 디자이너스럽다. 24인치 듀얼모니터를 들고 와도 어색하지 않은 분위기. 책상 폭이 80cm 이상이라 노트북 + 노트 + 음료 모두 올려도 여유롭다.</p>
          <Figure
            bg="url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80') center/cover"
            caption="코너 스튜디오 2층 — 통유리창 옆 1인석. 평일 오전이면 자리 잡기 쉽다"
          />

          <h2 className="bd-h2" id="sec-4"><span className="num">04</span>온종일 머물기 좋은 카페 5곳</h2>
          <p className="bd-p">9시 출근, 6시 퇴근까지 가능한 곳들. 점심 시간에 자리를 비워도 짐을 두고 다녀올 수 있는 분위기인지가 핵심.</p>
          <h3 className="bd-h3">4. 더 라이브러리 성수</h3>
          <p className="bd-p">서가가 인테리어인 북카페. 오전 8시 오픈, 밤 11시까지. <b>좌석 38석 중 콘센트 좌석 28석.</b> 매장 한가운데 8인용 공유 책상이 핵심. 조명이 백색광이라 눈이 덜 피곤하다.</p>
          <h3 className="bd-h3">5. 성수 크라프트 베이커리 — 빵집 옆 작업실</h3>
          <p className="bd-p">빵집인데 2층이 작업 공간으로 분리되어 있다. 1층 베이커리 향이 적당히 올라와 기분이 좋다. 커피 6,500원 + 빵 가격 부담은 있지만 분위기는 보장.</p>
          <h3 className="bd-h3">6. 어반플랜트 성수</h3>
          <p className="bd-p">식물 인테리어. 산소가 많아서 그런지 졸림이 덜하다(주관). 콘센트 비율 70%, 와이파이 220Mbps.</p>
          <h3 className="bd-h3">7. 모먼트 성수</h3>
          <p className="bd-p">성수동 작업 카페 인스타 후기 1위. 사진은 좀 과장된 느낌이지만 실제로 가도 분위기는 좋다. <b>주말 오후엔 자리 잡기 어렵다는 점만 주의.</b></p>
          <h3 className="bd-h3">8. 타임 앤 코</h3>
          <p className="bd-p">6인용 큰 테이블이 4개. 팀 단위로 가기 좋다. 1인 자리는 4석으로 한정적.</p>

          <h2 className="bd-h2" id="sec-5"><span className="num">05</span>잠깐 들리기 좋은 카페 4곳</h2>
          <p className="bd-p">30분~1시간 정도 가볍게 일할 때 좋은 곳들. 좌석은 적지만 회전이 빨라 자리 잡기 쉽다.</p>
          <ul className="bd-list">
            <li><b>스피드 카페 성수</b> — 테이크아웃 위주, 4인석 2개. 12분짜리 미팅 직전에 좋다.</li>
            <li><b>리틀 컵 성수</b> — 카운터 자리 8석. 3시간 이상 머물면 눈치 보임.</li>
            <li><b>오월의 정원</b> — 외부 테이블이 멋지지만 와이파이가 약함.</li>
            <li><b>드립 앤 칠</b> — 드립 커피 전문, 한 잔으로 1시간 즐기기 좋음.</li>
          </ul>
          <Figure
            bg="url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80') center/cover"
            caption="짧게 들르기 좋은 곳들 — 한 잔 마시고 떠나는 게 매너"
          />

          <h2 className="bd-h2" id="sec-6"><span className="num">06</span>오늘 정리 — 어디부터 가볼까?</h2>
          <p className="bd-p">처음 가본다면 <b>1번 에슬로우커피 성수점</b>을 추천한다. 좌석 컨디션, 와이파이, 분위기 모두 평균 이상이다. 조용함이 중요하다면 <b>2번 포레스트 라운지</b>, 분위기와 사진이 중요하다면 <b>7번 모먼트 성수</b>가 좋다.</p>
          <p className="bd-p">어느 매장이든 <b>패스오더 앱</b>에서 미리 주문하면 줄 안 서고 받을 수 있다. 자리 잡고 나서 음료 받으러 왔다 갔다 하는 시간이 아깝다면 특히 추천.</p>
          <p className="bd-p" style={{ color: '#7D7D7D', fontSize: 13, lineHeight: '21px' }}>카페 정보는 매주 한 번 업데이트해요. 새로 발견한 곳이 있으면 댓글이나 인스타 DM으로 알려주세요.</p>
        </article>

        <aside className="bd-cta-card">
          <h3 className="bd-cta-title">성수동에서<br /><b>줄 안 서고</b> 바로 주문해 보세요</h3>
          <div className="bd-cta-store">
            <div className="bd-cta-store-icon" style={{ background: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80') center/cover" }} />
            <div>
              <div className="bd-cta-store-name">에슬로우커피 성수점</div>
              <div className="bd-cta-store-sub">성수역 3번 출구 도보 5분</div>
            </div>
          </div>
          <button className="bd-cta-btn">앱으로 3초만에 주문하기</button>
        </aside>

        <div className="bd-tags">
          {TAGS.map((t) => (
            <span className="bd-tag" key={t}>
              <span className="hash">#</span>
              {t}
            </span>
          ))}
        </div>

        <div className="bd-engage">
          <button className="bd-engage-btn" aria-label="공유하기">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx={18} cy={5} r={3} />
              <circle cx={6} cy={12} r={3} />
              <circle cx={18} cy={19} r={3} />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            공유하기
          </button>
        </div>

        <div className="bd-block-divider" />

        <section className="bd-section">
          <header className="bd-section-head">
            <h3 className="bd-section-title">관련 글</h3>
            <button className="bd-section-more">
              전체 보기
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </header>
          <div className="bd-related-list">
            {RELATED.map((r, i) => (
              <article className="bd-related-row" key={i}>
                <div className="bd-related-thumb" style={{ background: r.bg }}>{r.emoji}</div>
                <div className="bd-related-body">
                  <span className="bd-related-badge">{r.cat}</span>
                  <span className="bd-related-title">{r.title}</span>
                </div>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </article>
            ))}
          </div>
        </section>

        <footer className="bd-footer">
          <div className="bd-footer-brand">패스오더<span className="dot">·</span>매거진</div>
          <div className="bd-footer-tagline">줄 서지 않고 주문하는 방법, 매주 한 편씩.</div>
          <div className="bd-footer-links">
            <a>서비스 소개</a>
            <a>이용약관</a>
            <a>개인정보처리방침</a>
          </div>
          <div className="bd-footer-copy">© 2025 패스오더 (Paytalab Co., Ltd.)</div>
        </footer>

        <div className="bd-bottom-space" />
      </div>
    </div>
  );
}
