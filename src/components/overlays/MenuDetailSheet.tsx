import { fmtKRW, OPT_DELTA, SIZE_ORDER, unitPrice } from '../../pages/menu/pricing';
import type { Selection, SizeName } from '../../pages/menu/pricing';

type Props = {
  selection: Selection;
  onSetSize: (s: SizeName) => void;
  onToggleOption: (o: string) => void;
  onInc: () => void;
  onDec: () => void;
  onClose: () => void;
  onAddToCart: () => void;
};

const P = 'menu_detail';

export default function MenuDetailSheet({
  selection,
  onSetSize,
  onToggleOption,
  onInc,
  onDec,
  onClose,
  onAddToCart,
}: Props) {
  const sel = selection;
  const total = unitPrice(sel.menu, sel.size, Array.from(sel.options)) * sel.qty;

  return (
    <div
      aria-labelledby="dlg-title"
      aria-modal="true"
      className={`mp-sheet role-detail-sheet ${P}__el-765f63d3`}
      role="dialog"
    >
      <div className={`mp-sheet-handle-row ${P}__el-97334ba8`}>
        <span className={`mp-sheet-handle ${P}__el-ef1e45ac`}></span>
        <button aria-label="닫기" className={`mp-sheet-close ${P}__el-10cce104`} onClick={onClose}>
          <svg className={`${P}__el-5e54e1d7`} fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
            <line className={`${P}__el-b076ee4d`} x1="18" x2="6" y1="6" y2="18" />
            <line className={`${P}__el-b076ee4d`} x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>
      </div>
      <div className={`mp-sheet-body ${P}__el-59d5b0f3`}>
        <div className={`mp-dlg-img ${P}__el-42ebfc1d`}>
          <span className={`mp-dlg-img-emoji ${P}__el-93be1037`}>{sel.menu.emoji || '☕'}</span>
        </div>
        <div className={`mp-dlg-meta ${P}__el-068eb3e2`}>
          <h2 className={`mp-dlg-name ${P}__el-6c4e07f5`} id="dlg-title">
            {sel.menu.name}
          </h2>
          <p className={`mp-dlg-desc ${P}__el-a8da642e`}>{sel.menu.desc}</p>
          <div className={`mp-dlg-price-row ${P}__el-813689ad`}>
            <span className={`mp-dlg-price ${P}__el-bb0311cc`}>{fmtKRW(sel.menu.price)}</span>
          </div>
        </div>

        {/* Size section */}
        <div className={`mp-dlg-section ${P}__el-37c306b6`}>
          <div className={`mp-dlg-section-head ${P}__el-1150092e`}>
            <span className={`mp-dlg-section-title ${P}__el-967afe66`}>사이즈</span>
            <span className={`mp-dlg-section-required ${P}__el-853bae7f`}>
              <span className={`__om-t ${P}__el-ce54f17e`}>필수</span>
            </span>
          </div>
          <div className={`${P}__el-d90a3b88`}>
            {SIZE_ORDER.map((sizeName, i) => {
              const checked = sel.size === sizeName;
              const rowClass = i === 0
                ? `mp-opt${checked ? ' checked' : ''} ${P}__el-052c3e8d`
                : `mp-opt${checked ? ' checked' : ''} ${P}__el-54b63475`;
              const markerClass = i === 0 ? `${P}__el-0172152c` : `${P}__el-40d742a4`;
              const dotClass = i === 0 ? `${P}__el-90f790d4` : `${P}__el-f19ad4a7`;
              const labelClass = i === 0
                ? `${P}__el-194ab64d`
                : i === 1
                ? `${P}__el-48f63e80`
                : `${P}__el-614e0463`;
              const deltaClass = i === 0
                ? `mp-opt-delta zero ${P}__el-38d869bb`
                : i === 1
                ? `mp-opt-delta ${P}__el-31a4875e`
                : `mp-opt-delta ${P}__el-bb1ec7d3`;
              const deltaText = i === 0 ? '' : i === 1 ? '+500원' : '+1,000원';
              return (
                <div key={sizeName} className={rowClass} onClick={() => onSetSize(sizeName)}>
                  <span className={`mp-opt-marker ${markerClass}`}>
                    <span className={`dot ${dotClass}`}></span>
                  </span>
                  <span className={`mp-opt-label ${labelClass}`}>{sizeName}</span>
                  <span className={deltaClass}>{deltaText}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional options */}
        <div className={`mp-dlg-section ${P}__el-e00c36b8`}>
          <div className={`mp-dlg-section-head ${P}__el-1150092e`}>
            <span className={`mp-dlg-section-title ${P}__el-45695fd9`}>추가 옵션</span>
            <span className={`mp-dlg-section-optional ${P}__el-f7069036`}>
              <span className={`__om-t ${P}__el-3d323eb7`}>선택</span>
            </span>
          </div>
          <div className={`${P}__el-639e8de6`}>
            {Object.keys(OPT_DELTA).map((opt, i) => {
              const checked = sel.options.has(opt);
              const rowClass = i === 0
                ? `mp-opt${checked ? ' checked' : ''} ${P}__el-052c3e8d`
                : `mp-opt${checked ? ' checked' : ''} ${P}__el-54b63475`;
              const delta = OPT_DELTA[opt];
              return (
                <div key={opt} className={rowClass} onClick={() => onToggleOption(opt)}>
                  <span className={`mp-opt-marker square ${P}__el-8bd541a9`}>
                    <span className={`dot ${P}__el-f19ad4a7`}></span>
                  </span>
                  <span className={`mp-opt-label ${P}__el-48f63e80`}>{opt}</span>
                  <span className={`mp-opt-delta ${P}__el-31a4875e`}>+{delta.toLocaleString('ko-KR')}원</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantity */}
        <div className={`mp-dlg-section ${P}__el-09b0237c`}>
          <div className={`mp-dlg-section-head ${P}__el-1150092e`}>
            <span className={`mp-dlg-section-title ${P}__el-7fab2559`}>
              <span className={`__om-t ${P}__el-1dd316b9`}>수량</span>
            </span>
          </div>
          <div className={`mp-qty ${P}__el-b0d1c79d`}>
            <button
              aria-label="수량 감소"
              className={`${P}__el-30e9d83f`}
              disabled={sel.qty <= 1}
              onClick={onDec}
            >
              <svg className={`${P}__el-85af07be`} fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                <line className={`${P}__el-a87a1dba`} x1="5" x2="19" y1="12" y2="12" />
              </svg>
            </button>
            <span className={`val ${P}__el-1ffe8471`}>{sel.qty}</span>
            <button aria-label="수량 증가" className={`${P}__el-bd6e4b01`} onClick={onInc}>
              <svg className={`${P}__el-85344cd6`} fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                <line className={`${P}__el-b73e556b`} x1="12" x2="12" y1="5" y2="19" />
                <line className={`${P}__el-b73e556b`} x1="5" x2="19" y1="12" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`mp-sheet-cta role-detail-cta ${P}__el-72274d4b`}>
        <button className={`mp-cta-primary ${P}__el-fc0b60b9`} onClick={onAddToCart}>
          {fmtKRW(total)} · 장바구니 담기
        </button>
      </div>
    </div>
  );
}
