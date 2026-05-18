import { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/tokens.css';
import '../../styles/blog-management.css';

type PublishStatus = '발행' | '미리보기' | '비공개';
type PostLocation = 'B2B' | '플랫폼';

interface Post {
  id: string;
  title: string;
  url: string;
  category: string;
  author: string;
  status: PublishStatus;
  location: PostLocation;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  updatedAt: string;
  pinned?: boolean;
}

interface PostMeta {
  description: string;
  tags: readonly string[];
}

const POST_META: Record<string, PostMeta> = {
  p1:  { description: '성수동에서 노트북 작업하기 좋은 카페 12곳을 콘센트·와이파이·분위기 기준으로 비교했습니다.', tags: ['카페', '성수동', '노트북'] },
  p2:  { description: '즐겨찾기를 활용해 주문 시간을 3초까지 단축하는 방법을 정리했습니다.',                tags: ['주문', '즐겨찾기', '팁'] },
  p3:  { description: '11월 한정으로 첫 주문 시 사용할 수 있는 3,000원 할인 쿠폰을 안내합니다.',           tags: ['쿠폰', '할인', '11월'] },
  p4:  { description: '강남역 인근에서 30분 짧은 미팅에 적합한 카페 6곳을 정리했습니다.',                  tags: ['카페', '강남역', '미팅'] },
  p5:  { description: '연남동에서 줄 서지 않고 점심을 빠르게 해결할 수 있는 식당을 추천합니다.',           tags: ['맛집', '연남동', '점심'] },
  p6:  { description: '발급받은 쿠폰을 자동으로 적용하고 한 번에 확인하는 방법을 정리했습니다.',           tags: ['쿠폰', '자동', '팁'] },
  p7:  { description: '비 오는 날 가기 좋은 도심 카페 8곳을 분위기·위치 기준으로 선별했습니다.',          tags: ['카페', '비', '도심'] },
  p8:  { description: '한남동 베이커리 BEST 5와 평일 오전 추천 메뉴를 함께 소개합니다.',                   tags: ['베이커리', '한남동', '맛집'] },
  p9:  { description: '12월 패스오더 X 카페 라운드 시즌 이벤트를 안내합니다.',                              tags: ['이벤트', '12월', '카페'] },
  p10: { description: '매장 영업시간 등록·수정을 단계별로 정리한 운영 가이드입니다.',                       tags: ['운영', '영업시간', '가이드'] },
  p11: { description: '매장별로 쿠폰 발급을 자동화하는 설정 방법을 안내합니다.',                            tags: ['운영', '쿠폰', '자동화'] },
  p12: { description: '주문 알림이 오지 않을 때 점검할 6가지 항목을 정리했습니다.',                         tags: ['알림', '문제해결', '체크리스트'] },
  p13: { description: '12월부터 적용되는 매장 운영자 대상 정산 정책 변경을 안내합니다.',                    tags: ['공지', '정산', '12월'] },
  p14: { description: '재방문 고객 분석 리포트의 항목과 활용 방법을 소개합니다.',                           tags: ['리포트', '재방문', '데이터'] },
  p15: { description: '엑셀 템플릿을 이용한 메뉴판 일괄 등록 방법을 가이드합니다.',                          tags: ['운영', '메뉴판', '엑셀'] },
  p16: { description: '망원동의 한적한 평일 오전 카페 산책 코스를 정리했습니다.',                            tags: ['카페', '망원동', '산책'] },
  p17: { description: '겨울에 따뜻하게 즐기는 음료 BEST 7을 추천합니다.',                                   tags: ['음료', '겨울', '추천'] },
  p18: { description: '작업과 영감에 좋은 플레이리스트가 흐르는 카페 9곳을 추렸습니다.',                     tags: ['카페', '플레이리스트', '작업'] },
  p19: { description: '리뷰 응답을 1줄로 친절하게 처리하는 가이드를 안내합니다.',                            tags: ['운영', '리뷰', '가이드'] },
  p20: { description: '월간 매출 리포트를 효과적으로 읽는 방법을 정리했습니다.',                             tags: ['리포트', '매출', '월간'] },
  p21: { description: '회사 근처 점심 한 끼 — 일산·판교·강남 지역별 추천을 모았습니다.',                       tags: ['맛집', '점심', '회사'] },
  p22: { description: '연말 이벤트 운영을 위한 점검 체크리스트입니다.',                                      tags: ['이벤트', '연말', '체크리스트'] },
  p23: { description: '강북 산책로 옆에 위치한 카페 4곳을 소개합니다.',                                      tags: ['카페', '강북', '산책'] },
  p24: { description: '쿠폰 발급 대비 사용률을 높이기 위한 효율 분석 방법을 안내합니다.',                     tags: ['리포트', '쿠폰', '효율'] },
};

function getPostMeta(postId: string): PostMeta {
  return POST_META[postId] ?? { description: '', tags: [] };
}

const POSTS: Post[] = [
  { id: 'p1',  title: '성수동 노트북 작업 카페 12곳 — 콘센트, 와이파이, 분위기까지', url: '/seongsu-laptop-cafes-12',         category: '카페 비교/추천', author: '이주연', status: '발행',     location: '플랫폼', views: 8412,  likes: 318, comments: 24, publishedAt: '2025.11.28', updatedAt: '2025.11.28', pinned: true },
  { id: 'p2',  title: '주문 3초 단축, 즐겨찾기 200% 활용법',                  url: '/quick-order-favorites-tips',      category: '패스오더 이용 팁',  author: '편집부', status: '발행',     location: '플랫폼', views: 4203,  likes: 187, comments: 12, publishedAt: '2025.11.25', updatedAt: '2025.11.26' },
  { id: 'p3',  title: '11월 한정 — 첫 주문 3,000원 할인 쿠폰',                url: '/november-first-order-coupon',     category: '이벤트',          author: '편집부', status: '발행',     location: '플랫폼', views: 12089, likes: 642, comments: 58, publishedAt: '2025.11.20', updatedAt: '2025.11.20' },
  { id: 'p4',  title: '강남역 30분 미팅에 좋은 카페 6곳',                      url: '/gangnam-station-meeting-cafes',   category: '카페 비교/추천',   author: '김도현', status: '미리보기',     location: '플랫폼', views: 0,     likes: 0,   comments: 0,  publishedAt: '2025.12.05', updatedAt: '2025.11.30' },
  { id: 'p5',  title: '연남동 점심 한 끼 — 줄 안 서고 먹는 법',                 url: '/yeonnam-lunch-spots',             category: '맛집 추천',       author: '박서윤', status: '미리보기', location: '플랫폼', views: 0,     likes: 0,   comments: 0,  publishedAt: '-',          updatedAt: '2025.11.14' },
  { id: 'p6',  title: '쿠폰 자동 적용, 한 번에 확인하는 법',                     url: '/auto-coupon-apply-guide',         category: '패스오더 이용 팁', author: '편집부', status: '비공개',   location: '플랫폼', views: 1820,  likes: 41,  comments: 3,  publishedAt: '2025.11.11', updatedAt: '2025.11.15' },
  { id: 'p7',  title: '비 오는 날 가기 좋은 도심 카페 8곳',                     url: '/rainy-day-city-cafes',            category: '카페 비교/추천',   author: '이주연', status: '발행',     location: '플랫폼', views: 6041,  likes: 274, comments: 19, publishedAt: '2025.11.07', updatedAt: '2025.11.07' },
  { id: 'p8',  title: '한남동 베이커리 BEST 5 — 평일 오전 추천',                url: '/hannam-bakery-best5',             category: '맛집 추천',       author: '김도현', status: '발행',     location: '플랫폼', views: 5310,  likes: 248, comments: 16, publishedAt: '2025.11.04', updatedAt: '2025.11.05' },
  { id: 'p9',  title: '12월 패스오더 X 카페 라운드 시즌',                      url: '/december-passorder-cafe-round',   category: '이벤트',          author: '편집부', status: '미리보기',     location: '플랫폼', views: 0,     likes: 0,   comments: 0,  publishedAt: '2025.12.01', updatedAt: '2025.11.29' },
  { id: 'p10', title: '[운영가이드] 영업시간 등록·수정 한 번에 정리',             url: '/business-hours-guide',            category: '운영 가이드',      author: '운영팀', status: '발행',     location: 'B2B',   views: 1043,  likes: 22,  comments: 4,  publishedAt: '2025.11.18', updatedAt: '2025.11.22', pinned: true },
  { id: 'p11', title: '쿠폰 발급 자동화, 매장 별 설정법',                       url: '/coupon-issue-automation',         category: '운영 가이드',      author: '운영팀', status: '발행',     location: 'B2B',   views: 812,   likes: 18,  comments: 2,  publishedAt: '2025.11.12', updatedAt: '2025.11.12' },
  { id: 'p12', title: '주문 알림 못 받았을 때 체크리스트 6가지',                  url: '/order-notification-troubleshoot',category: '문제 해결',       author: '운영팀', status: '발행',     location: 'B2B',   views: 1452,  likes: 33,  comments: 9,  publishedAt: '2025.11.06', updatedAt: '2025.11.10' },
  { id: 'p13', title: '12월 매장 운영자 대상 정산 변경 안내',                    url: '/december-settlement-notice',      category: '공지사항',        author: '운영팀', status: '미리보기',     location: 'B2B',   views: 0,     likes: 0,   comments: 0,  publishedAt: '2025.12.02', updatedAt: '2025.11.28' },
  { id: 'p14', title: '재방문 고객 분석 리포트 사용법',                         url: '/returning-customer-report',       category: '리포트',         author: '데이터팀', status: '발행',     location: 'B2B',   views: 524,   likes: 11,  comments: 1,  publishedAt: '2025.10.30', updatedAt: '2025.10.30' },
  { id: 'p15', title: '메뉴판 일괄 등록 — 엑셀 템플릿 가이드',                   url: '/menu-bulk-upload-guide',          category: '운영 가이드',      author: '운영팀', status: '미리보기', location: 'B2B',   views: 0,     likes: 0,   comments: 0,  publishedAt: '-',          updatedAt: '2025.11.21' },
  { id: 'p16', title: '망원 카페 산책 코스 — 한적한 평일 오전',                  url: '/mangwon-cafe-walk-course',        category: '카페 비교/추천',   author: '이주연', status: '발행',     location: '플랫폼', views: 3920,  likes: 162, comments: 11, publishedAt: '2025.10.25', updatedAt: '2025.10.25' },
  { id: 'p17', title: '겨울 음료 BEST 7 — 따뜻한 잔에 담긴 추천',                url: '/winter-drinks-best7',             category: '맛집 추천',       author: '박서윤', status: '발행',     location: '플랫폼', views: 4781,  likes: 219, comments: 14, publishedAt: '2025.10.21', updatedAt: '2025.10.22' },
  { id: 'p18', title: '플레이리스트 좋은 카페 9곳 — 작업+영감용',                 url: '/playlist-friendly-cafes',         category: '카페 비교/추천',   author: '이주연', status: '비공개',   location: '플랫폼', views: 410,   likes: 8,   comments: 1,  publishedAt: '2025.10.18', updatedAt: '2025.10.20' },
  { id: 'p19', title: '리뷰 응답 가이드 — 1줄로 끝내는 친절 답변',                url: '/review-reply-guide',              category: '운영 가이드',      author: '운영팀', status: '발행',     location: 'B2B',   views: 932,   likes: 27,  comments: 5,  publishedAt: '2025.10.15', updatedAt: '2025.10.17' },
  { id: 'p20', title: '월간 매출 리포트 읽는 법',                              url: '/monthly-sales-report',            category: '리포트',         author: '데이터팀', status: '발행',     location: 'B2B',   views: 612,   likes: 14,  comments: 2,  publishedAt: '2025.10.10', updatedAt: '2025.10.10' },
  { id: 'p21', title: '회사 근처 점심 한 끼 — 일산·판교·강남편',                   url: '/office-lunch-ilsan-pangyo-gangnam',category: '맛집 추천',       author: '김도현', status: '미리보기',     location: '플랫폼', views: 0,     likes: 0,   comments: 0,  publishedAt: '2025.12.08', updatedAt: '2025.11.28' },
  { id: 'p22', title: '연말 이벤트 운영 체크리스트',                            url: '/year-end-event-checklist',        category: '공지사항',        author: '운영팀', status: '발행',     location: 'B2B',   views: 778,   likes: 21,  comments: 3,  publishedAt: '2025.10.05', updatedAt: '2025.10.06' },
  { id: 'p23', title: '강북 산책로 옆 카페 4곳',                              url: '/gangbuk-walking-cafes',           category: '카페 비교/추천',   author: '이주연', status: '발행',     location: '플랫폼', views: 2104,  likes: 89,  comments: 6,  publishedAt: '2025.10.01', updatedAt: '2025.10.01' },
  { id: 'p24', title: '쿠폰 효율 분석 — 발급 대비 사용률 높이기',                 url: '/coupon-efficiency-analysis',      category: '리포트',         author: '데이터팀', status: '미리보기', location: 'B2B',   views: 0,     likes: 0,   comments: 0,  publishedAt: '-',          updatedAt: '2025.11.25' },
];

const STATUSES: PublishStatus[] = ['발행', '미리보기', '비공개'];
const LOCATIONS: PostLocation[] = ['B2B', '플랫폼'];
type PinnedFlag = '예' | '아니오';
const PINNED_FLAGS: PinnedFlag[] = ['예', '아니오'];
type Period = '일주일' | '한달' | '1년' | '전체';
const PERIODS: readonly Period[] = ['일주일', '한달', '1년', '전체'];

const INITIAL_CATEGORIES: readonly string[] = [
  '카페 비교/추천',
  '맛집 추천',
  '패스오더 이용 팁',
  '이벤트',
  '공지사항',
  '운영 가이드',
  '리포트',
  '문제 해결',
];

const STATUS_TONE: Record<PublishStatus, 'orange' | 'green' | 'gray' | 'red'> = {
  발행: 'green',
  미리보기: 'orange',
  비공개: 'red',
};

interface FilterDraft {
  statuses: Set<PublishStatus>;
  locations: Set<PostLocation>;
  pinned: Set<PinnedFlag>;
  categories: Set<string>;
  from: string;
  to: string;
  period: Period;
  query: string;
}

const emptyFilter = (categories: readonly string[]): FilterDraft => ({
  statuses: new Set(STATUSES),
  locations: new Set(LOCATIONS),
  pinned: new Set(PINNED_FLAGS),
  categories: new Set(categories),
  from: '전체',
  to: '전체',
  period: '전체',
  query: '',
});

function ChevronDown({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={11} cy={11} r={7} />
      <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </svg>
  );
}

function RefreshIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function InfoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={10} />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CloseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PinnedMark({ on }: { on: boolean }) {
  if (on) {
    return (
      <span className="bm-circle bm-circle-on" aria-label="상단 고정">
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    );
  }
  return (
    <span className="bm-circle bm-circle-off" aria-label="상단 고정 아님">
      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
        <line x1="6" y1="12" x2="18" y2="12" />
      </svg>
    </span>
  );
}

interface CheckboxProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}

