import { useState } from 'react';
import { CATEGORIES } from '../data';

export default function CategoryTabs() {
  const [activeId, setActiveId] = useState<string>('all');

  function go(id: string) {
    setActiveId(id);
    const scroller = document.querySelector<HTMLElement>('.mp-scroll');
    if (!scroller) return;
    const target =
      id === 'all'
        ? scroller.querySelector<HTMLElement>('.mp-cat-section')
        : scroller.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;
    const top = target.offsetTop - 8;
    scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  return (
    <div className="mp-catnav">
      <div className="mp-catnav-track">
        <button
          className={`mp-cat${activeId === 'all' ? ' active' : ''}`}
          onClick={() => go('all')}
        >
          전체
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`mp-cat${activeId === c.id ? ' active' : ''}`}
            onClick={() => go(c.id)}
          >
            {c.label}
            <span className="count">{c.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
