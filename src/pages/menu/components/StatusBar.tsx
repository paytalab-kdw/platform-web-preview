/**
 * Status bar (9:41, signal, wifi, battery) shared by every screen.
 * The classNames are prefix-keyed (menu_empty / menu_with_cart / menu_detail /
 * cart_sheet / inapp_modal). This component re-emits the entire SVG markup
 * with the supplied prefix, byte-for-byte identical to the original Figma export.
 */
type Props = { prefix: string };

export default function StatusBar({ prefix: P }: Props) {
  return (
    <div className={`role-status-bar-time ${P}__el-df66605a`}>
      <div className={`${P}__el-96a7252a`}>
        <div className={`${P}__el-a8d911eb`}>
          <span className={`${P}__el-822a3f14`}>9:41</span>
        </div>
        <div className={`${P}__el-20051b91`}>
          <svg className={`${P}__el-f65bab85`} height="12" viewBox="0 0 19 12" width="19" xmlns="http://www.w3.org/2000/svg">
            <rect className={`${P}__el-dd132f8e`} fill="#000" height="4.5" rx="0.7" width="3.2" x="0" y="7.5" />
            <rect className={`${P}__el-b355ed77`} fill="#000" height="7" rx="0.7" width="3.2" x="4.8" y="5" />
            <rect className={`${P}__el-6fba9f0c`} fill="#000" height="9.5" rx="0.7" width="3.2" x="9.6" y="2.5" />
            <rect className={`${P}__el-6d1d2a17`} fill="#000" height="12" rx="0.7" width="3.2" x="14.4" y="0" />
          </svg>
          <svg className={`${P}__el-aa665a87`} height="12" viewBox="0 0 17 12" width="17" xmlns="http://www.w3.org/2000/svg">
            <path className={`${P}__el-83adae9e`} d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="#000" />
            <path className={`${P}__el-7f59bdb0`} d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill="#000" />
            <circle className={`${P}__el-d7a3a1df`} cx="8.5" cy="10.5" fill="#000" r="1.5" />
          </svg>
          <svg className={`${P}__el-53707066`} height="13" viewBox="0 0 27 13" width="27" xmlns="http://www.w3.org/2000/svg">
            <rect className={`${P}__el-78300416`} fill="none" height="12" rx="3.5" stroke="#000" strokeOpacity="0.35" width="23" x="0.5" y="0.5" />
            <rect className={`${P}__el-a8791d00`} fill="#000" height="9" rx="2" width="20" x="2" y="2" />
            <path className={`${P}__el-990758ed`} d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="#000" fillOpacity="0.4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
