import type { Menu } from './data';

export const SIZE_DELTA: Record<string, number> = { Tall: 0, Grande: 500, Venti: 1000 };
export const OPT_DELTA: Record<string, number> = { '샷 추가': 500, '시럽 추가': 300 };
export const SIZE_ORDER = ['Tall', 'Grande', 'Venti'] as const;

export type SizeName = (typeof SIZE_ORDER)[number];

export type CartLine = {
  menu: Menu;
  size: SizeName;
  options: string[];
  qty: number;
};

export type Selection = {
  menu: Menu;
  size: SizeName;
  options: Set<string>;
  qty: number;
};

export function fmtKRW(n: number): string {
  return Math.round(n).toLocaleString('ko-KR') + '원';
}

export function unitPrice(menu: Menu, size: string, options: string[]): number {
  const sd = SIZE_DELTA[size] || 0;
  const od = options.reduce((s, o) => s + (OPT_DELTA[o] || 0), 0);
  return menu.price + sd + od;
}

export function lineTotal(line: CartLine): number {
  return unitPrice(line.menu, line.size, line.options) * line.qty;
}

export function cartTotal(cart: CartLine[]): number {
  return cart.reduce((s, l) => s + lineTotal(l), 0);
}

export function cartItemCount(cart: CartLine[]): number {
  return cart.reduce((s, l) => s + l.qty, 0);
}

export function describeLine(line: CartLine): string {
  const parts: string[] = [line.size];
  for (const o of line.options) parts.push(o);
  return parts.join(', ');
}

export function sameOptions(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = new Set(a);
  for (const x of b) if (!sa.has(x)) return false;
  return true;
}
