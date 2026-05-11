import { CATEGORIES } from '../data';
import CategoryTabs from './CategoryTabs';
import MenuHeader from './MenuHeader';
import MenuItem from './MenuItem';
import StatusBar from './StatusBar';

type Props = {
  variant: 'menu-empty' | 'menu-with-cart';
  onOpenDetail: (name: string) => void;
};

const PREFIX_BY_VARIANT: Record<Props['variant'], string> = {
  'menu-empty': 'menu_empty',
  'menu-with-cart': 'menu_with_cart',
};

// Per-section class hashes from the original Figma export — they provide the
// section padding, head margins, and divider colors. Re-applying them keeps
// the menu's spacing consistent with the original design without us having
// to re-author CSS for every detail.
const SECTION_CLASSES = ['8dcc62d0', 'c3e536e2', 'ad1c1bfb', 'eeeae81e', 'eeeae81e'];

export default function MenuListScreen({ variant, onOpenDetail }: Props) {
  const P = PREFIX_BY_VARIANT[variant];
  const screenLabel =
    variant === 'menu-empty' ? '메뉴판 · empty' : '메뉴판 · cartbar';

  // Flat layout matching .bd-screen (magazine) / .sd-screen (store):
  //   .mp-screen  — flex column, height:100%, overflow:hidden, capped to 414px
  //     ├ StatusBar
  //     ├ MenuHeader
  //     ├ CategoryTabs
  //     └ .mp-scroll  — flex:1, overflow-y:auto
  //         └ .mp-list  → sections (each carries its Figma __el class for spacing)
  return (
    <div className="mp-screen" data-screen={variant} data-screen-label={screenLabel}>
      <StatusBar prefix={P} />
      <MenuHeader prefix={P} />
      <CategoryTabs prefix={P} />
      <div className="mp-scroll">
        <div className="mp-list">
          {CATEGORIES.map((cat, i) => (
            <section
              key={cat.id}
              className={`mp-cat-section ${P}__el-${SECTION_CLASSES[i]}`}
              id={cat.id}
            >
              <h2 className={`mp-cat-head ${P}__el-922473a9`}>
                {cat.label}
                <span className={`count ${P}__el-1fb7fc3b`}>{cat.count}</span>
              </h2>
              {cat.items.map((m) => (
                <MenuItem key={m.name} menu={m} prefix={P} onClick={onOpenDetail} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
