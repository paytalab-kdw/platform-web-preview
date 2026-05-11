import { useEffect, useRef, useState } from 'react';
import '../../styles/store.css';
import {
  STORE,
  HERO_IMAGES,
  POPULAR_MENUS,
  NEWS_ITEMS,
  STORY_ITEMS,
  TOTAL_STORIES,
  BADGE_PALETTE,
  fmt,
  type PopularMenu,
  type NewsItem,
  type StoryItem,
} from './data';

const ChevronRight = (props: { stroke?: string; size?: number; strokeWidth?: number }) => {
  const { stroke = 'currentColor', size = 14, strokeWidth = 2 } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
};

const HomeIcon = ({ stroke = '#fff', size = 20 }: { stroke?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PinIcon = ({ stroke = '#7D7D7D', size = 16 }: { stroke?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = ({ stroke = '#7D7D7D' }: { stroke?: string }) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChevronDown = ({ stroke = '#7D7D7D' }: { stroke?: string }) => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const PhoneIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const ShareIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={18} cy={5} r={3} />
    <circle cx={6} cy={12} r={3} />
    <circle cx={18} cy={19} r={3} />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const HeartIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FF7949" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

function MenuRow({ m }: { m: PopularMenu }) {
  const isDeal = m.type === 'deal';
  const isDiscount = m.type === 'discount';
  const tags = m.tags || [];
  return (
    <div className="sd-menu-row">
      <div className="sd-menu-row-body">
        <div className="sd-menu-name">{m.name}</div>
        <div className="sd-menu-price-row">
          <b className="sd-menu-price">{fmt(m.price)}</b>
          {m.oldPrice && (
            <span className={`sd-menu-price-old${isDiscount ? ' discount' : ''}`}>{fmt(m.oldPrice)}</span>
          )}
        </div>
        {m.desc && <p className="sd-menu-desc">{m.desc}</p>}
        {isDiscount && tags.length > 0 && (
          <div className="sd-menu-tags">
            {tags.includes('passorder') && (
              <span className="sd-menu-tag sd-menu-tag-passorder">
                <svg className="sd-menu-tag-icon" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                  <path d="M6 1.2l1.4 2.8 3.1.45-2.25 2.2.53 3.1L6 8.3 3.22 9.75l.53-3.1L1.5 4.45l3.1-.45z" />
                </svg>
                패스오더할인
              </span>
            )}
            {tags.includes('takeout') && (
              <span className="sd-menu-tag sd-menu-tag-takeout">
                <svg className="sd-menu-tag-icon" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.1} aria-hidden>
                  <path d="M2.5 4.5h7l-.7 5a.8.8 0 0 1-.8.7H4a.8.8 0 0 1-.8-.7l-.7-5z" />
                  <path d="M4 4.5V3.2A1.2 1.2 0 0 1 5.2 2h1.6A1.2 1.2 0 0 1 8 3.2v1.3" />
                </svg>
                테이크아웃할인
              </span>
            )}
          </div>
        )}
      </div>
      <div className="sd-menu-thumb" style={{ background: m.bg }}>
        {isDeal && <span className="sd-menu-thumb-tag">100원</span>}
      </div>
    </div>
  );
}

function NewsCard({ n }: { n: NewsItem }) {
  return (
    <article className="sd-news-card">
      <div className="sd-news-body">
        <div className="sd-news-row">
          <div className="sd-news-text">
            <div className="sd-news-tags">
              <span className="sd-news-tag sd-news-tag-progress">{n.tag}</span>
              <span className="sd-news-tag sd-news-tag-type">{n.type}</span>
            </div>
            <h3 className="sd-news-title">{n.title}</h3>
            <span className="sd-news-views">
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden>
                <ellipse cx={6} cy={6} rx={5} ry={3} />
                <circle cx={6} cy={6} r={1.5} fill="currentColor" stroke="none" />
              </svg>
              {n.views}
            </span>
          </div>
          <div className="sd-news-thumb" style={{ background: n.bg }}>
            <span>{n.emoji}</span>
          </div>
        </div>
        <div className="sd-news-meta-wrap">
          {n.desc && <p className="sd-news-meta-desc">{n.desc}</p>}
          <ul className="sd-news-meta">
            <li>
              <span className="sd-news-meta-icon">
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" aria-hidden>
                  <circle cx={6} cy={6} r={5.5} fill="#AAA" />
                  <path d="M4.3 7.7L7.7 4.3" stroke="#fff" strokeWidth={0.9} strokeLinecap="round" />
                  <circle cx={4.5} cy={4.5} r={0.65} fill="#fff" />
                  <circle cx={7.5} cy={7.5} r={0.65} fill="#fff" />
                </svg>
              </span>
              {n.discount}
            </li>
            <li>
              <span className="sd-news-meta-icon">
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="#AAA" strokeWidth={1} aria-hidden>
                  <rect x="1.5" y="2.5" width={9} height={8} rx={1} />
                  <line x1="1.5" y1="5" x2="10.5" y2="5" />
                  <line x1="4" y1="1.5" x2="4" y2="3.5" />
                  <line x1="8" y1="1.5" x2="8" y2="3.5" />
                </svg>
              </span>
              {n.period}
            </li>
            <li>
              <span className="sd-news-meta-icon">
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="#AAA" strokeWidth={1} aria-hidden>
                  <circle cx={6} cy={6} r={4.5} />
                  <polyline points="6 3.5 6 6 7.6 7.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {n.schedule}
            </li>
            <li>
              <span className="sd-news-meta-icon">
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="#AAA" strokeWidth={1} aria-hidden>
                  <circle cx={6} cy={6} r={4.5} />
                  <line x1="6" y1="3.8" x2="6" y2="6.5" strokeLinecap="round" />
                  <circle cx={6} cy={8.4} r={0.55} fill="#AAA" stroke="none" />
                </svg>
              </span>
              {n.repeat}
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}

function StoryItemView({ s }: { s: StoryItem }) {
  return (
    <article className="sd-story-item">
      <header className="sd-story-head">
        <div className="sd-story-avatar" style={{ background: s.avatarBg }}>{s.user[0]}</div>
        <div className="sd-story-meta">
          <b className="sd-story-user">{s.user}</b>
          <span className="sd-story-date">{s.date}</span>
        </div>
      </header>
      <div className="sd-story-body">
        <div className="sd-story-text-wrap">
          <p className="sd-story-text">{s.text}</p>
          <span className="sd-story-stat">
            <HeartIcon />
            좋아요 {s.likes}
          </span>
        </div>
        <div className="sd-story-photo" style={{ background: s.bg }}>
          <span>{s.emoji}</span>
        </div>
      </div>
    </article>
  );
}

export default function StorePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [newsIdx, setNewsIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const w = track.offsetWidth;
      if (!w) return;
      setNewsIdx(Math.round(track.scrollLeft / w));
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  const handleNewsDot = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.offsetWidth, behavior: 'smooth' });
  };

  return (
    <div className="sd-screen" data-screen-label="매장 상세">
      <div className="sd-scroll">
        {/* Header */}
        <div className="sd-header">
          <div className="sd-promo">
            <div className="sd-promo-left">
              <span className="sd-promo-icon">🎁</span>
              <span className="sd-promo-text">{STORE.promo}</span>
            </div>
            <button className="sd-promo-cta">
              선착순 받기
              <ChevronRight strokeWidth={2.5} />
            </button>
          </div>
          <div className="sd-hero">
            <div className="sd-hero-bg" style={{ background: HERO_IMAGES[heroIdx] }} />
            <button className="sd-hero-home" aria-label="홈">
              <HomeIcon />
            </button>
            <div className="sd-hero-badges">
              {STORE.badges.map((b, i) => {
                const p = BADGE_PALETTE[i] || { bg: '#132D48', color: '#fff' };
                return (
                  <span key={i} className="sd-hero-badge" style={{ background: p.bg, color: p.color }}>
                    {i === 0 ? '🏷 ' : ''}
                    {b}
                  </span>
                );
              })}
            </div>
            <div className="sd-hero-bottom">
              <span className="sd-hero-stat">주문수 {STORE.orders}</span>
              <div className="sd-hero-dots">
                {HERO_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    className={`sd-hero-dot${i === heroIdx ? ' active' : ''}`}
                    onClick={() => setHeroIdx(i)}
                    aria-label={`이미지 ${i + 1}`}
                  />
                ))}
              </div>
              <span className="sd-hero-status">
                <span className="sd-hero-status-dot" />
                지금 수령 가능!
              </span>
            </div>
          </div>
        </div>

        {/* Store info */}
        <div className="sd-info">
          <h1 className="sd-info-name">{STORE.name}</h1>
          <p className="sd-info-desc">
            {STORE.desc1}
            <br />
            {STORE.desc2}
          </p>
          <ul className="sd-info-meta">
            <li>
              <span className="sd-info-meta-icon">
                <HomeIcon stroke="#7D7D7D" size={16} />
              </span>
              {STORE.address}
            </li>
            <li>
              <span className="sd-info-meta-icon">
                <PinIcon />
              </span>
              {STORE.distance}
            </li>
            <li>
              <span className="sd-info-meta-icon">
                <ClockIcon />
              </span>
              {STORE.hours}
              <ChevronDown />
            </li>
          </ul>
          <div className="sd-actions">
            <button className="sd-action-btn">
              <PhoneIcon />
              전화
            </button>
            <button className="sd-action-btn">
              <PinIcon stroke="#333" size={18} />
              지도보기
            </button>
          </div>
          <button className="sd-point-banner">
            <span className="sd-point-icon">P</span>
            <span className="sd-point-text">
              <span className="sd-point-eyebrow">이 매장에서 사용할 수 있어요</span>
              <span className="sd-point-title">
                <b>10%</b> 할인하는 포인트가 있어요
              </span>
            </span>
            <ChevronRight stroke="#AAA" size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="sd-block-divider" />

        {/* Popular menu */}
        <section className="sd-section" data-screen-label="인기 메뉴">
          <header className="sd-section-head">
            <div>
              <h2 className="sd-section-title">
                인기 메뉴<span className="sd-section-count">{POPULAR_MENUS.length}</span>
              </h2>
              <p className="sd-section-sub">최근 1개월 주문 데이터 기준</p>
            </div>
            <button className="sd-section-more">
              전체보기
              <ChevronRight stroke="#7D7D7D" size={14} strokeWidth={2} />
            </button>
          </header>
          <div className="sd-menu-list">
            {POPULAR_MENUS.map((m, i) => (
              <MenuRow key={i} m={m} />
            ))}
          </div>
        </section>

        <div className="sd-block-divider" />

        {/* News */}
        <section className="sd-section" data-screen-label="소식">
          <header className="sd-section-head">
            <div>
              <h2 className="sd-section-title">
                소식<span className="sd-section-count">{NEWS_ITEMS.length}</span>
              </h2>
              <p className="sd-section-sub">진행 중인 이벤트와 혜택</p>
            </div>
            <span className="sd-section-pager">
              <b>{newsIdx + 1}</b> / {NEWS_ITEMS.length}
            </span>
          </header>
          <div className="sd-news-cta-shared">
            <div className="sd-news-cta-icon">
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2.5 L14.6 9 L21.5 9.6 L16.2 14 L17.8 21 L12 17.2 L6.2 21 L7.8 14 L2.5 9.6 L9.4 9 Z" fill="#A5E9DF" stroke="#78DFD4" strokeWidth={0.8} strokeLinejoin="round" />
              </svg>
            </div>
            <div className="sd-news-cta-text">
              <span>패스오더에서만 참여할 수 있어요</span>
              <b>아래의 이벤트로 할인 받고 주문해 보세요</b>
            </div>
            <ChevronRight stroke="#AAA" size={20} strokeWidth={2} />
          </div>
          <div className="sd-news-track" ref={trackRef}>
            {NEWS_ITEMS.map((n, i) => (
              <div className="sd-news-slide" key={i}>
                <NewsCard n={n} />
              </div>
            ))}
          </div>
          <div className="sd-news-dots">
            {NEWS_ITEMS.map((_, i) => (
              <button
                key={i}
                className={`sd-news-dot${i === newsIdx ? ' active' : ''}`}
                onClick={() => handleNewsDot(i)}
                aria-label={`소식 ${i + 1}`}
              />
            ))}
          </div>
        </section>

        <div className="sd-block-divider" />

        {/* Stories */}
        <section className="sd-section" data-screen-label="스토리">
          <header className="sd-section-head">
            <div>
              <h2 className="sd-section-title">
                스토리<span className="sd-section-count">{TOTAL_STORIES}</span>
              </h2>
              <p className="sd-section-sub">고객이 남긴 후기 3건 미리보기</p>
            </div>
          </header>
          <div className="sd-story-feed">
            {STORY_ITEMS.map((s, i) => (
              <StoryItemView key={i} s={s} />
            ))}
          </div>
          <button className="sd-story-cta">
            <span className="sd-story-cta-text">
              앱에서 스토리 <b>{TOTAL_STORIES - 3}건 더 보기</b>
            </span>
            <span className="sd-story-cta-arrow">
              <ChevronRight stroke="#fff" size={16} strokeWidth={2.5} />
            </span>
          </button>
        </section>

        <div className="sd-bottom-space" />
      </div>

      {/* CTA bar */}
      <div className="sd-ctabar">
        <button className="sd-ctabar-icon" aria-label="공유하기">
          <ShareIcon />
        </button>
        <button className="sd-ctabar-cta">
          주문하기
          <ChevronRight stroke="#fff" size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