function Checkbox({ checked, label, onChange }: CheckboxProps) {
  return (
    <label className={`bm-check${checked ? ' is-checked' : ''}`}>
      <span className="bm-check-box" aria-hidden="true">
        {checked && <CheckIcon size={11} />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="bm-check-label">{label}</span>
    </label>
  );
}

interface RadioProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}

function Radio({ checked, label, onChange }: RadioProps) {
  return (
    <label className={`bm-radio${checked ? ' is-checked' : ''}`}>
      <span className="bm-radio-dot" aria-hidden="true" />
      <input type="radio" checked={checked} onChange={onChange} />
      <span className="bm-radio-label">{label}</span>
    </label>
  );
}

interface CheckboxRowProps<T extends string> {
  label: string;
  options: readonly T[];
  selected: Set<T>;
  onToggle: (option: T | 'all') => void;
}

function CheckboxRow<T extends string>({ label, options, selected, onToggle }: CheckboxRowProps<T>) {
  const allSelected = selected.size === options.length;
  return (
    <div className="bm-filter-row">
      <div className="bm-filter-label">{label}</div>
      <div className="bm-filter-value">
        <Checkbox checked={allSelected} label="전체" onChange={() => onToggle('all')} />
        {options.map((opt) => (
          <Checkbox key={opt} checked={selected.has(opt)} label={opt} onChange={() => onToggle(opt)} />
        ))}
      </div>
    </div>
  );
}

