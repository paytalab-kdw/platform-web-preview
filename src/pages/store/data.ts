/* Data extracted from store/assets/js/app.js */

export type MenuType = 'deal' | 'discount' | 'regular';

export interface Store {
  name: string;
  desc1: string;
  desc2: string;
  address: string;
  distance: string;
  hours: string;
  orders: string;
  badges: string[];
  promo: string;
}

export interface PopularMenu {
  name: string;
  type: MenuType;
  price: number;
  oldPrice: number | null;
  desc: string;
  tags: string[];
  bg: string;
}

export interface NewsItem {
  tag: string;
  type: string;
  title: string;
  desc: string;
  discount: string;
  period: string;
  schedule: string;
  repeat: string;
  views: string;
  bg: string;
  emoji: string;
}

export interface StoryItem {
  user: string;
  date: string;
  text: string;
  likes: number;
  bg: string;
  emoji: string;
  avatarBg: string;
}

export const STORE: Store = {
  name: '에슬로우커피 라운지점',
  desc1: '대한민국 대표 프리미엄 더치커피전문점 입니다.',
  desc2: '토스트 무료 셀프이용합니다.',
  address: '서울특별시 강남구 테헤란로86길 13 (대치동)',
  distance: '159m · 걸어서 3분',
  hours: '영업 중 · 18:30까지',
  orders: '8,691',
  badges: ['매장이벤트', '매장', '적립', '100원 이벤트'],
  promo: '100원 커피 혜택!',
};

const STORE_IMAGE_URL =
  'https://passorder-static.passorder.site/default/empty_store.image';

export const HERO_IMAGES: string[] = [
  `#1F1108 url(${STORE_IMAGE_URL}) center/cover no-repeat`,
  `#1F1108 url(${STORE_IMAGE_URL}) center/cover no-repeat`,
  `#1F1108 url(${STORE_IMAGE_URL}) center/cover no-repeat`,
  `#1F1108 url(${STORE_IMAGE_URL}) center/cover no-repeat`,
];

const _img = (url: string) => `#1F1108 url(${url}) center/cover no-repeat`;

