import { SHOP } from '../data';

type Props = { prefix: string };

export default function MenuHeader({ prefix: P }: Props) {
  return (
    <div className={`mp-summary role-shop-header ${P}__el-09abbaa0`}>
      <button aria-label="뒤로가기" className={`mp-summary-back ${P}__el-fb51f297`}>
        <svg className={`${P}__el-feac9ca2`} fill="none" height="24" stroke="#333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <polyline className={`${P}__el-5d915af8`} points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div className={`mp-summary-mid ${P}__el-3586ed7a`}>
        <div className={`mp-summary-name ${P}__el-85992ada`}>{SHOP.name}</div>
        <div className={`mp-summary-status ${P}__el-c8349a4e`}>
          <span className={`dot ${P}__el-7051a0a4`}></span>
          {SHOP.status}
        </div>
      </div>
      <div className={`mp-summary-rating ${P}__el-933bea0c`}>
        <span className={`star ${P}__el-89ebfa60`}>
          <span className={`__om-t ${P}__el-c4ebcfb9`}>★</span>
        </span>
        <span className={`${P}__el-45e8b438`}>{SHOP.rating}</span>
        <span className={`review ${P}__el-38e3101f`}>
          <span className={`__om-t ${P}__el-6ff986c0`}>(</span>
          {SHOP.reviewCount}
          <span className={`__om-t ${P}__el-6ff986c0`}>)</span>
        </span>
      </div>
    </div>
  );
}
