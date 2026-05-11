import { useState } from 'react';
import { CATEGORIES } from '../data';

type Props = { prefix: string };

const TAB_CLASSES = [
  // Per the original HTML the per-tab __el suffix differs by index
  'bb4f1425', // 선착순
  'f03bd1c1', // COFFEE
  '6d34477a', // FRESH JUICE
  '4b691e60', // HEAL TEA
  'eaa4e595', // DESSERT
];

export default function CategoryTabs({ prefix: P }: Props) {
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
    <div className={`mp-catnav role-category-tabs ${P}__el-509383dd`}>
      <div className={`mp-catnav-track ${P}__el-91494490`}>
        <button
          className={`mp-cat${activeId === 'all' ? ' active' : ''} ${P}__el-860fbf3e`}
          onClick={() => go('all')}
        >
          전체
        </button>
        {CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            className={`mp-cat${activeId === c.id ? ' active' : ''} ${P}__el-${TAB_CLASSES[i]}`}
            onClick={() => go(c.id)}
          >
            {c.label}
            <span className={`count ${P}__el-c7282583`}>{c.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
