import { cartTotal, describeLine, fmtKRW, lineTotal } from '../../pages/menu/pricing';
import type { CartLine } from '../../pages/menu/pricing';

type Props = {
  lines: CartLine[];
  onUpdateQty: (index: number, qty: number) => void;
  onRemove: (index: number) => void;
  onClose: () => void;
  onCheckout: () => void;
};

const P = 'cart_sheet';

export default function CartSheet({ lines, onUpdateQty, onRemove, onClose, onCheckout }: Props) {
  const total = cartTotal(lines);
  const distinct = lines.length;

  return (
    <div aria-modal="true" className="mp-sheet role-cart-sheet-panel" role="dialog">
      <div className={`mp-sheet-handle-row ${P}__el-97334ba8`}>
        <span className={`mp-sheet-handle ${P}__el-ef1e45ac`}></span>
      </div>
      <div className={`mp-sheet-top ${P}__el-81f58361`}>
        <div className={`mp-sheet-top-title ${P}__el-08b45a90`}>
          <span className={`__om-t ${P}__el-203a1bdf`}>장바구니 </span>
          <span className={`count ${P}__el-a07a1b9d`}>
            <span className={`__om-t ${P}__el-a07a1b9d`}>(</span>
            {distinct}
            <span className={`__om-t ${P}__el-a07a1b9d`}>)</span>
          </span>
        </div>
        <button aria-label="닫기" className={`mp-sheet-close ${P}__el-534cfb3d`} onClick={onClose}>
          <svg className={`${P}__el-5e54e1d7`} fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
            <line className={`${P}__el-b076ee4d`} x1="18" x2="6" y1="6" y2="18" />
            <line className={`${P}__el-b076ee4d`} x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>
      </div>
      <div className={`mp-sheet-body ${P}__el-178b7744`}>
        {lines.map((line, idx) => (
          <div key={idx} className={`mp-cart-line ${P}__el-14fc38a0`}>
            <div className={`mp-cart-thumb ${P}__el-a24f087e`}>{line.menu.emoji || '☕'}</div>
            <div className={`mp-cart-line-body ${P}__el-d3f436dd`}>
              <div className={`mp-cart-line-name ${P}__el-94835abd`}>{line.menu.name}</div>
              <div className={`mp-cart-line-options ${P}__el-6cbb892c`}>{describeLine(line)}</div>
              <div className={`mp-cart-line-price ${P}__el-3eb25610`}>{fmtKRW(lineTotal(line))}</div>
            </div>
            <div className={`mp-cart-line-controls ${P}__el-b827f184`}>
              <button
                aria-label="삭제"
                className={`mp-cart-line-trash ${P}__el-aca13976`}
                onClick={() => onRemove(idx)}
              >
                <svg className={`${P}__el-49e660ba`} fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                  <polyline className={`${P}__el-429342ab`} points="3 6 5 6 21 6" />
                  <path className={`${P}__el-1698f60a`} d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path className={`${P}__el-fbe04bc6`} d="M10 11v6" />
                  <path className={`${P}__el-bfd65bcf`} d="M14 11v6" />
                </svg>
              </button>
              <div className={`mp-qty-mini ${P}__el-62576cd3`}>
                <button
                  aria-label="수량 감소"
                  className={`${P}__el-28b27838`}
                  disabled={line.qty <= 1}
                  onClick={() => onUpdateQty(idx, line.qty - 1)}
                >
                  <svg className={`${P}__el-7f7bc35e`} fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
                    <line className={`${P}__el-ec50e5ce`} x1="5" x2="19" y1="12" y2="12" />
                  </svg>
                </button>
                <span className={`val ${P}__el-ff93d5f2`}>{line.qty}</span>
                <button
                  aria-label="수량 증가"
                  className={`${P}__el-70c78b86`}
                  onClick={() => onUpdateQty(idx, line.qty + 1)}
                >
                  <svg className={`${P}__el-85e27709`} fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
                    <line className={`${P}__el-c995cf17`} x1="12" x2="12" y1="5" y2="19" />
                    <line className={`${P}__el-c995cf17`} x1="5" x2="19" y1="12" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className={`mp-cart-total ${P}__el-d006cd07`}>
          <span className={`mp-cart-total-label ${P}__el-03d6197c`}>
            <span className={`__om-t ${P}__el-0a39aa2a`}>합계</span>
          </span>
          <span className={`mp-cart-total-value ${P}__el-e07eb857`}>{fmtKRW(total)}</span>
        </div>
      </div>
      <div className={`mp-sheet-cta ${P}__el-72274d4b`}>
        <button className={`mp-cta-primary ${P}__el-fc0b60b9`} onClick={onCheckout}>
          <span className={`__om-t ${P}__el-2e163658`}>주문하기 (</span>
          {fmtKRW(total)}
          <span className={`__om-t ${P}__el-23965d65`}>)</span>
        </button>
      </div>
    </div>
  );
}