export const POPULAR_MENUS: PopularMenu[] = [
  {
    name: '♥100원 아메리카노♥',
    type: 'deal',
    price: 100,
    oldPrice: 3000,
    desc: '테이크아웃만 가능, 주문폭주로 준비가 늦어질 수 있어요.',
    tags: [],
    bg: _img('https://passorder-static.passorder.site/default/100won-deal-menu.image'),
  },
  {
    name: '아메리카노',
    type: 'discount',
    price: 2000,
    oldPrice: 3600,
    desc: '에티오피아 예가체프 첼바 내츄럴 (다채롭고 복합적인 꽃향, 은은한 과일산미)',
    tags: ['passorder', 'takeout'],
    bg: _img('https://passorder-static.passorder.site/store/4bad0a44-a979-42a5-a8e5-0a8adb2c5806/menu/9d71cf51-8dd6-47fd-9811-810c84a7a9d0/999/250624-094308-331746.image'),
  },
  {
    name: '카페라떼',
    type: 'discount',
    price: 2500,
    oldPrice: 4000,
    desc: '벨벳처럼 부드러운 우유 거품, HOT or ICE 선택/사이즈 선택',
    tags: ['passorder'],
    bg: _img('https://passorder-static.passorder.site/store/4bad0a44-a979-42a5-a8e5-0a8adb2c5806/menu/9d71cf51-8dd6-47fd-9811-810c84a7a9d0/999/250625-045045-669303.image'),
  },
  {
    name: '레몬에이드',
    type: 'regular',
    price: 4500,
    oldPrice: null,
    desc: '상큼한 레몬과 청량한 탄산의 조화',
    tags: [],
    bg: _img('https://passorder-static.passorder.site/store/4bad0a44-a979-42a5-a8e5-0a8adb2c5806/menu/580dd4bb-5128-4475-b462-6e8513555204/999/250625-045313-533794.image'),
  },
  {
    name: '딸기라떼',
    type: 'regular',
    price: 5000,
    oldPrice: null,
    desc: '신선한 딸기와 부드러운 우유의 만남',
    tags: [],
    bg: _img('https://passorder-static.passorder.site/store/4bad0a44-a979-42a5-a8e5-0a8adb2c5806/menu/580dd4bb-5128-4475-b462-6e8513555204/999/250625-045740-343242.image'),
  },
  {
    name: '녹차라떼',
    type: 'regular',
    price: 4800,
    oldPrice: null,
    desc: '진한 녹차와 부드러운 우유의 풍미',
    tags: [],
    bg: _img('https://passorder-static.passorder.site/store/4bad0a44-a979-42a5-a8e5-0a8adb2c5806/menu/580dd4bb-5128-4475-b462-6e8513555204/None/250625-045910-661326.image'),
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    tag: '진행 중',
    type: '사장님 할인',
    title: '오픈 시간 모닝 1,000원 할인 이벤트',
    desc: '오픈시간 모닝 시간대에 아메리카노를 주문하면 700원 할인 받을 수 있어요. 매일 진행됩니다.',
    discount: '700원 할인',
    period: '2025년 12월 05일 ~',
    schedule: '매일 07:30-10:00',
    repeat: '반복 사용 가능',
    views: '1천+',
    bg: 'linear-gradient(135deg,#FFCBB8,#FF9F7C)',
    emoji: '☕',
  },
  {
    tag: '진행 중',
    type: '신메뉴',
    title: '겨울 시즌 신메뉴 출시 & 전 메뉴 15% 할인',
    desc: '겨울 한정 신메뉴 출시를 기념해 전 메뉴 15% 할인 이벤트를 진행합니다. 많은 참여 부탁드립니다.',
    discount: '전 메뉴 15% 할인',
    period: '2025년 12월 01일 ~ 12월 31일',
    schedule: '매일 종일',
    repeat: '1인 1회',
    views: '2.4천',
    bg: 'linear-gradient(135deg,#E5EAEF,#A1ABB6)',
    emoji: '🥐',
  },
  {
    tag: '예정',
    type: '쿠폰',
    title: '신규 회원 환영 2,000원 즉시 할인 쿠폰',
    desc: '신규 가입 회원에게 즉시 사용 가능한 2,000원 할인 쿠폰을 지급해 드립니다.',
    discount: '2,000원 즉시 할인',
    period: '2026년 01월 01일 ~',
    schedule: '신규 가입 시',
    repeat: '1회 한정',
    views: '421',
    bg: 'linear-gradient(135deg,#FEF6EE,#FFE4DB)',
    emoji: '🎁',
  },
];

export const STORY_ITEMS: StoryItem[] = [
  {
    user: '경윤',
    date: '2023.07.11',
    text: '친절하세요🙂🙂🙂🙂🙂',
    likes: 5,
    bg: 'linear-gradient(135deg,#3D2817,#7D6147)',
    emoji: '🥤',
    avatarBg: '#FFCBB8',
  },
  {
    user: '고리룽죽겟지?',
    date: '2023.06.15',
    text: '젤 부드러운 아아',
    likes: 2,
    bg: 'linear-gradient(135deg,#A88968,#5A3B1F)',
    emoji: '🥛',
    avatarBg: '#E5EAEF',
  },
  {
    user: '민지',
    date: '2023.05.28',
    text: '사장님 너무 친절하시고 커피도 맛있어요~',
    likes: 8,
    bg: 'linear-gradient(135deg,#C5A983,#8B6F4E)',
    emoji: '☕',
    avatarBg: '#FFE4DB',
  },
];

export const TOTAL_STORIES = 192;

export const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';

export const BADGE_PALETTE = [
  { bg: '#0AC4B1', color: '#fff' },
  { bg: '#FFC107', color: '#fff' },
  { bg: '#132D48', color: '#fff' },
  { bg: '#FF7949', color: '#fff' },
];
