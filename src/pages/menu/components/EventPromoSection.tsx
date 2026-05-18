import { EVENT_PROMO, type EventMenu } from '../data';
import { MenuLabelChip } from './MenuLabel';

export default function EventPromoSection() {
  const evt = EVENT_PROMO;

  return (
    <section className="mp-evt" id="cat-event-promo">
      <header className="mp-evt-header">
        <div className="mp-evt-header-banner">
          <div className="mp-evt-header-bg" />
          <div className="mp-evt-header-fade" />
        </div>
        <div className="mp-evt-header-body">
          <h2 className="mp-evt-title">{evt.title}</h2>
          <div className="mp-evt-info">
            <p className="mp-evt-desc">{evt.desc}</p>
            <div className="mp-evt-meta">
              <span className="mp-evt-meta-item">
                <IconCalendar />
                {evt.period}
              </span>
              <span className="mp-evt-meta-item">
                <IconClock />
                {evt.time}
              </span>
            </div>
          </div>
          <div className="mp-evt-notice">
            <IconInfo />
            {evt.notice}
          </div>
        </div>
      </header>

      <div className="mp-evt-list">
        {evt.menus.map((m) => (
          <EventItem key={m.name} menu={m} />
        ))}
      </div>
    </section>
  );
}

function EventItem({ menu }: { menu: EventMenu }) {
  const hasImage = !!menu.image;
  const thumbStyle = menu.image
    ? { backgroundImage: `url(${menu.image})` }
    : undefined;

  return (
    <article className="mp-evt-item">
      <div className="mp-evt-body">
        <span className="mp-evt-reward">{menu.reward}</span>
        <h3 className="mp-evt-name">{menu.name}</h3>
        <div className="mp-evt-prices">
          <span className="mp-evt-price">{menu.price.toLocaleString('ko-KR')}원</span>
          <span className="mp-evt-price-old">{menu.oldPrice.toLocaleString('ko-KR')}원</span>
        </div>
        <p className="mp-evt-item-desc">{menu.desc}</p>
        <div className="mp-evt-stats">
          {menu.orderCount && (
            <>
              <span>
                주문수 <b>{menu.orderCount}</b>
              </span>
              <span className="sep">·</span>
            </>
          )}
          <span>
            재고 <b>{menu.stock}</b>
          </span>
        </div>
        {menu.labels.length > 0 && (
          <div className="mp-evt-labels">
            {menu.labels.map((l) => (
              <MenuLabelChip key={l} label={l} />
            ))}
          </div>
        )}
      </div>
      {hasImage ? (
        <div className="mp-evt-image" style={thumbStyle} aria-hidden />
      ) : (
        <div className="mp-evt-image is-empty" aria-hidden />
      )}
    </article>
  );
}

function IconCalendar() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <rect x="1.5" y="2.5" width="9" height="8" rx="1.2" stroke="currentColor" strokeWidth="1" />
      <path d="M1.5 4.6h9" stroke="currentColor" strokeWidth="1" />
      <path d="M4 1.5v2M8 1.5v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1" />
      <path d="M6 3.6V6l1.7 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="5" fill="currentColor" />
      <path d="M6 5.2v3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6" cy="3.9" r=".7" fill="#fff" />
    </svg>
  );
}
