import { SHOP } from '../data';

export default function MenuHeader() {
  return (
    <div className="mp-summary">
      <button aria-label="뒤로가기" className="mp-summary-back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div className="mp-summary-mid">
        <div className="mp-summary-name">{SHOP.name} 메뉴판</div>
        <div className="mp-summary-status">
          <span className="dot" />
          {SHOP.status}
        </div>
      </div>
    </div>
  );
}