interface SelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function Select({ value, options, onChange }: SelectProps) {
  return (
    <div className="bm-select">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="bm-select-caret" aria-hidden="true">
        <ChevronDown size={16} />
      </span>
    </div>
  );
}

const DAY_OPTIONS = ['전체', '7', '14', '30', '60', '90', '180', '365'];
const PAGE_SIZE = 8;

const DESCRIPTION_MAX = 200;

interface ComposeDraft {
  notionUrl: string;
  title: string;
  description: string;
  tags: readonly string[];
  category: string;
  location: PostLocation;
  thumbnail: File | null;
  pinned: boolean;
}

const emptyDraft = (categories: readonly string[]): ComposeDraft => ({
  notionUrl: '',
  title: '',
  description: '',
  tags: [],
  category: categories[0] ?? '',
  location: '플랫폼',
  thumbnail: null,
  pinned: false,
});

function UploadCloudIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
      <path d="M16 12l-4-4-4 4" />
      <path d="M12 8v13" />
    </svg>
  );
}

interface ThumbnailUploaderProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

function ThumbnailUploader({ file, onChange }: ThumbnailUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith('image/')) return;
    onChange(f);
  };

  if (file && previewUrl) {
    return (
      <div className="bm-uploader-preview">
        <img src={previewUrl} alt="썸네일 미리보기" />
        <div className="bm-uploader-preview-meta">
          <span className="bm-uploader-preview-name">{file.name}</span>
          <span className="bm-uploader-preview-size">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        </div>
        <button
          type="button"
          className="bm-uploader-preview-clear"
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
          }}
          aria-label="썸네일 제거"
        >
          <CloseIcon size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bm-uploader${dragOver ? ' is-dragover' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <span className="bm-uploader-icon" aria-hidden="true">
        <UploadCloudIcon size={20} />
      </span>
      <span className="bm-uploader-text">
        <span className="bm-uploader-cta">클릭하여 업로드</span>
        <span className="bm-uploader-sub">또는 드래그 앤 드랍</span>
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="bm-uploader-input"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

interface TagInputProps {
  value: readonly string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

function TagInput({ value, onChange, placeholder = '태그 입력 후 Enter' }: TagInputProps) {
  const [input, setInput] = useState('');
  const trimmed = input.trim();
  const canAdd = trimmed.length > 0 && !value.includes(trimmed);

  const handleAdd = () => {
    if (!canAdd) return;
    onChange([...value, trimmed]);
    setInput('');
  };

  const handleRemove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="bm-tag-input">
      {value.map((tag) => (
        <span key={tag} className="bm-tag-chip">
          <span className="bm-tag-chip-text">{tag}</span>
          <button
            type="button"
            className="bm-tag-chip-remove"
            onClick={() => handleRemove(tag)}
            aria-label={`${tag} 삭제`}
          >
            <CloseIcon size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        className="bm-tag-input-field"
        placeholder={value.length === 0 ? placeholder : ''}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAdd();
          } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
            e.preventDefault();
            handleRemove(value[value.length - 1]);
          }
        }}
      />
    </div>
  );
}

