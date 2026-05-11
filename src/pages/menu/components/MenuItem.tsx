import type { Menu } from '../data';

type Props = {
  menu: Menu;
  prefix: string;
  onClick: (name: string) => void;
};

/**
 * Renders one menu card. Three variants based on the source HTML:
 *   - event card (with mp-item-thumb-tag) — uses el-213421cf / el-2b1a67d6 / el-c830adf8
 *   - regular card — uses el-58882fcd / el-39aca4eb (most thumbs el-* vary by emoji)
 *   - sold-out card (with `disabled`) — uses el-7ed358c8 / el-f2ab2ccd / el-9fda4682
 *
 * The thumb container className varies by emoji in the original. We approximate
 * with a small lookup so the right Figma rect/border-radius hits each emoji.
 */
const THUMB_CLASS_BY_EMOJI: Record<string, string> = {
  '☕': 'c830adf8',
  '🧊': '853acc93',
  '🥛': 'f60b9e4d',
  '🥛-latte': '64f50a07',
  '🍊': '0a5e7f62',
  '🍓': '61269f36',
  '🥤': '5a457cb1',
  '🍵': '45cda87c',
  '🫖': '9a4d7873',
  '🥐': '71d52da9',
  '🍰': 'fcac0de9',
};

// A few duplicate-emoji items have distinct thumb classes — disambiguate by name.
function thumbSuffix(menu: Menu): string {
  if (menu.emoji === '🥛' && menu.name === '카페라떼') return THUMB_CLASS_BY_EMOJI['🥛-latte'];
  if (menu.emoji === '☕' && menu.name === '아메리카노') return 'c830adf8';
  if (menu.emoji === '🧊' && menu.name === '콜드브루') return 'cd51a169';
  return THUMB_CLASS_BY_EMOJI[menu.emoji] || 'c830adf8';
}

export default function MenuItem({ menu, prefix, onClick }: Props) {
  const P = prefix;
  if (menu.badge) {
    // Event card variant
    return (
      <div
        className={`mp-item ${P}__el-213421cf`}
        role="button"
        tabIndex={0}
        onClick={() => !menu.soldOut && onClick(menu.name)}
      >
        <div className={`mp-item-body ${P}__el-2b1a67d6`}>
          <div className={`mp-item-name role-menu-card role-menu-card ${P}__el-8b3ce29f`}>
            {menu.name}
          </div>
          <div className={`mp-item-prices ${P}__el-9480146d`}>
            <span className={`mp-item-price ${P}__el-0580288e`}>
              {menu.price.toLocaleString('ko-KR')}원
            </span>
            {menu.oldPrice != null && (
              <span className={`mp-item-price-old ${P}__el-38aa0f0f`}>
                {menu.oldPrice.toLocaleString('ko-KR')}원
              </span>
            )}
          </div>
          <div className={`mp-item-desc ${P}__el-2bb9235c`}>{menu.desc}</div>
          {menu.stock != null && (
            <div className={`mp-item-stock ${P}__el-af2ca79b`}>
              <span className={`__om-t ${P}__el-b39d5f16`}>재고 </span>
              {menu.stock}
              <span className={`__om-t ${P}__el-b39d5f16`}>개</span>
            </div>
          )}
        </div>
        <div className={`mp-item-thumb ${P}__el-c830adf8`}>
          <span className={`mp-item-thumb-emoji ${P}__el-7ddced24`}>{menu.emoji}</span>
          <span className={`mp-item-thumb-tag ${P}__el-28523cff`}>{menu.badge}</span>
        </div>
      </div>
    );
  }

  if (menu.soldOut) {
    return (
      <div className={`mp-item disabled ${P}__el-7ed358c8`} role="button" tabIndex={-1}>
        <div className={`mp-item-body role-menu-card ${P}__el-f2ab2ccd`}>
          <div className={`mp-item-name ${P}__el-9bd6868e`}>{menu.name}</div>
          <div className={`mp-item-prices ${P}__el-12835a8b`}>
            <span className={`mp-item-price ${P}__el-b73edc07`}>
              {menu.price.toLocaleString('ko-KR')}원
            </span>
          </div>
          <div className={`mp-item-desc ${P}__el-2829440d`}>{menu.desc}</div>
        </div>
        <div className={`mp-item-thumb ${P}__el-9fda4682`}>
          <span className={`mp-item-thumb-emoji ${P}__el-d145b80e`}>{menu.emoji}</span>
          <div className={`mp-item-thumb-soldout role-sold-out ${P}__el-e4a04a0c`}>
            <span className={`__om-t ${P}__el-c2f00ccd`}>품절</span>
          </div>
        </div>
      </div>
    );
  }

  // Regular card
  const thumb = thumbSuffix(menu);
  return (
    <div
      className={`mp-item ${P}__el-58882fcd`}
      role="button"
      tabIndex={0}
      onClick={() => onClick(menu.name)}
    >
      <div className={`mp-item-body role-menu-card ${P}__el-39aca4eb`}>
        <div className={`mp-item-name ${P}__el-8b3ce29f`}>{menu.name}</div>
        <div className={`mp-item-prices ${P}__el-9480146d`}>
          <span className={`mp-item-price ${P}__el-091577cd`}>
            {menu.price.toLocaleString('ko-KR')}원
          </span>
        </div>
        <div className={`mp-item-desc ${P}__el-2bb9235c`}>{menu.desc}</div>
      </div>
      <div className={`mp-item-thumb ${P}__el-${thumb}`}>
        <span className={`mp-item-thumb-emoji ${P}__el-7ddced24`}>{menu.emoji}</span>
      </div>
    </div>
  );
}
