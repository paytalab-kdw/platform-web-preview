import type { ReactNode } from 'react';
import '../../styles/magazine.css';
import { fmt } from './data';

/* =========================================================================
   매거진 본문에서 MDX 커스텀 컴포넌트로 사용 가능한 5종 모음
   1) MenuCard       — 메뉴 컴포넌트
   2) MenuList       — 메뉴 목록 컴포넌트 (MenuCard 연결형)
   3) StoreCard      — 매장 컴포넌트
   4) StoreList      — 매장 목록 컴포넌트 (StoreCard 연결형)
   5) AppLinkButton  — 앱으로 3초만에 주문하기 버튼
   ========================================================================= */

interface MenuCardProps {
  name: string;
  desc: string;
  price: number;
  oldPrice?: number;
  image?: string;
  badge?: string;
  /** 내부용 — MenuList 안에서는 연결형으로 렌더링 */
  variant?: 'card' | 'row';
}

function MenuCard({ name, desc, price, oldPrice, image, badge, variant = 'card' }: MenuCardProps) {
  const thumbStyle = {
    backgroundImage: `url(${
      image ||
      'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=400&q=80'
    })`,
  };
  return (
    <article className={`bd-mdx-menu bd-mdx-menu-${variant}`}>
      <div className="bd-mdx-menu-body">
        <h3 className="bd-mdx-menu-name">{name}</h3>
        <p className="bd-mdx-menu-desc">{desc}</p>
        <div className="bd-mdx-menu-prices">
          <span className="bd-mdx-menu-price">{fmt(price)}원</span>
          {oldPrice != null && (
            <span className="bd-mdx-menu-price-old">{fmt(oldPrice)}원</span>
          )}
        </div>
      </div>
      <div className="bd-mdx-menu-thumb" style={thumbStyle}>
        {badge && <span className="bd-mdx-menu-thumb-tag">{badge}</span>}
      </div>
    </article>
  );
}

interface MenuListProps {
  title?: string;
  items: Omit<MenuCardProps, 'variant'>[];
}

function MenuList({ title, items }: MenuListProps) {
  return (
    <section className="bd-mdx-menu-list">
      {title && <h4 className="bd-mdx-list-title">{title}</h4>}
      <div className="bd-mdx-menu-list-body">
        {items.map((it, i) => (
          <MenuCard key={i} {...it} variant="row" />
        ))}
      </div>
    </section>
  );
}

interface StoreCardProps {
  tag?: string;
  name: string;
  stories?: number;
  orders?: number;
  addr: string;
  desc: string;
  bg?: string;
  /** 내부용 — StoreList 안에서는 연결형으로 렌더링 */
  variant?: 'card' | 'row';
}

function StoreCard({
  tag,
  name,
  stories = 0,
  orders = 0,
  addr,
  desc,
  bg,
  variant = 'card',
}: StoreCardProps) {
  return (
    <aside className={`bd-mdx-store bd-mdx-store-${variant}`}>
      <div className="bd-mdx-store-top">
        <div
          className="bd-mdx-store-thumb"
          style={{
            background:
              bg ||
              "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80') center/cover",
          }}
        />
        <div className="bd-mdx-store-info">
          {tag && <span className="bd-mdx-store-tag">★ {tag}</span>}
          <button type="button" className="bd-mdx-store-name">
            <span>{name}</span>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className="bd-mdx-store-addr">{addr}</div>
          <div className="bd-mdx-store-stats">
            <span>스토리 <b>{fmt(stories)}</b></span>
            <span className="dot" />
            <span>주문 <b>{fmt(orders)}</b></span>
          </div>
        </div>
      </div>
      <p className="bd-mdx-store-desc">{desc}</p>
    </aside>
  );
}

interface StoreListProps {
  title?: string;
  items: Omit<StoreCardProps, 'variant'>[];
}

function StoreList({ title, items }: StoreListProps) {
  return (
    <section className="bd-mdx-store-list">
      {title && <h4 className="bd-mdx-list-title">{title}</h4>}
      <div className="bd-mdx-store-list-body">
        {items.map((it, i) => (
          <StoreCard key={i} {...it} variant="row" />
        ))}
      </div>
    </section>
  );
}

interface AppLinkButtonProps {
  label?: string;
}

