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
  readTime: number;
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
    readTime: 8,
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
    readTime: 4,
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
    readTime: 2,
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
    readTime: 5,
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
    readTime: 6,
    emoji: '🍜',
    variant: 'sky',
  },
];

export default function MagazineListPage() {
  const [activeCat, setActiveCat] = useState('all');
  const [query, setQuery] = useState('');

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
                <span className="dot" />
                <span>읽기 {featured.readTime}분</span>
              </div>
            </div>
          </article>

          <div className="ml-grid-2">
            {rest.slice(0, 2).map((a) => (
              <article className="ml-card" key={a.id}>
                <div className={`ml-card-thumb variant-${a.variant}`}>
                  <span className="ml-card-thumb-emoji" aria-hidden>{a.emoji}</span>
                </div>
                <div className="ml-card-body">
                  <span className="ml-card-cat">{a.category}</span>
                  <h3 className="ml-card-title">{a.title}</h3>
                  <div className="ml-card-meta">
                    <span>{a.date}</span>
                    <span className="dot" />
                    <span>읽기 {a.readTime}분</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {rest.slice(2).map((a) => (
            <article className="ml-card" key={a.id}>
              <div className={`ml-card-thumb variant-${a.variant}`}>
                <span className="ml-card-thumb-emoji" aria-hidden>{a.emoji}</span>
              </div>
              <div className="ml-card-body">
                <span className="ml-card-cat">{a.category}</span>
                <h3 className="ml-card-title">{a.title}</h3>
                <p className="ml-card-desc">{a.desc}</p>
                <div className="ml-card-meta">
                  <span className="author">{a.author}</span>
                  <span className="dot" />
                  <span>{a.date}</span>
                  <span className="dot" />
                  <span>읽기 {a.readTime}분</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="ml-home-indicator">
        <span />
      </div>
    </div>
  );
}
