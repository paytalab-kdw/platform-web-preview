import { cartTotal, describeLine, fmtKRW } from '../../pages/menu/pricing';
import type { CartLine } from '../../pages/menu/pricing';
import { SHOP } from '../../pages/menu/data';

type Props = {
  lines: CartLine[];
  onClose: () => void;
  onInstall: () => void;
};

const P = 'inapp_modal';

export default function InAppModal({ lines, onClose, onInstall }: Props) {
  const total = cartTotal(lines);
  return (
    <div aria-modal="true" className="mp-modal" role="dialog">
      <button aria-label="닫기" className={`mp-modal-close ${P}__el-61c8ebe2`} onClick={onClose}>
        <svg className={`${P}__el-f5bf2a0f`} fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
          <line className={`${P}__el-b076ee4d`} x1="18" x2="6" y1="6" y2="18" />
          <line className={`${P}__el-b076ee4d`} x1="6" x2="18" y1="6" y2="18" />
        </svg>
      </button>
      <div className={`mp-modal-body ${P}__el-0f32ddc4`}>
        <span className={`mp-modal-icon ${P}__el-6eb0e163`}>
          <span className={`__om-t ${P}__el-c5874d70`}>📲</span>
        </span>
        <h2 className={`mp-modal-title role-inapp-modal-panel ${P}__el-18a7fd8c`}>
          <span className={`__om-t ${P}__el-0c018bed`}>앱에서 바로 결제하기</span>
        </h2>
        <p className={`mp-modal-sub ${P}__el-67a4a386`}>
          <span className={`__om-t ${P}__el-f723e2cb`}>
            담은 메뉴 그대로, 더 빠르고 안전하게 결제할 수 있어요.
          </span>
        </p>
        <div className={`mp-summary-card ${P}__el-684b705d`}>
          <div className={`mp-summary-store ${P}__el-4572b214`}>
            <span className={`pin ${P}__el-2f066932`}>
              <span className={`__om-t ${P}__el-ebd01cf5`}>📍</span>
            </span>
            {SHOP.name}
          </div>
          {lines.map((line, i) => (
            <div key={i} className={`mp-summary-line ${P}__el-e468cfef`}>
              <span className={`name ${P}__el-034951ec`}>
                {line.menu.name} ({describeLine(line)})
              </span>
              <span className={`qty ${P}__el-043c065b`}>
                <span className={`__om-t ${P}__el-3fe3f4a7`}>× </span>
                {line.qty}
              </span>
            </div>
          ))}
          <div className={`mp-summary-divider ${P}__el-335865f9`}></div>
          <div className={`mp-summary-grandtotal ${P}__el-639d1c8e`}>
            <span className={`l ${P}__el-d2276cf2`}>
              <span className={`__om-t ${P}__el-3fe3f4a7`}>합계</span>
            </span>
            <span className={`v ${P}__el-8947e770`}>{fmtKRW(total)}</span>
          </div>
        </div>
        <ul className={`mp-merits ${P}__el-dccc5235`}>
          <li className={`${P}__el-55bef65a`}>
            <span className={`mp-merit-check ${P}__el-22a66395`}>
              <svg className={`${P}__el-6ecef2db`} fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
                <polyline className={`${P}__el-c0b92fb3`} points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className={`__om-t ${P}__el-12cd9c40`}>앱 설치 후에도 </span>
            <b className={`${P}__el-fb8f271c`}>
              <span className={`__om-t ${P}__el-5b2bbcea`}>담은 메뉴는 그대로</span>
            </b>
          </li>
          <li className={`${P}__el-55bef65a`}>
            <span className={`mp-merit-check ${P}__el-22a66395`}>
              <svg className={`${P}__el-6ecef2db`} fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
                <polyline className={`${P}__el-c0b92fb3`} points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className={`__om-t ${P}__el-b5ce6870`}>첫 주문 시 </span>
            <b className={`${P}__el-e826f6ae`}>
              <span className={`__om-t ${P}__el-5b2bbcea`}>2,000원 할인 쿠폰</span>
            </b>
            <span className={`__om-t ${P}__el-0ab96819`}> 지급</span>
          </li>
          <li className={`${P}__el-55bef65a`}>
            <span className={`mp-merit-check ${P}__el-22a66395`}>
              <svg className={`${P}__el-6ecef2db`} fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
                <polyline className={`${P}__el-c0b92fb3`} points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className={`__om-t ${P}__el-1cc70042`}>30초면 </span>
            <b className={`${P}__el-04197646`}>
              <span className={`__om-t ${P}__el-5b2bbcea`}>설치 완료</span>
            </b>
          </li>
        </ul>
        <div className={`mp-trust ${P}__el-9c8e9016`}>
          <span className={`star ${P}__el-1d0ac2e9`}>
            <span className={`__om-t ${P}__el-2ff3c7ed`}>★</span>
          </span>
          <span className={`${P}__el-522f342b`}>
            <b className={`${P}__el-74484fd7`}>
              <span className={`__om-t ${P}__el-e9ef6db5`}>4.8</span>
            </b>
          </span>
          <span className={`sep ${P}__el-b8ef0b36`}>
            <span className={`__om-t ${P}__el-34387cc0`}>·</span>
          </span>
          <span className={`${P}__el-4302ed0e`}>
            <span className={`__om-t ${P}__el-6e19728d`}>누적 사용자 200만+</span>
          </span>
        </div>
      </div>
      <div className={`mp-modal-cta ${P}__el-2c4f2a9f`}>
        <button
          className={`mp-cta-primary role-modal-install ${P}__el-76acde1a`}
          onClick={onInstall}
        >
          <span className={`__om-t ${P}__el-bd04759e`}>앱 설치하고 결제</span>
        </button>
        <button
          className={`mp-cta-ghost role-modal-close ${P}__el-0c8659f2`}
          onClick={onClose}
        >
          <span className={`__om-t ${P}__el-782b4165`}>닫기</span>
        </button>
      </div>
    </div>
  );
}