function AppLinkButton({ label = '앱으로 3초만에 주문하기' }: AppLinkButtonProps) {
  return (
    <button type="button" className="bd-mdx-applink">
      <span>{label}</span>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

/* =========================================================================
   샘플 데이터
   ========================================================================= */

const SAMPLE_MENU: MenuCardProps = {
  name: '에스프레소 토닉',
  desc: '산미 적은 에스프레소 + 토닉. 4시간짜리 작업의 시그니처 페어링.',
  price: 6500,
};

const SAMPLE_MENU_LIST: Omit<MenuCardProps, 'variant'>[] = [
  {
    name: '에스프레소 토닉',
    desc: '산미 적은 에스프레소 + 토닉. 4시간짜리 작업의 시그니처 페어링.',
    price: 6500,
  },
  {
    name: '말차 크림 라떼',
    desc: '우지말차 + 직접 만든 우유크림. 단맛이 강하지 않고 깔끔.',
    price: 7200,
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: '바닐라 콜드브루',
    desc: '12시간 저온 추출 + 마다가스카르 바닐라. 묵직한 단맛.',
    price: 6800,
    oldPrice: 7500,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80',
  },
];

const SAMPLE_STORE: StoreCardProps = {
  tag: '에디터 PICK',
  name: '에슬로우커피 성수점',
  stories: 42,
  orders: 8230,
  addr: '성수역 3번 출구 도보 5분',
  desc: '1인 좌석 18석 모두 콘센트, 와이파이 380Mbps. 8시간 머물러도 눈치 안 보여요.',
};

const SAMPLE_STORE_LIST: Omit<StoreCardProps, 'variant'>[] = [
  {
    tag: '에디터 PICK',
    name: '에슬로우커피 성수점',
    stories: 42,
    orders: 8230,
    addr: '성수역 3번 출구 도보 5분',
    desc: '1인 좌석 18석 모두 콘센트, 와이파이 380Mbps. 8시간 머물러도 눈치 안 보여요.',
  },
  {
    tag: '조용함 1위',
    name: '포레스트 라운지',
    stories: 18,
    orders: 2140,
    addr: '성수역 1번 출구 도보 8분',
    bg: "url('https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=80') center/cover",
    desc: '도서관급 정숙. 키보드 소리도 신경쓰일 정도. 완전 몰입형 작업 환경.',
  },
  {
    tag: '디자이너 추천',
    name: '코너 스튜디오',
    stories: 26,
    orders: 4180,
    addr: '성수역 2번 출구 도보 6분',
    bg: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80') center/cover",
    desc: '책상 폭 80cm 이상, 듀얼 모니터도 OK. 디자이너 손님 비율 1위.',
  },
];

/* =========================================================================
   섹션 래퍼
   ========================================================================= */

interface SectionProps {
  index: number;
  name: string;
  tagName: string;
  desc: string;
  children: ReactNode;
}

function ComponentSection({ index, name, tagName, desc, children }: SectionProps) {
  return (
    <section className="bd-mdx-section">
      <header className="bd-mdx-section-head">
        <span className="bd-mdx-section-num">{String(index).padStart(2, '0')}</span>
        <div className="bd-mdx-section-meta">
          <h2 className="bd-mdx-section-title">
            {name}
            <code className="bd-mdx-section-tag">{tagName}</code>
          </h2>
          <p className="bd-mdx-section-desc">{desc}</p>
        </div>
      </header>
      <div className="bd-mdx-section-body">{children}</div>
    </section>
  );
}

export default function MagazineComponentsPage() {
  return (
    <div className="bd-screen" data-screen-label="매거진 MDX 커스텀 컴포넌트">
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
        <div className="bd-appbar-title">MDX 커스텀 컴포넌트</div>
        <button className="bd-appbar-icon" aria-label="홈">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>

      <div className="bd-scroll">
        <header className="bd-mdx-intro">
          <span className="bd-cat-chip">MDX 컴포넌트</span>
          <h1 className="bd-title">매거진 본문에서 쓸 수 있는 5가지 컴포넌트</h1>
          <p className="bd-lead">
            블로그/매거진 본문 MDX에서 바로 호출해 쓸 수 있는 커스텀 컴포넌트 모음.
            본문 흐름과 자연스럽게 어울리도록 디자인되어 있어요.
          </p>
        </header>

        <article className="bd-body">
          <ComponentSection
            index={1}
            name="메뉴 컴포넌트"
            tagName="<MenuCard />"
            desc="단일 메뉴를 카드 형태로 본문에 삽입합니다. 메뉴판 페이지와 동일한 레이아웃 (이름·설명·가격 + 썸네일)."
          >
            <MenuCard {...SAMPLE_MENU} />
          </ComponentSection>

          <ComponentSection
            index={2}
            name="메뉴 목록 컴포넌트"
            tagName="<MenuList />"
            desc="여러 메뉴를 한 묶음으로 노출합니다. 카드 사이에 간격 없이 라인으로 이어집니다."
          >
            <MenuList title="에디터가 고른 시그니처 음료 3선" items={SAMPLE_MENU_LIST} />
          </ComponentSection>

          <ComponentSection
            index={3}
            name="매장 컴포넌트"
            tagName="<StoreCard />"
            desc="단일 매장을 카드 형태로 본문에 삽입합니다. 매장 정보·통계·설명이 함께 노출돼요."
          >
            <StoreCard {...SAMPLE_STORE} />
          </ComponentSection>

          <ComponentSection
            index={4}
            name="매장 목록 컴포넌트"
            tagName="<StoreList />"
            desc="여러 매장을 한 묶음으로 노출합니다. 매장 사이에 간격 없이 라인으로 이어집니다."
          >
            <StoreList title="성수동 작업 카페 TOP 3" items={SAMPLE_STORE_LIST} />
          </ComponentSection>

          <ComponentSection
            index={5}
            name="버튼 컴포넌트"
            tagName="<AppLinkButton />"
            desc="패스오더 앱으로 진입하는 단일 CTA 버튼. 본문 중간/하단 어디든 삽입 가능."
          >
            <AppLinkButton />
          </ComponentSection>
        </article>

        <div className="bd-bottom-space" />
      </div>
    </div>
  );
}