interface ComposePanelProps {
  open: boolean;
  categories: readonly string[];
  onClose: () => void;
  onSave: (draft: ComposeDraft) => void;
}

function ComposePanel({ open, categories, onClose, onSave }: ComposePanelProps) {
  const [draft, setDraft] = useState<ComposeDraft>(() => emptyDraft(categories));
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(emptyDraft(categories));
      setSyncing(false);
    }
  }, [open, categories]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const canSync = draft.notionUrl.trim().length > 0 && !syncing;
  const canSubmit = draft.title.trim().length > 0;

  const handleSync = () => {
    if (!canSync) return;
    setSyncing(true);
    window.setTimeout(() => setSyncing(false), 400);
  };

  return (
    <div className={`bm-panel-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="bm-panel-backdrop" onClick={onClose} />
      <aside className="bm-panel" role="dialog" aria-modal="true" aria-label="블로그 글 작성">
        <header className="bm-panel-head">
          <h2 className="bm-panel-title">글 작성</h2>
          <button type="button" className="bm-panel-close" onClick={onClose} aria-label="닫기">
            <CloseIcon size={20} />
          </button>
        </header>

        <div className="bm-panel-body">
          <div className="bm-field">
            <label className="bm-field-label" htmlFor="bm-notion">노션 링크</label>
            <div className="bm-input-row">
              <input
                id="bm-notion"
                type="url"
                className="bm-input"
                placeholder="https://www.notion.so/..."
                value={draft.notionUrl}
                onChange={(e) => setDraft((d) => ({ ...d, notionUrl: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSync();
                  }
                }}
              />
              <button
                type="button"
                className="bm-btn bm-btn-outline-strong bm-btn-sync"
                disabled={!canSync}
                onClick={handleSync}
              >
                {syncing ? '동기화 중…' : '동기화'}
              </button>
            </div>
          </div>

          <div className="bm-field">
            <label className="bm-field-label" htmlFor="bm-title">제목</label>
            <input
              id="bm-title"
              type="text"
              className="bm-input"
              placeholder="제목을 입력해 주세요"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
          </div>

          <div className="bm-field">
            <label className="bm-field-label" htmlFor="bm-description">설명</label>
            <textarea
              id="bm-description"
              className="bm-textarea bm-textarea-sm"
              placeholder="설명을 입력해 주세요"
              value={draft.description}
              maxLength={DESCRIPTION_MAX}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
            <div className="bm-textarea-counter">({draft.description.length}/{DESCRIPTION_MAX})</div>
          </div>

          <div className="bm-field">
            <label className="bm-field-label">태그</label>
            <TagInput
              value={draft.tags}
              onChange={(next) => setDraft((d) => ({ ...d, tags: next }))}
            />
          </div>

          <div className="bm-field">
            <label className="bm-field-label">게시 위치</label>
            <div className="bm-radio-group" role="radiogroup">
              {LOCATIONS.map((loc) => (
                <Radio
                  key={loc}
                  checked={draft.location === loc}
                  label={loc}
                  onChange={() => setDraft((d) => ({ ...d, location: loc }))}
                />
              ))}
            </div>
          </div>

          <div className="bm-field">
            <label className="bm-field-label" htmlFor="bm-category">카테고리</label>
            <div className="bm-select bm-select-block">
              <select
                id="bm-category"
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="bm-select-caret" aria-hidden="true"><ChevronDown size={16} /></span>
            </div>
          </div>

          <div className="bm-field">
            <label className="bm-field-label">썸네일</label>
            <ThumbnailUploader
              file={draft.thumbnail}
              onChange={(f) => setDraft((d) => ({ ...d, thumbnail: f }))}
            />
          </div>

          <div className="bm-field">
            <label className="bm-field-label">상단 고정</label>
            <div className="bm-radio-group" role="radiogroup">
              {PINNED_FLAGS.map((flag) => (
                <Radio
                  key={flag}
                  checked={(draft.pinned ? '예' : '아니오') === flag}
                  label={flag}
                  onChange={() => setDraft((d) => ({ ...d, pinned: flag === '예' }))}
                />
              ))}
            </div>
          </div>

          <div className="bm-infobox">
            <span className="bm-infobox-icon" aria-hidden="true">
              <InfoIcon size={16} />
            </span>
            <span className="bm-infobox-text">
              저장 시 <strong>미리보기</strong> 상태로 등록됩니다.
            </span>
          </div>
        </div>

        <footer className="bm-panel-foot">
          <button type="button" className="bm-btn bm-btn-outline" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="bm-btn bm-btn-primary"
            disabled={!canSubmit}
            onClick={() => onSave(draft)}
          >
            저장
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default function BlogManagementPage() {
  const [categories, setCategories] = useState<readonly string[]>(INITIAL_CATEGORIES);
  const [filter, setFilter] = useState<FilterDraft>(() => emptyFilter(INITIAL_CATEGORIES));
  const [applied, setApplied] = useState<FilterDraft>(() => emptyFilter(INITIAL_CATEGORIES));
  const [filterOpen, setFilterOpen] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [composeOpen, setComposeOpen] = useState(false);
  const [categoryPanelOpen, setCategoryPanelOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const selectedPost = useMemo(
    () => (selectedPostId ? POSTS.find((p) => p.id === selectedPostId) ?? null : null),
    [selectedPostId],
  );

  const toggleSet = <T extends string>(set: Set<T>, options: readonly T[], next: T | 'all'): Set<T> => {
    if (next === 'all') {
      return set.size === options.length ? new Set() : new Set(options);
    }
    const updated = new Set(set);
    if (updated.has(next)) updated.delete(next);
    else updated.add(next);
    return updated;
  };

  const resetFilter = () => {
    const fresh = emptyFilter(categories);
    setFilter(fresh);
    setApplied(fresh);
    setVisibleCount(PAGE_SIZE);
  };

  const applyFilter = () => {
    setApplied({
      statuses: new Set(filter.statuses),
      locations: new Set(filter.locations),
      pinned: new Set(filter.pinned),
      categories: new Set(filter.categories),
      from: filter.from,
      to: filter.to,
      period: filter.period,
      query: filter.query.trim(),
    });
    setVisibleCount(PAGE_SIZE);
  };

  const handleSaveCategories = (next: readonly string[]) => {
    setCategories(next);
    setFilter((f) => ({ ...f, categories: new Set(next) }));
    setApplied((a) => ({ ...a, categories: new Set(next) }));
  };

  const filtered = useMemo(() => {
    return POSTS.filter((post) => {
      if (!applied.statuses.has(post.status)) return false;
      if (!applied.locations.has(post.location)) return false;
      if (applied.categories.size > 0 && !applied.categories.has(post.category)) return false;
      const pinnedFlag: PinnedFlag = post.pinned ? '예' : '아니오';
      if (!applied.pinned.has(pinnedFlag)) return false;
      if (applied.query) {
        const q = applied.query.toLowerCase();
        if (
          !post.title.toLowerCase().includes(q) &&
          !post.author.toLowerCase().includes(q) &&
          !post.url.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [applied]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: '160px 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [hasMore, filtered.length]);

  return (
    <div className="bm-screen">
      <header className="bm-topbar">
        <div className="bm-topbar-row">
          <h1 className="bm-title">블로그 관리</h1>
        </div>
      </header>

      <main className="bm-main">
        <section className="bm-filter">
          <div className="bm-filter-head">
            <span className="bm-filter-head-title">필터</span>
            <button
              type="button"
              className={`bm-filter-toggle${filterOpen ? ' is-open' : ''}`}
              onClick={() => setFilterOpen((v) => !v)}
              aria-expanded={filterOpen}
              aria-label="필터 펼치기/접기"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {filterOpen && (
            <div className="bm-filter-body">
              <CheckboxRow
                label="발행 상태"
                options={STATUSES}
                selected={filter.statuses}
                onToggle={(opt) => setFilter((f) => ({ ...f, statuses: toggleSet(f.statuses, STATUSES, opt) }))}
              />
              <CheckboxRow
                label="카테고리"
                options={categories}
                selected={filter.categories}
                onToggle={(opt) => setFilter((f) => ({ ...f, categories: toggleSet(f.categories, categories, opt) }))}
              />
              <div className="bm-filter-row">
                <div className="bm-filter-label">성과 조회</div>
                <div className="bm-filter-value bm-filter-value-range">
                  <Select value={filter.from} options={DAY_OPTIONS} onChange={(v) => setFilter((f) => ({ ...f, from: v }))} />
                  <span className="bm-filter-suffix">일</span>
                  <span className="bm-filter-divider">~</span>
                  <Select value={filter.to} options={DAY_OPTIONS} onChange={(v) => setFilter((f) => ({ ...f, to: v }))} />
                  <span className="bm-filter-suffix">일</span>
                  <div className="bm-period-group" role="group" aria-label="기간 빠른 선택">
                    {PERIODS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`bm-period-btn${filter.period === p ? ' is-active' : ''}`}
                        aria-pressed={filter.period === p}
                        onClick={() => setFilter((f) => ({ ...f, period: p }))}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <CheckboxRow
                label="게시 위치"
                options={LOCATIONS}
                selected={filter.locations}
                onToggle={(opt) => setFilter((f) => ({ ...f, locations: toggleSet(f.locations, LOCATIONS, opt) }))}
              />
              <CheckboxRow
                label="상단 고정 유무"
                options={PINNED_FLAGS}
                selected={filter.pinned}
                onToggle={(opt) => setFilter((f) => ({ ...f, pinned: toggleSet(f.pinned, PINNED_FLAGS, opt) }))}
              />
              <div className="bm-filter-row">
                <div className="bm-filter-label">검색</div>
                <div className="bm-filter-value">
                  <div className="bm-search">
                    <span className="bm-search-icon" aria-hidden="true">
                      <SearchIcon size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="제목, 작성자, URL 검색"
                      value={filter.query}
                      onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') applyFilter();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {filterOpen && (
          <div className="bm-filter-actions">
            <button type="button" className="bm-btn bm-btn-outline" onClick={resetFilter}>
              <RefreshIcon size={14} />
              <span>초기화</span>
            </button>
            <button type="button" className="bm-btn bm-btn-outline" onClick={applyFilter}>
              적용
            </button>
          </div>
        )}

        <div className="bm-table-actions">
          <button type="button" className="bm-btn bm-btn-outline" onClick={() => setCategoryPanelOpen(true)}>
            <PlusIcon size={16} />
            <span>카테고리 추가</span>
          </button>
          <button type="button" className="bm-btn bm-btn-primary" onClick={() => setComposeOpen(true)}>
            <PlusIcon size={16} />
            <span>글 작성</span>
          </button>
        </div>

        <section className="bm-table-card">
          <div className="bm-table-head">
            <div className="bm-table-count">
              총 <strong>{filtered.length}</strong>개
            </div>
          </div>

          <div className="bm-table-scroll">
            <table className="bm-table">
              <thead>
                <tr>
                  <th className="bm-th-title">제목</th>
                  <th>URL</th>
                  <th>게시 위치</th>
                  <th>카테고리</th>
                  <th>작성자</th>
                  <th>발행 상태</th>
                  <th className="bm-th-center">상단 고정 유무</th>
                  <th className="bm-th-num">조회수</th>
                  <th>게시일</th>
                  <th>최종 수정</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((post) => (
                  <tr
                    key={post.id}
                    className="bm-tr-clickable"
                    onClick={() => setSelectedPostId(post.id)}
                  >
                    <td className="bm-td-title">
                      <div className="bm-td-title-inner">
                        <span className="bm-td-title-text">{post.title}</span>
                      </div>
                    </td>
                    <td className="bm-td-url">
                      <a
                        className="bm-url-link"
                        href={post.url}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        title={post.url}
                      >
                        {post.url}
                      </a>
                    </td>
                    <td>
                      <span className={`bm-loc bm-loc-${post.location === 'B2B' ? 'b2b' : 'platform'}`}>{post.location}</span>
                    </td>
                    <td>{post.category}</td>
                    <td>{post.author}</td>
                    <td>
                      <span className={`bm-tag bm-tag-${STATUS_TONE[post.status]}`}>{post.status}</span>
                    </td>
                    <td className="bm-td-center">
                      <PinnedMark on={!!post.pinned} />
                    </td>
                    <td className="bm-td-num">{post.views.toLocaleString()}</td>
                    <td>{post.publishedAt}</td>
                    <td>{post.updatedAt}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td className="bm-td-empty" colSpan={10}>
                      조건에 맞는 게시글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="bm-infinite">
              {hasMore ? (
                <>
                  <div ref={sentinelRef} className="bm-infinite-sentinel" aria-hidden="true" />
                  <div className="bm-infinite-status">불러오는 중…</div>
                </>
              ) : (
                <div className="bm-infinite-end">마지막 게시글입니다</div>
              )}
            </div>
          )}
        </section>
      </main>

      <ComposePanel
        open={composeOpen}
        categories={categories}
        onClose={() => setComposeOpen(false)}
        onSave={() => setComposeOpen(false)}
      />

      <CategoryPanel
        open={categoryPanelOpen}
        categories={categories}
        onClose={() => setCategoryPanelOpen(false)}
        onSave={(next) => {
          handleSaveCategories(next);
          setCategoryPanelOpen(false);
        }}
      />

      <DetailPanel
        post={selectedPost}
        open={selectedPostId !== null}
        categories={categories}
        onClose={() => setSelectedPostId(null)}
      />
    </div>
  );
}

interface CategoryPanelProps {
  open: boolean;
  categories: readonly string[];
  onClose: () => void;
  onSave: (next: readonly string[]) => void;
}

function CategoryPanel({ open, categories, onClose, onSave }: CategoryPanelProps) {
  const [location, setLocation] = useState<PostLocation>('플랫폼');
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) {
      setLocation('플랫폼');
      setName('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const trimmed = name.trim();
  const canSubmit = trimmed.length > 0 && !categories.includes(trimmed);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave([...categories, trimmed]);
  };

  return (
    <div className={`bm-panel-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="bm-panel-backdrop" onClick={onClose} />
      <aside className="bm-panel" role="dialog" aria-modal="true" aria-label="카테고리 추가">
        <header className="bm-panel-head">
          <h2 className="bm-panel-title">카테고리 추가</h2>
          <button type="button" className="bm-panel-close" onClick={onClose} aria-label="닫기">
            <CloseIcon size={20} />
          </button>
        </header>

        <div className="bm-panel-body">
          <div className="bm-field">
            <label className="bm-field-label">게시 위치</label>
            <div className="bm-radio-group" role="radiogroup">
              {LOCATIONS.map((loc) => (
                <Radio
                  key={loc}
                  checked={location === loc}
                  label={loc}
                  onChange={() => setLocation(loc)}
                />
              ))}
            </div>
          </div>

          <div className="bm-field">
            <label className="bm-field-label" htmlFor="bm-cat-name">카테고리명</label>
            <input
              id="bm-cat-name"
              type="text"
              className="bm-input"
              placeholder="카테고리명을 입력해 주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>

        <footer className="bm-panel-foot">
          <button type="button" className="bm-btn bm-btn-outline" onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className="bm-btn bm-btn-primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            저장
          </button>
        </footer>
      </aside>
    </div>
  );
}

