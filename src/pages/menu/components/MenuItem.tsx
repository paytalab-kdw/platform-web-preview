import { useState, type KeyboardEvent } from 'react';
import type { Menu, OptionGroup } from '../data';

type Props = { menu: Menu };

export default function MenuItem({ menu }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasOptions = menu.options.length > 0;
  const interactive = hasOptions && !menu.soldOut;

  const classes = ['mp-acc-item'];
  if (expanded) classes.push('expanded');
  if (hasOptions) classes.push('has-options');
  if (menu.soldOut) classes.push('disabled');

  function toggle() {
    if (!interactive) return;
    setExpanded((v) => !v);
  }
  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }

  const thumbStyle = {
    background: `linear-gradient(135deg, ${menu.thumbGradient[0]}, ${menu.thumbGradient[1]})`,
  };

  return (
    <article className={classes.join(' ')} itemScope itemType="https://schema.org/MenuItem">
      <div
        className="mp-acc-head"
        role={interactive ? 'button' : undefined}
        aria-expanded={interactive ? expanded : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={toggle}
        onKeyDown={onKey}
      >
        <div className="mp-acc-body">
          <h3 className="mp-acc-name" itemProp="name">{menu.name}</h3>
          <p className="mp-acc-desc" itemProp="description">{menu.desc}</p>
          <div className="mp-acc-prices">
            <span className="mp-acc-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <meta itemProp="priceCurrency" content="KRW" />
              <span itemProp="price" content={String(menu.price)}>
                {menu.price.toLocaleString('ko-KR')}원
              </span>
            </span>
            {menu.oldPrice != null && (
              <span className="mp-acc-price-old">
                {menu.oldPrice.toLocaleString('ko-KR')}원
              </span>
            )}
            {menu.stock != null && <span className="mp-acc-stock">재고 {menu.stock}개</span>}
          </div>
        </div>
        <div className="mp-acc-thumb" style={thumbStyle}>
          <span className="mp-acc-thumb-emoji">{menu.emoji}</span>
          {menu.badge && <span className="mp-acc-thumb-tag">{menu.badge}</span>}
          {menu.soldOut && (
            <div className="mp-acc-thumb-soldout" role="status">
              <span>품절</span>
            </div>
          )}
        </div>
      </div>

      <div className="mp-acc-panel" aria-hidden={!expanded}>
        <div className="mp-acc-panel-inner">
          {menu.options.map((g) => (
            <OptionGroupView key={g.label} group={g} />
          ))}
        </div>
      </div>
    </article>
  );
}

function OptionGroupView({ group }: { group: OptionGroup }) {
  return (
    <div className="mp-acc-opt-group">
      <div className="mp-acc-opt-head">
        <span className="mp-acc-opt-label">{group.label}</span>
        {group.required ? (
          <span className="mp-acc-opt-required">필수</span>
        ) : (
          <span className="mp-acc-opt-optional">선택</span>
        )}
      </div>
      <ul className="mp-acc-opt-list">
        {group.pills.map((p) => (
          <li key={p.name} className="mp-acc-opt-pill">
            <span className="mp-acc-opt-name">{p.name}</span>
            <span className={`mp-acc-opt-delta${p.zero ? ' zero' : ''}`}>{p.delta}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
