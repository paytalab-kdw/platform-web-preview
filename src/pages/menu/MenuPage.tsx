import '../../styles/menu.css';
import '../../styles/menu-overrides.css';
import CartSheet from '../../components/overlays/CartSheet';
import InAppModal from '../../components/overlays/InAppModal';
import MenuDetailSheet from '../../components/overlays/MenuDetailSheet';
import FloatingCartBar from './components/FloatingCartBar';
import MenuListScreen from './components/MenuListScreen';
import { cartItemCount, cartTotal } from './pricing';
import { useMenuState } from './useMenuState';

export default function MenuPage() {
  const { state, actions } = useMenuState();

  // Mirrors the magazine/store detail layout: a single flex-column page that
  // fills #root (height:100%, max-width:480px from store.css/magazine.css), with
  // one internal scroll region. The original Figma export's deeply-nested
  // 414×896 wrapper chain (.stage/.frame/.screen/dc-card/__el-*) was clipping
  // content and is no longer rendered.
  const listVariant = state.cart.length > 0 ? 'menu-with-cart' : 'menu-empty';

  return (
    <>
      <MenuListScreen variant={listVariant} onOpenDetail={actions.openDetail} />

      <FloatingCartBar
        visible={state.cart.length > 0 && !state.overlay}
        count={cartItemCount(state.cart)}
        total={cartTotal(state.cart)}
        onClick={actions.openCart}
      />

      {state.overlay && (
        <div className="mp-backdrop" onClick={actions.closeOverlay} />
      )}

      {state.overlay === 'detail' && state.selection && (
        <MenuDetailSheet
          selection={state.selection}
          onSetSize={actions.setSize}
          onToggleOption={actions.toggleOption}
          onInc={actions.incQty}
          onDec={actions.decQty}
          onClose={actions.closeOverlay}
          onAddToCart={actions.addToCart}
        />
      )}

      {state.overlay === 'cart' && (
        <CartSheet
          lines={state.cart}
          onUpdateQty={actions.updateLineQty}
          onRemove={actions.removeLine}
          onClose={actions.closeOverlay}
          onCheckout={actions.openModal}
        />
      )}

      {state.overlay === 'modal' && (
        <InAppModal
          lines={state.cart}
          onClose={actions.closeOverlay}
          onInstall={() => alert('앱 설치 페이지로 이동 (프로토타입)')}
        />
      )}
    </>
  );
}
