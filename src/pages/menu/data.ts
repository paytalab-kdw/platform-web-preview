export type OptionPill = {
  name: string;
  delta: string;
  zero?: boolean;
};

export type OptionGroup = {
  label: string;
  required: boolean;
  pills: OptionPill[];
};

export type Menu = {
  name: string;
  desc: string;
  price: number;
  oldPrice: number | null;
  emoji: string;
  soldOut: boolean;
  badge: string | null;
  stock?: number;
  thumbGradient: [string, string];
  options: OptionGroup[];
};

export type Category = {
  id: string;
  label: string;
  count: number;
  items: Menu[];
};

export const SHOP = {
  name: '에슬로우커피 라운지점',
  status: '영업중 · ~22:00',
};

const SIZE_TG: OptionGroup = {
  label: '사이즈',
  required: true,
  pills: [
    { name: 'Tall', delta: '기본', zero: true },
    { name: 'Grande', delta: '+500원' },
  ],
};

const SIZE_TGV: OptionGroup = {
  label: '사이즈',
  required: true,
  pills: [
    { name: 'Tall', delta: '기본', zero: true },
    { name: 'Grande', delta: '+500원' },
    { name: 'Venti', delta: '+1,000원' },
  ],
};

const EXTRAS: OptionGroup = {
  label: '추가 옵션',
  required: false,
  pills: [
    { name: '샷 추가', delta: '+500원' },
    { name: '시럽 추가', delta: '+300원' },
  ],
};

export const CATEGORIES: Category[] = [
  {
    id: 'cat-event',
    label: '선착순 한정 이벤트',
    count: 1,
    items: [
      {
        name: '♥100원 아메리카노♥',
        desc: '테이크아웃만 가능, 주문폭주로 준비가 늦어질 수 있어요.',
        price: 100,
        oldPrice: 3600,
        emoji: '☕',
        soldOut: false,
        badge: '100원',
        stock: 41,
        thumbGradient: ['#3D2817', '#1F1108'],
        options: [SIZE_TG],
      },
    ],
  },
  {
    id: 'cat-coffee',
    label: 'COFFEE',
    count: 6,
    items: [
      {
        name: '모닝아메리카노',
        desc: '오픈시간부터 오전 10시까지 모닝할인',
        price: 3600,
        oldPrice: null,
        emoji: '🧊',
        soldOut: false,
        badge: null,
        thumbGradient: ['#5A3B1F', '#2F1D0E'],
        options: [SIZE_TGV, EXTRAS],
      },
      {
        name: '모닝카페라떼',
        desc: '오픈시간부터 오전 10시까지 모닝할인',
        price: 4000,
        oldPrice: null,
        emoji: '🥛',
        soldOut: false,
        badge: null,
        thumbGradient: ['#C9A878', '#8B6F4E'],
        options: [SIZE_TG],
      },
      {
        name: '아메리카노',
        desc: '에스프레소 2샷, 진하고 깊은 풍미',
        price: 3600,
        oldPrice: null,
        emoji: '☕',
        soldOut: false,
        badge: null,
        thumbGradient: ['#3D2817', '#1F1108'],
        options: [SIZE_TGV, EXTRAS],
      },
      {
        name: '카페라떼',
        desc: '벨벳처럼 부드러운 우유 거품',
        price: 4000,
        oldPrice: null,
        emoji: '🥛',
        soldOut: false,
        badge: null,
        thumbGradient: ['#D4B896', '#A88968'],
        options: [SIZE_TG],
      },
      {
        name: '카푸치노',
        desc: '고소한 우유 거품 위에 시나몬 향',
        price: 4500,
        oldPrice: null,
        emoji: '☕',
        soldOut: true,
        badge: null,
        thumbGradient: ['#A88968', '#5A3B1F'],
        options: [],
      },
      {
        name: '콜드브루',
        desc: '12시간 저온 추출, 부드러운 산미',
        price: 5000,
        oldPrice: null,
        emoji: '🧊',
        soldOut: false,
        badge: null,
        thumbGradient: ['#2F1D0E', '#1F1108'],
        options: [SIZE_TG],
      },
    ],
  },
  {
    id: 'cat-juice',
    label: 'FRESH JUICE',
    count: 3,
    items: [
      {
        name: '생오렌지주스',
        desc: '당일 착즙, 무가당',
        price: 5500,
        oldPrice: null,
        emoji: '🍊',
        soldOut: false,
        badge: null,
        thumbGradient: ['#FFB347', '#FF7949'],
        options: [],
      },
      {
        name: '딸기 스무디',
        desc: '국산 딸기 100%',
        price: 6000,
        oldPrice: null,
        emoji: '🍓',
        soldOut: false,
        badge: null,
        thumbGradient: ['#FF7B9C', '#E5484D'],
        options: [],
      },
      {
        name: '자몽에이드',
        desc: '상큼한 자몽 과육이 듬뿍',
        price: 5800,
        oldPrice: null,
        emoji: '🥤',
        soldOut: false,
        badge: null,
        thumbGradient: ['#FF9F7C', '#FF7949'],
        options: [],
      },
    ],
  },
  {
    id: 'cat-tea',
    label: 'HEAL TEA',
    count: 2,
    items: [
      {
        name: '캐모마일 티',
        desc: '잠들기 전 따뜻한 한 잔',
        price: 4500,
        oldPrice: null,
        emoji: '🍵',
        soldOut: false,
        badge: null,
        thumbGradient: ['#FFE4B5', '#D4A86A'],
        options: [],
      },
      {
        name: '얼그레이',
        desc: '베르가못 향이 풍부한 클래식 홍차',
        price: 4500,
        oldPrice: null,
        emoji: '🫖',
        soldOut: false,
        badge: null,
        thumbGradient: ['#8B6F4E', '#3D2817'],
        options: [],
      },
    ],
  },
  {
    id: 'cat-dessert',
    label: 'DESSERT',
    count: 2,
    items: [
      {
        name: '크루아상',
        desc: '프랑스 직배송 버터 100%',
        price: 4200,
        oldPrice: null,
        emoji: '🥐',
        soldOut: false,
        badge: null,
        thumbGradient: ['#E8C896', '#B8935A'],
        options: [],
      },
      {
        name: '당근 케이크',
        desc: '수제 크림 치즈 프로스팅',
        price: 6500,
        oldPrice: null,
        emoji: '🍰',
        soldOut: false,
        badge: null,
        thumbGradient: ['#D9A878', '#8B6F4E'],
        options: [],
      },
    ],
  },
];

export const ALL_MENUS: Menu[] = CATEGORIES.flatMap((c) => c.items);
