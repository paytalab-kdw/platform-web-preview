import { Fragment } from 'react';
import { CATEGORIES } from '../data';
import CategoryTabs from './CategoryTabs';
import EventPromoSection from './EventPromoSection';
import MenuHeader from './MenuHeader';
import MenuItem from './MenuItem';

export default function MenuListScreen() {
  return (
    <div className="mp-screen" data-screen-label="메뉴판">
      <MenuHeader />
      <CategoryTabs />
      <div className="mp-scroll">
        <div className="mp-list">
          {CATEGORIES.map((cat) => (
            <Fragment key={cat.id}>
              <section className="mp-cat-section" id={cat.id}>
                <h2 className="mp-cat-head">
                  {cat.label}
                  <span className="count">{cat.count}</span>
                </h2>
                {cat.items.map((m) => (
                  <MenuItem key={m.name} menu={m} />
                ))}
              </section>
              {cat.id === 'cat-event' && <EventPromoSection />}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="mp-acc-cta-wrap">
        <button
          className="mp-acc-cta"
          onClick={() => alert('앱 설치 페이지로 이동 (프로토타입)')}
        >
          <span>앱에서 주문하기</span>
          <span className="arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
