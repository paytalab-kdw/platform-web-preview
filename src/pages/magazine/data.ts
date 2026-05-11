export interface Article {
  category: string;
  title: string;
  lead: string;
  author: string;
  authorRole: string;
  authorBio: string;
  date: string;
  readTime: number;
  location: string;
  likes: number;
}

export interface TocItem { id: string; label: string; }

export interface RelatedItem {
  cat: string;
  emoji: string;
  bg: string;
  title: string;
  date: string;
  read: number;
}

export const ARTICLE: Article = {
  category: '성수동 카페',
  title:
    '성수동 노트북 작업 카페 12곳 — 콘센트, 와이파이, 분위기까지 다 챙겼어요',
  lead:
    '주말마다 노트북 들고 카페 투어를 다닌 에디터가 직접 가본 성수동 카페 12곳을 콘센트 자리·와이파이 속도·소음 정도까지 정리했어요.',
  author: '이주연',
  authorRole: '패스오더 매거진 에디터',
  authorBio: '주 3회 카페에서 일하는 디지털 노마드. 성수·연남·서촌 카페 200곳 이상 방문.',
  date: '2025년 11월 28일',
  readTime: 8,
  location: '성수동',
  likes: 284,
};

export const TOC: TocItem[] = [
  { id: 'sec-1', label: '성수동에서 작업하기 좋은 카페란?' },
  { id: 'sec-2', label: '에디터의 4가지 평가 기준' },
  { id: 'sec-3', label: '성수동 작업 카페 TOP 3' },
  { id: 'sec-4', label: '온종일 머물기 좋은 카페 5곳' },
  { id: 'sec-5', label: '잠깐 들리기 좋은 카페 4곳' },
  { id: 'sec-6', label: '오늘 정리 — 어디부터 가볼까?' },
];

export const TAGS = [
  '성수동', '노트북카페', '작업카페', '콘센트',
  '조용한카페', '카페투어', '성수카페추천',
];

export const RELATED: RelatedItem[] = [
  { cat: '연남동', emoji: '💻', bg: '#E5EAEF', title: '연남동 디지털 노마드 카페 10선 — 와이파이 빠른 곳만', date: '2025.11.20', read: 6 },
  { cat: '을지로', emoji: '🍃', bg: '#E8F5E9', title: '을지로 노포 옆 작업 카페 — 한적함이 무기인 8곳', date: '2025.11.14', read: 7 },
  { cat: '성수동', emoji: '🍰', bg: '#FFF2ED', title: '성수동에서 진짜 맛있는 디저트 카페 9곳', date: '2025.10.30', read: 5 },
  { cat: '한남동', emoji: '📖', bg: '#F7F7F7', title: '한남동 조용한 1인 카페 7곳', date: '2025.10.18', read: 4 },
  { cat: '성수동', emoji: '🍷', bg: '#FCE4EC', title: '퇴근 후 들르기 좋은 성수 와인바 6곳', date: '2025.09.28', read: 5 },
];

export const fmt = (n: number) => n.toLocaleString('ko-KR');
