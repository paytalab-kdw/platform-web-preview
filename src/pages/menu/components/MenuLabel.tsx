import type { EventLabel } from '../data';

const LABEL_TEXT: Record<EventLabel, string> = {
  'shop-discount': '사장님할인',
  'passorder-discount': '패스오더할인',
  'takeout-discount': '테이크아웃할인',
};

export function MenuLabelChip({ label }: { label: EventLabel }) {
  return (
    <span className={`mp-evt-label ${label}`}>
      <LabelIcon label={label} />
      {LABEL_TEXT[label]}
    </span>
  );
}

function LabelIcon({ label }: { label: EventLabel }) {
  switch (label) {
    case 'shop-discount':
      return (
        <svg viewBox="0 0 14 14" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="5.5" stroke="#0AC4B1" strokeWidth="1.2" fill="#fff" />
          <path d="M4.6 7l1.8 1.6L9.4 5.4" stroke="#0AC4B1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'passorder-discount':
      return (
        <svg viewBox="0 0 14 14" fill="none" aria-hidden>
          <rect x="1.2" y="3" width="11.6" height="8" rx="1.4" stroke="#2196F3" strokeWidth="1.2" fill="#fff" />
          <path d="M3.6 6.2h6.8M3.6 8.4h4.4" stroke="#2196F3" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'takeout-discount':
      return (
        <svg viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M2.4 5.2h9.2l-.9 6a1 1 0 01-1 .9H4.3a1 1 0 01-1-.9l-.9-6z" fill="#fff" stroke="#FF7949" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M5 5.2V3.8a2 2 0 014 0v1.4" stroke="#FF7949" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
  }
}
