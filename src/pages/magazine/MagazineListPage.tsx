import { useState } from 'react';
import '../../styles/tokens.css';
import '../../styles/magazine-list.css';

interface Category {
  id: string;
  label: string;
  count: number;
  emoji?: string;
}

interface Article {
  id: string;
  category: string;
  title: string;
  desc: string;
  author: string;
  date: string;
  badge?: string;
  emoji: string;
  variant: 'peach' | 'mint' | 'cream' | 'sky';
}

const CATEGORIES: Category[] = [
  { id: 'all', label: '전체', count: 284 },
  { id: 'tip', label: '패스오더 이용 팁', count: 42, emoji: '📲' },
  { id: 'cafe', label: '카페 비교/추천', count: 96, emoji: '☕️' },
  { id: 'food', label: '맛집 추천', count: 78, emoji: '🍱' },
  { id: 'event', label: '이벤트', count: 24, emoji: '🎁' },
];

const ARTICLES: Article[] = [
  {
    id: 'a1',
    category: '카페 비교/추천',
    title: '성수동 노트북 작업 카페 12곳 — 콘센트, 와이파이, 분위기까지',
    desc: '주말마다 노트북 들고 카페 투어를 다닌 에디터가 직접 가본 12곳을 콘센트 자리·와이파이 속도까지 정리했어요.',
    author: '이주연',
    date: '2025.11.28',
    badge: '에디터 PICK',
    emoji: '☕️',
    variant: 'peach',
  },
  {
    id: 'a2',
    category: '패스오더 이용 팁',
    title: '주문 3초 단축, 즐겨찾기 200% 활용법',
    desc: '자주 가는 매장은 즐겨찾기에 추가하고, 단축 주문으로 출근길 시간을 줄여보세요.',
    author: '편집부',
    date: '2025.11.25',
    emoji: '📱',
    variant: 'mint',
  },
  {
    id: 'a3',
    category: '이벤트',
    title: '11월 한정 — 첫 주문 3,000원 할인 쿠폰',
    desc: '패스오더 신규 가입 회원이라면 누구나, 한 잔 가격을 줄여주는 첫 주문 쿠폰을 챙겨가세요.',
    author: '편집부',
    date: '2025.11.20',
    emoji: '🎁',
    variant: 'peach',
  },
  {
    id: 'a4',
    category: '카페 비교/추천',
    title: '강남역 30분 미팅에 좋은 카페 6곳',
    desc: '회의 직전 짧게 들르기 좋은 매장만 골라봤어요.',
    author: '김도현',
    date: '2025.11.18',
    emoji: '🥐',
    variant: 'cream',
  },
  {
    id: 'a5',
    category: '맛집 추천',
    title: '연남동 점심 한 끼 — 줄 안 서고 먹는 법',
    desc: '점심 피크에도 줄 없이 먹을 수 있는 패스오더 매장 모음.',
    author: '박서윤',
    date: '2025.11.14',
    emoji: '🍜',
    variant: 'sky',
  },
  {
    id: 'a6',
    category: '패스오더 이용 팁',
    title: '쿠폰 자동 적용, 한 번에 확인하는 법',
    desc: '결제 직전에 적용 가능한 쿠폰이 자동으로 떠요. 놓치기 쉬운 설정 한 가지.',
    author: '편집부',
    date: '2025.11.11',
    emoji: '🎫',
    variant: 'mint',
  },
  {
    id: 'a7',
    category: '카페 비교/추천',
    title: '비 오는 날 가기 좋은 도심 카페 8곳',
    desc: '창가 자리, 따뜻한 라떼, 잔잔한 플레이리스트가 있는 곳.',
    author: '이주연',
    date: '2025.11.07',
    emoji: '☔️',
    variant: 'sky',
  },
  {
    id: 'a8',
    category: '맛집 추천',
    title: '한남동 베이커리 BEST 5 — 평일 오전 추천',
    desc: '갓 구운 빵을 줄 없이 받기 좋은 시간대까지 정리했어요.',
    author: '김도현',
    date: '2025.11.04',
    emoji: '🥐',
    variant: 'cream',
  },
  {
    id: 'a9',
    category: '이벤트',
    title: '12월 패스오더 X 카페 라운드 시즌',
    desc: '제휴 매장 한정, 한 잔 무료 쿠폰을 챙겨가세요.',
    author: '편집부',
    date: '2025.10.30',
    emoji: '🎄',
    variant: 'peach',
  },
];

type ViewMode = 'grid' | 'list';
type SortOption = '최신순' | '인기순';
const SORT_OPTIONS: SortOption[] = ['최신순', '인기순'];

