import { useCallback, useReducer } from 'react';
import { findMenu } from './data';
import type { CartLine, Selection, SizeName } from './pricing';
import { sameOptions } from './pricing';

export type OverlayKind = 'detail' | 'cart' | 'modal' | null;

export type State = {
  cart: CartLine[];
  selection: Selection | null;
  overlay: OverlayKind;
};

type Action =
  | { type: 'OPEN_DETAIL'; menuName: string }
  | { type: 'OPEN_CART' }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_OVERLAY' }
  | { type: 'SET_SIZE'; size: SizeName }
  | { type: 'TOGGLE_OPTION'; option: string }
  | { type: 'SET_QTY'; qty: number }
  | { type: 'INC_QTY' }
  | { type: 'DEC_QTY' }
  | { type: 'ADD_TO_CART' }
  | { type: 'UPDATE_LINE_QTY'; index: number; qty: number }
  | { type: 'REMOVE_LINE'; index: number }
  | { type: 'DEV_NAV'; screen: string };

const initial: State = {
  cart: [],
  selection: null,
  overlay: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN_DETAIL': {
      const menu = findMenu(action.menuName);
      if (!menu) return state;
      return {
        ...state,
        overlay: 'detail',
        selection: { menu, size: 'Tall', options: new Set(), qty: 1 },
      };
    }
    case 'OPEN_CART':
      return { ...state, overlay: 'cart' };
    case 'OPEN_MODAL':
      return { ...state, overlay: 'modal' };
    case 'CLOSE_OVERLAY':
      return { ...state, overlay: null };
    case 'SET_SIZE':
      if (!state.selection) return state;
      return { ...state, selection: { ...state.selection, size: action.size } };
    case 'TOGGLE_OPTION': {
      if (!state.selection) return state;
      const next = new Set(state.selection.options);
      if (next.has(action.option)) next.delete(action.option);
      else next.add(action.option);
      return { ...state, selection: { ...state.selection, options: next } };
    }
    case 'SET_QTY':
      if (!state.selection) return state;
      return {
        ...state,
        selection: { ...state.selection, qty: Math.max(1, action.qty) },
      };
    case 'INC_QTY':
      if (!state.selection) return state;
      return { ...state, selection: { ...state.selection, qty: state.selection.qty + 1 } };
    case 'DEC_QTY':
      if (!state.selection) return state;
      return {
        ...state,
        selection: { ...state.selection, qty: Math.max(1, state.selection.qty - 1) },
      };
    case 'ADD_TO_CART': {
      const sel = state.selection;
      if (!sel) return state;
      const opts = Array.from(sel.options);
      const existingIdx = state.cart.findIndex(
        (l) =>
          l.menu.name === sel.menu.name && l.size === sel.size && sameOptions(l.options, opts),
      );
      let cart: CartLine[];
      if (existingIdx >= 0) {
        cart = state.cart.map((l, i) =>
          i === existingIdx ? { ...l, qty: l.qty + sel.qty } : l,
        );
      } else {
        cart = [...state.cart, { menu: sel.menu, size: sel.size, options: opts, qty: sel.qty }];
      }
      return { ...state, cart, overlay: null, selection: null };
    }
    case 'UPDATE_LINE_QTY': {
      const cart = state.cart
        .map((l, i) => (i === action.index ? { ...l, qty: Math.max(1, action.qty) } : l));
      return { ...state, cart };
    }
    case 'REMOVE_LINE': {
      const cart = state.cart.filter((_, i) => i !== action.index);
      // If cart became empty, close any cart-related overlay
      const overlay = cart.length === 0 && (state.overlay === 'cart' || state.overlay === 'modal')
        ? null
        : state.overlay;
      return { ...state, cart, overlay };
    }
    case 'DEV_NAV': {
      // Maps a screen name to overlay/cart preset
      switch (action.screen) {
        case 'menu-empty':
          return { ...state, overlay: null, cart: [] };
        case 'menu-with-cart':
          return {
            ...state,
            overlay: null,
            cart: state.cart.length > 0 ? state.cart : DEMO_CART(),
          };
        case 'menu-detail': {
          const menu = findMenu('아메리카노');
          if (!menu) return state;
          return {
            ...state,
            overlay: 'detail',
            selection: { menu, size: 'Tall', options: new Set(), qty: 1 },
          };
        }
        case 'cart-sheet':
          return {
            ...state,
            overlay: 'cart',
            cart: state.cart.length > 0 ? state.cart : DEMO_CART(),
          };
        case 'inapp-modal':
          return {
            ...state,
            overlay: 'modal',
            cart: state.cart.length > 0 ? state.cart : DEMO_CART(),
          };
        default:
          return state;
      }
    }
    default:
      return state;
  }
}

function DEMO_CART(): CartLine[] {
  const americano = findMenu('아메리카노');
  const latte = findMenu('카페라떼');
  if (!americano || !latte) return [];
  return [
    { menu: americano, size: 'Grande', options: ['샷 추가'], qty: 1 },
    { menu: latte, size: 'Tall', options: [], qty: 1 },
  ];
}

export function useMenuState() {
  const [state, dispatch] = useReducer(reducer, initial);

  const actions = {
    openDetail: useCallback((menuName: string) => dispatch({ type: 'OPEN_DETAIL', menuName }), []),
    openCart: useCallback(() => dispatch({ type: 'OPEN_CART' }), []),
    openModal: useCallback(() => dispatch({ type: 'OPEN_MODAL' }), []),
    closeOverlay: useCallback(() => dispatch({ type: 'CLOSE_OVERLAY' }), []),
    setSize: useCallback((size: SizeName) => dispatch({ type: 'SET_SIZE', size }), []),
    toggleOption: useCallback(
      (option: string) => dispatch({ type: 'TOGGLE_OPTION', option }),
      [],
    ),
    incQty: useCallback(() => dispatch({ type: 'INC_QTY' }), []),
    decQty: useCallback(() => dispatch({ type: 'DEC_QTY' }), []),
    addToCart: useCallback(() => dispatch({ type: 'ADD_TO_CART' }), []),
    updateLineQty: useCallback(
      (index: number, qty: number) => dispatch({ type: 'UPDATE_LINE_QTY', index, qty }),
      [],
    ),
    removeLine: useCallback((index: number) => dispatch({ type: 'REMOVE_LINE', index }), []),
    devNav: useCallback((screen: string) => dispatch({ type: 'DEV_NAV', screen }), []),
  };

  return { state, actions };
}
