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

export type EventLabel =
  | 'shop-discount'
  | 'passorder-discount'
  | 'takeout-discount';

export type Menu = {
  name: string;
  desc: string;
  price: number;
  oldPrice: number | null;
  image: string;
  soldOut: boolean;
  badge: string | null;
  stock?: number;
  reward?: string;
  orderCount?: string;
  labels?: EventLabel[];
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

export type EventMenu = {
  name: string;
  desc: string;
  price: number;
  oldPrice: number;
  orderCount?: string;
  stock: number;
  reward: string;
  labels: EventLabel[];
  image?: string;
};

export type EventPromo = {
  title: string;
  desc: string;
  period: string;
  time: string;
  notice: string;
  menus: EventMenu[];
};

/* 매장 상세 > 인기 메뉴에서 사용하는 동일 이미지 URL을 재사용합니다. */
const STATIC_BASE = 'https://passorder-static.passorder.site';
const STORE_ID = '4bad0a44-a979-42a5-a8e5-0a8adb2c5806';
const MENU_GROUP_COFFEE = '9d71cf51-8dd6-47fd-9811-810c84a7a9d0';
const MENU_GROUP_OTHER = '580dd4bb-5128-4475-b462-6e8513555204';

export const MENU_IMAGES = {
  deal: `${STATIC_BASE}/default/100won-deal-menu.image`,
  americano: `${STATIC_BASE}/store/${STORE_ID}/menu/${MENU_GROUP_COFFEE}/999/250624-094308-331746.image`,
  latte: `${STATIC_BASE}/store/${STORE_ID}/menu/${MENU_GROUP_COFFEE}/999/250625-045045-669303.image`,
  lemonade: `${STATIC_BASE}/store/${STORE_ID}/menu/${MENU_GROUP_OTHER}/999/250625-045313-533794.image`,
  strawberry: `${STATIC_BASE}/store/${STORE_ID}/menu/${MENU_GROUP_OTHER}/999/250625-045740-343242.image`,
  greentea: `${STATIC_BASE}/store/${STORE_ID}/menu/${MENU_GROUP_OTHER}/None/250625-045910-661326.image`,
};

export const EVENT_PROMO: EventPromo = {
  title: '커피 메뉴 500원 할인',
  desc: '따뜻한 봄을 맞아 커피 전메뉴 500원 할인 이벤트를 진행합니다.',
  period: '2024년 12월 24일까지',
  time: '매일 11:00~12:00',
  notice: '하루에 한 번만 할인가로 구매 가능해요',
  menus: [
    {
      name: '아메리카노',
      desc: '에티오피아 예가체프 첼바 내츄럴 (다채롭고 복합적인 꽃향, 은은한 과일산미) HOT or ICE 선택/사이즈 선택',
      price: 2000,
      oldPrice: 2500,
      orderCount: 'N',
      stock: 10,
      reward: '매장적립',
      image: MENU_IMAGES.americano,
      labels: ['shop-discount'],
    },
    {
      name: '카페라떼',
      desc: '에티오피아 예가체프 첼바 내츄럴 (다채롭고 복합적인 꽃향, 은은한 과일산미) HOT or ICE 선택/사이즈 선택',
      price: 4000,
      oldPrice: 4500,
      orderCount: 'N',
      stock: 10,
      reward: '매장적립',
      image: MENU_IMAGES.latte,
      labels: ['shop-discount', 'passorder-discount', 'takeout-discount'],
    },
    {
      name: '바닐라라떼',
      desc: '에티오피아 예가체프 첼바 내츄럴 (다채롭고 복합적인 꽃향, 은은한 과일산미) HOT or ICE 선택/사이즈 선택',
      price: 4000,
      oldPrice: 4500,
      stock: 100,
      reward: '매장적립',
      labels: ['shop-discount'],
    },
  ],
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
        image: MENU_IMAGES.deal,
        soldOut: false,
        badge: '100원',
        stock: 41,
        reward: '매장적립',
        orderCount: '2.4K',
        labels: ['shop-discount', 'takeout-discount'],
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
        image: MENU_IMAGES.americano,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '1.2K',
        labels: ['shop-discount'],
        options: [SIZE_TGV, EXTRAS],
      },
      {
        name: '모닝카페라떼',
        desc: '오픈시간부터 오전 10시까지 모닝할인',
        price: 4000,
        oldPrice: null,
        image: MENU_IMAGES.latte,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '850',
        labels: ['shop-discount'],
        options: [SIZE_TG],
      },
      {
        name: '아메리카노',
        desc: '에스프레소 2샷, 진하고 깊은 풍미',
        price: 3600,
        oldPrice: null,
        image: MENU_IMAGES.americano,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '3.4K',
        stock: 50,
        options: [SIZE_TGV, EXTRAS],
      },
      {
        name: '카페라떼',
        desc: '벨벳처럼 부드러운 우유 거품',
        price: 4000,
        oldPrice: null,
        image: MENU_IMAGES.latte,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '2.8K',
        stock: 40,
        options: [SIZE_TG],
      },
      {
        name: '카푸치노',
        desc: '고소한 우유 거품 위에 시나몬 향',
        price: 4500,
        oldPrice: null,
        image: MENU_IMAGES.latte,
        soldOut: true,
        badge: null,
        reward: '매장적립',
        orderCount: '420',
        stock: 0,
        options: [],
      },
      {
        name: '콜드브루',
        desc: '12시간 저온 추출, 부드러운 산미',
        price: 5000,
        oldPrice: null,
        image: MENU_IMAGES.americano,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '1.5K',
        stock: 30,
        labels: ['passorder-discount'],
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
        image: MENU_IMAGES.lemonade,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '320',
        stock: 15,
        options: [],
      },
      {
        name: '딸기 스무디',
        desc: '국산 딸기 100%',
        price: 6000,
        oldPrice: null,
        image: MENU_IMAGES.strawberry,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '180',
        stock: 20,
        labels: ['takeout-discount'],
        options: [],
      },
      {
        name: '자몽에이드',
        desc: '상큼한 자몽 과육이 듬뿍',
        price: 5800,
        oldPrice: null,
        image: MENU_IMAGES.lemonade,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '95',
        stock: 25,
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
        image: MENU_IMAGES.greentea,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '60',
        options: [],
      },
      {
        name: '얼그레이',
        desc: '베르가못 향이 풍부한 클래식 홍차',
        price: 4500,
        oldPrice: null,
        image: MENU_IMAGES.greentea,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '45',
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
        image: MENU_IMAGES.greentea,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '210',
        stock: 12,
        options: [],
      },
      {
        name: '당근 케이크',
        desc: '수제 크림 치즈 프로스팅',
        price: 6500,
        oldPrice: null,
        image: MENU_IMAGES.greentea,
        soldOut: false,
        badge: null,
        reward: '매장적립',
        orderCount: '88',
        stock: 5,
        options: [],
      },
    ],
  },
];

export const ALL_MENUS: Menu[] = CATEGORIES.flatMap((c) => c.items);