export default function MagazineListPage() {
  const [activeCat, setActiveCat] = useState('all');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sort, setSort] = useState<SortOption>('최신순');
  const [sortOpen, setSortOpen] = useState(false);

  const [featured, ...rest] = ARTICLES;

  return (
    <div className="ml-screen" data-screen-label="매거진 리스트">
      <div className="ml-statusbar">
        <span>9:41</span>
        <span className="ml-statusbar-icons">
          <svg width={18} height={12} viewBox="0 0 18 12" fill="#000">
            <rect x={0} y={7} width={2.5} height={5} rx={1} />
            <rect x={4.5} y={5} width={2.5} height={7} rx={1} />
            <rect x={9} y={3} width={2.5} height={9} rx={1} />
            <rect x={13.5} y={0} width={2.5} height={12} rx={1} />
          </svg>
          <svg width={16} height={12} viewBox="0 0 16 12" fill="none" stroke="#000" strokeWidth={1.3}>
            <path d="M1 4.5C2.7 3 5 2 8 2s5.3 1 7 2.5" />
            <path d="M3.2 7.2C4.4 6.3 6 5.7 8 5.7s3.6.6 4.8 1.5" />
            <circle cx={8} cy={10} r={1.1} fill="#000" />
          </svg>
          <svg width={26} height={12} viewBox="0 0 26 12" fill="none">
            <rect x={0.5} y={0.5} width={22} height={11} rx={2.5} stroke="#000" />
            <rect x={2} y={2} width={19} height={8} rx={1.5} fill="#000" />
            <rect x={23} y={4} width={1.8} height={4} rx={0.6} fill="#000" />
          </svg>
        </span>
      </div>

      <div className="ml-appbar">
        <button className="ml-appbar-icon" aria-label="뒤로가기">
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="ml-appbar-brand">
          <span className="ml-appbar-logo">P</span>
          <span className="ml-appbar-title">
            <span className="accent">패스오더</span> 매거진
          </span>
        </div>
        <button className="ml-appbar-icon" aria-label="공유">
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx={18} cy={5} r={3} />
            <circle cx={6} cy={12} r={3} />
            <circle cx={18} cy={19} r={3} />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
        <button className="ml-appbar-icon" aria-label="더보기">
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx={12} cy={5} r={1.4} />
            <circle cx={12} cy={12} r={1.4} />
            <circle cx={12} cy={19} r={1.4} />
          </svg>
        </button>
      </div>

      <div className="ml-scroll">
        <section className="ml-hero">
          <span className="ml-hero-eyebrow">패스오더 매거진</span>
          <h1 className="ml-hero-title">
            줄 서지 않고<br />
            주문하는 방법, 매주 한 편.
          </h1>
          <p className="ml-hero-desc">
            동네에서 진짜 가볼 만한 곳, 매거진 에디터가 직접 다녀와서 정리해요.
          </p>
        </section>

        <label className="ml-search">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx={11} cy={11} r={7} />
            <line x1="20" y1="20" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="동네, 메뉴, 키워드로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <div className="ml-chips" role="tablist">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={activeCat === c.id}
              className={`ml-chip${activeCat === c.id ? ' active' : ''}`}
              onClick={() => setActiveCat(c.id)}
            >
              {c.emoji && <span aria-hidden>{c.emoji}</span>}
              <span>{c.label}</span>
              <span className="count">{c.count}</span>
            </button>
          ))}
        </div>

        <div className="ml-list">
          <article className="ml-card featured">
            <div className={`ml-card-thumb variant-${featured.variant}`}>
              {featured.badge && <span className="ml-card-badge">{featured.badge}</span>}
              <span className="ml-card-thumb-emoji" aria-hidden>{featured.emoji}</span>
            </div>
            <div className="ml-card-body">
              <span className="ml-card-cat">{featured.category}</span>
              <h2 className="ml-card-title">{featured.title}</h2>
              <p className="ml-card-desc">{featured.desc}</p>
              <div className="ml-card-meta">
                <span className="author">{featured.author}</span>
                <span className="dot" />
                <span>{featured.date}</span>
              </div>
            </div>
          </article>
        </div>

        <section className="ml-latest" aria-label="최신 글">
          <header className="ml-latest-head">
            <div className="ml-latest-head-left">
              <h2 className="ml-latest-title">최신 글</h2>
              <span className="ml-latest-count">{rest.length}개의 글</span>
            </div>
            <span className="ml-latest-cadence">매주 화·금 업데이트</span>
          </header>

          <div className="ml-latest-controls">
            <div className="ml-sort">
              <button
                type="button"
                className="ml-sort-btn"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen((v) => !v)}
              >
                <span>{sort}</span>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {sortOpen && (
                <ul className="ml-sort-menu" role="listbox">
                  {SORT_OPTIONS.map((opt) => (
                    <li key={opt} role="option" aria-selected={sort === opt}>
                      <button
                        type="button"
                        className={`ml-sort-item${sort === opt ? ' active' : ''}`}
                        onClick={() => {
                          setSort(opt);
                          setSortOpen(false);
                        }}
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="ml-view-toggle" role="group" aria-label="보기 방식">
              <button
                type="button"
                aria-label="그리드 보기"
                aria-pressed={viewMode === 'grid'}
                className={`ml-view-btn${viewMode === 'grid' ? ' active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.2" />
                  <rect x="14" y="3" width="7" height="7" rx="1.2" />
                  <rect x="3" y="14" width="7" height="7" rx="1.2" />
                  <rect x="14" y="14" width="7" height="7" rx="1.2" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="리스트 보기"
                aria-pressed={viewMode === 'list'}
                className={`ml-view-btn${viewMode === 'list' ? ' active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="ml-latest-grid">
              {rest.map((a) => (
                <article className="ml-card" key={a.id}>
                  <div className={`ml-card-thumb variant-${a.variant}`}>
                    <span className="ml-card-thumb-emoji" aria-hidden>{a.emoji}</span>
                  </div>
                  <div className="ml-card-body">
                    <span className="ml-card-cat">{a.category}</span>
                    <h3 className="ml-card-title">{a.title}</h3>
                    <div className="ml-card-meta">
                      <span>{a.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <ul className="ml-latest-rows">
              {rest.map((a) => (
                <li key={a.id}>
                  <article className="ml-row">
                    <div className={`ml-row-thumb variant-${a.variant}`}>
                      <span aria-hidden>{a.emoji}</span>
                    </div>
                    <div className="ml-row-body">
                      <span className="ml-card-cat">{a.category}</span>
                      <h3 className="ml-row-title">{a.title}</h3>
                      <div className="ml-card-meta">
                        <span className="author">{a.author}</span>
                        <span className="dot" />
                        <span>{a.date}</span>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>

      <div className="ml-home-indicator">
        <span />
      </div>
    </div>
  );
}