interface HistoryEvent {
  title: string;
  at: string;
  body: string[];
}

const HISTORY_BY_POST: Record<string, HistoryEvent[]> = {
  p1: [
    { title: '[게시물 생성]', at: '2025.11.28 09:12', body: ['노션 동기화: notion.so/page/a1b2', '작성자: 이주연'] },
    { title: '[상태 변경]', at: '2025.11.28 10:04', body: ['미리보기 → 발행', '사유: 에디터 검수 완료'] },
    { title: '[상단 고정]', at: '2025.11.28 10:05', body: ['상단 고정 ON', '담당: 콘텐츠팀'] },
    { title: '[썸네일 교체]', at: '2025.11.28 14:21', body: ['이전 파일: thumb_v1.png', '새 파일: thumb_seongsu_cafe.png (412 KB)'] },
    { title: '[카테고리 변경]', at: '2025.11.29 09:30', body: ['패스오더 이용 팁 → 카페 비교/추천'] },
  ],
  p3: [
    { title: '[게시물 생성]', at: '2025.11.20 11:20', body: ['노션 동기화: notion.so/page/c3d4', '작성자: 편집부'] },
    { title: '[상태 변경]', at: '2025.11.20 13:55', body: ['미리보기 → 발행'] },
    { title: '[알림 발송]', at: '2025.11.20 14:00', body: ['발송 채널: 앱 푸시 / 카카오 알림톡', '대상: 신규 회원 12,089명'] },
  ],
  p4: [
    { title: '[게시물 생성]', at: '2025.11.30 16:42', body: ['노션 동기화: notion.so/page/d5e6', '작성자: 김도현'] },
    { title: '[상태 변경]', at: '2025.11.30 17:00', body: ['임시저장 → 미리보기'] },
  ],
};

