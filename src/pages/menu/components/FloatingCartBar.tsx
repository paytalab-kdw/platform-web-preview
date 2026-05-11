import { fmtKRW } from '../pricing';

type Props = {
  visible: boolean;
  count: number;
  total: number;
  onClick: () => void;
};

/**
 * Floating cart bar reusing the menu_with_cart prefix from the original HTML.
 * Wrapped in `.cart-floating > .cart-floating-inner` so it scales like the
 * main frame (CSS in menu.css picks it up).
 */
export default function FloatingCartBar({ visible, count, total, onClick }: Props) {
  const P = 'menu_with_cart';
  return (
    <div className="cart-floating" hidden={!visible}>
      <div className="cart-floating-inner">
        <button className={`mp-cartbar role-cart-bar ${P}__el-3e1ce3f1`} onClick={onClick}>
          <div className={`mp-cartbar-icon ${P}__el-ac60743e`}>
            <svg className={`${P}__el-e14b0cdf`} fill="none" height="20" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
              <circle className={`${P}__el-7cf28458`} cx="9" cy="21" r="1" />
              <circle className={`${P}__el-fc63d5a8`} cx="20" cy="21" r="1" />
              <path className={`${P}__el-4e91cca1`} d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className={`mp-cartbar-count ${P}__el-71efd558`}>{count}</span>
          </div>
          <div className={`mp-cartbar-mid ${P}__el-d8352b99`}>
            <div className={`mp-cartbar-eyebrow ${P}__el-a1b644ef`}>담은 메뉴 {count}개</div>
            <div className={`mp-cartbar-total ${P}__el-32edd890`}>합계 {fmtKRW(total)}</div>
          </div>
          <span className={`mp-cartbar-cta ${P}__el-21ea8b6c`}>
            <span className={`__om-t ${P}__el-cf0b57bc`}>주문하기</span>
            <svg className={`${P}__el-49e8b67c`} fill="none" height="14" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
              <polyline className={`${P}__el-9081fe08`} points="9 18 15 12 9 6" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