function defaultHistory(post: Post): HistoryEvent[] {
  return [
    { title: '[게시물 생성]', at: `${post.updatedAt} 09:00`, body: [`작성자: ${post.author}`, '노션 동기화 완료'] },
    { title: '[상태 변경]', at: `${post.updatedAt} 09:12`, body: [`미리보기 → ${post.status}`] },
  ];
}

interface DetailPanelProps {
  post: Post | null;
  open: boolean;
  categories: readonly string[];
  onClose: () => void;
  onSave?: () => void;
}

function DetailPanel({ post, open, categories, onClose, onSave }: DetailPanelProps) {
  const [tab, setTab] = useState<'info' | 'history'>('info');
  const [syncing, setSyncing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (open && post) {
      setTab('info');
      setSyncing(false);
      setTitle(post.title);
      setCategory(post.category);
      const meta = getPostMeta(post.id);
      setDescription(meta.description);
      setTags([...meta.tags]);
    }
  }, [open, post?.id]);

  const handleSync = () => {
    if (syncing) return;
    setSyncing(true);
    window.setTimeout(() => setSyncing(false), 400);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const history = post ? HISTORY_BY_POST[post.id] ?? defaultHistory(post) : [];

  return (
    <div className={`bm-panel-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="bm-panel-backdrop" onClick={onClose} />
      <aside className="bm-panel bm-panel-detail" role="dialog" aria-modal="true" aria-label="게시물 상세">
        <header className="bm-detail-head">
          <div className="bm-detail-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'info'}
              className={`bm-detail-tab${tab === 'info' ? ' is-active' : ''}`}
              onClick={() => setTab('info')}
            >
              정보
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'history'}
              className={`bm-detail-tab${tab === 'history' ? ' is-active' : ''}`}
              onClick={() => setTab('history')}
            >
              히스토리
            </button>
          </div>
          <button type="button" className="bm-panel-close" onClick={onClose} aria-label="닫기">
            <CloseIcon size={20} />
          </button>
        </header>

        {post && tab === 'info' && (() => {
          const cumulativeViews = post.views * 3 + 524;
          return (
            <div className="bm-detail-body">
              <section className="bm-detail-section">
                <div className="bm-detail-row bm-detail-row-stack">
                  <span className="bm-detail-label">제목</span>
                  <input
                    type="text"
                    className="bm-input"
                    placeholder="제목을 입력해 주세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="bm-detail-row bm-detail-row-stack">
                  <span className="bm-detail-label">설명</span>
                  <div className="bm-detail-value-stack">
                    <textarea
                      className="bm-textarea bm-textarea-sm"
                      placeholder="설명을 입력해 주세요"
                      value={description}
                      maxLength={DESCRIPTION_MAX}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="bm-textarea-counter">({description.length}/{DESCRIPTION_MAX})</div>
                  </div>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">링크</span>
                  <a
                    className="bm-url-link"
                    href={post.url}
                    onClick={(e) => e.preventDefault()}
                  >
                    {post.url}
                  </a>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">노션 링크</span>
                  <div className="bm-detail-notion-row">
                    <a className="bm-detail-link" href="#" onClick={(e) => e.preventDefault()}>
                      notion.so/page/{post.id}
                      <span aria-hidden>›</span>
                    </a>
                    <button
                      type="button"
                      className="bm-btn bm-btn-outline bm-btn-sync-sm"
                      disabled={syncing}
                      onClick={handleSync}
                    >
                      {syncing ? '동기화 중…' : '동기화'}
                    </button>
                  </div>
                </div>
              </section>

              <section className="bm-detail-section">
                <h3 className="bm-detail-section-title">게시 정보</h3>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">게시 위치</span>
                  <span className="bm-detail-value">
                    <span className={`bm-loc bm-loc-${post.location === 'B2B' ? 'b2b' : 'platform'}`}>{post.location}</span>
                  </span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">카테고리</span>
                  <div className="bm-select bm-select-block">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <span className="bm-select-caret" aria-hidden="true"><ChevronDown size={16} /></span>
                  </div>
                </div>
                <div className="bm-detail-row bm-detail-row-stack">
                  <span className="bm-detail-label">태그</span>
                  <TagInput value={tags} onChange={setTags} />
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">발행 상태</span>
                  <span className="bm-detail-value">
                    <span className={`bm-tag bm-tag-${STATUS_TONE[post.status]}`}>{post.status}</span>
                  </span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">상단 고정</span>
                  <span className="bm-detail-value bm-detail-value-flex">
                    <PinnedMark on={!!post.pinned} />
                    <span>{post.pinned ? '예' : '아니오'}</span>
                  </span>
                </div>
              </section>

              <section className="bm-detail-section">
                <h3 className="bm-detail-section-title">작성 정보</h3>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">작성자</span>
                  <span className="bm-detail-value">{post.author}</span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">게시일</span>
                  <span className="bm-detail-value">{post.publishedAt}</span>
                </div>
                <div className="bm-detail-row">
                  <span className="bm-detail-label">최종 수정일</span>
                  <span className="bm-detail-value">{post.updatedAt}</span>
                </div>
              </section>

              <section className="bm-detail-section">
                <h3 className="bm-detail-section-title">성과</h3>
                <div className="bm-stat-rows">
                  <div className="bm-stat-row">
                    <span className="bm-stat-row-label">기간 조회수</span>
                    <span className="bm-stat-row-value">{post.views.toLocaleString()}회</span>
                  </div>
                  <div className="bm-stat-row">
                    <span className="bm-stat-row-label">누적 조회수</span>
                    <span className="bm-stat-row-value">{cumulativeViews.toLocaleString()}회</span>
                  </div>
                </div>
              </section>
            </div>
          );
        })()}

        {post && tab === 'history' && (
          <div className="bm-detail-body bm-detail-body-history">
            {history.map((event, idx) => (
              <article key={idx} className="bm-history-item">
                <h4 className="bm-history-title">{event.title}</h4>
                <div className="bm-history-row">
                  <span className="bm-history-label">발생 일시</span>
                  <span className="bm-history-value">{event.at}</span>
                </div>
                <div className="bm-history-row">
                  <span className="bm-history-label">내용</span>
                  <div className="bm-history-value">
                    {event.body.map((line, i) => (
                      <span key={i} className="bm-history-line">{line}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
            {history.length === 0 && (
              <div className="bm-detail-empty">기록된 변경 내역이 없습니다.</div>
            )}
          </div>
        )}

        {post && (
          <footer className="bm-panel-foot">
            <button
              type="button"
              className="bm-btn bm-btn-primary"
              disabled={title.trim().length === 0}
              onClick={() => {
                onSave?.();
                onClose();
              }}
            >
              수정
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
