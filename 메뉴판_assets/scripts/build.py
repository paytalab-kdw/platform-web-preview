#!/usr/bin/env python3
"""Build 메뉴판.html (at wireframe root) from cleaned screen fragments + per-screen CSS."""

from pathlib import Path

ROOT = Path("/Users/pp/Desktop/passorder-frontend/wireframe")
ASSETS = ROOT / "메뉴판_assets"
PREFIX = "메뉴판_assets"

SCREENS = [
    "menu-empty",
    "menu-with-cart",
    "menu-detail",
    "cart-sheet",
    "inapp-modal",
]


# Bottom sheets / modal are moved by JS into a body-level fixed overlay so
# they always anchor to the actual viewport (independent of the scaled
# .screen frame above). The overlay scales with the same --scale factor
# used by the main frame so visuals match.
INLINE_OVERRIDES = """\
<style>
  /* ---- Body-level overlay for bottom sheet / modal ---- */
  #mp-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: none;
  }
  #mp-overlay.active { display: block; }

  #mp-overlay .mp-overlay-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    animation: mp-fade-in 0.2s ease;
  }

  /* Stage spans the viewport. We don't scale it: the panel inside is
     intentionally rendered at its natural ~414px phone width, regardless
     of how wide the underlying frame has been scaled to fill the page. */
  #mp-overlay .mp-overlay-stage {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  /* Sheet: pinned to the viewport's bottom edge, full viewport width. */
  #mp-overlay .mp-sheet {
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    top: auto !important;
    transform: none !important;
    width: 100vw !important;
    max-width: 100vw !important;
    max-height: 92vh !important;
    height: auto !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    pointer-events: auto;
    animation: mp-sheet-up 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: #fff;
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.12);
  }

  /* Modal: centered both axes. */
  #mp-overlay .mp-modal {
    position: absolute !important;
    left: 50% !important;
    right: auto !important;
    top: 50% !important;
    bottom: auto !important;
    transform: translate(-50%, -50%) !important;
    width: min(382px, calc(100vw - 32px)) !important;
    max-height: 90vh !important;
    height: auto !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    pointer-events: auto;
    border-radius: 20px;
    background: #fff;
    animation: mp-modal-pop 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  }

  /* Internal layout: scrollable body, pinned CTA. */
  #mp-overlay .mp-sheet .mp-sheet-body,
  #mp-overlay .mp-modal .mp-modal-body {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    height: auto !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch;
  }
  #mp-overlay .mp-sheet .mp-sheet-cta,
  #mp-overlay .mp-modal .mp-modal-cta {
    flex: 0 0 auto !important;
    height: auto !important;
    background: #fff;
  }
  #mp-overlay .mp-sheet .mp-sheet-handle-row,
  #mp-overlay .mp-sheet .mp-sheet-top {
    flex: 0 0 auto !important;
  }

  /* Figma export bakes hardcoded 414/382px widths onto the sheet's inner
     pieces (body, cta, image, meta, sections, options, rows, primary
     button). Stretch them all to fill the now-100vw panel so the bottom
     sheet truly spans the full screen width on mobile. */
  #mp-overlay .mp-sheet > .mp-sheet-handle-row,
  #mp-overlay .mp-sheet > .mp-sheet-top,
  #mp-overlay .mp-sheet > .mp-sheet-body,
  #mp-overlay .mp-sheet > .mp-sheet-cta,
  #mp-overlay .mp-sheet .mp-dlg-img,
  #mp-overlay .mp-sheet .mp-dlg-meta,
  #mp-overlay .mp-sheet .mp-dlg-section,
  #mp-overlay .mp-sheet .mp-dlg-section-head,
  #mp-overlay .mp-sheet .mp-dlg-price-row,
  #mp-overlay .mp-sheet .mp-opt,
  #mp-overlay .mp-sheet .mp-qty,
  #mp-overlay .mp-sheet .mp-sheet-cta .mp-cta-primary,
  #mp-overlay .mp-sheet .mp-cart-total,
  #mp-overlay .mp-sheet .mp-cart-line {
    width: 100% !important;
    max-width: 100% !important;
    inline-size: 100% !important;
    box-sizing: border-box !important;
  }
  /* Figma also adds anonymous wrapper divs (menu_detail__el-XXX) between
     a section and its options/rows, each pinned at 382px. Force every
     direct child of meta/section/body to span 100%. */
  #mp-overlay .mp-sheet .mp-dlg-meta > *,
  #mp-overlay .mp-sheet .mp-dlg-section > *,
  #mp-overlay .mp-sheet .mp-sheet-body > * {
    width: 100% !important;
    max-width: 100% !important;
    inline-size: 100% !important;
    box-sizing: border-box !important;
  }
  /* Re-allow auto width for the qty stepper so it stays compact and
     centers itself, instead of stretching across the row. */
  #mp-overlay .mp-sheet .mp-qty {
    width: auto !important;
    inline-size: auto !important;
    margin: 0 auto !important;
  }

  /* ---- Option checked-state override ----
     The Figma export bakes checked vs unchecked variants into per-element
     classes (menu_detail__el-052c3e8d vs ...el-54b63475). JS toggles a
     plain `.checked` class which has no styling on its own, so we apply
     it here so any option (round radio or square checkbox) shows the
     active state regardless of which Figma variant it started from. */
  .mp-opt:not(.checked) .mp-opt-marker {
    background: #FFFFFF !important;
    border-color: #D2D2D2 !important;
  }
  .mp-opt:not(.checked) .mp-opt-marker .dot {
    background: transparent !important;
  }
  .mp-opt.checked .mp-opt-marker {
    background: #FF7949 !important;
    border-color: #FF7949 !important;
  }
  .mp-opt.checked .mp-opt-marker .dot {
    background: #FFFFFF !important;
  }

  /* ───────────────────────────────────────────────────────────────
     Menu list visual overhaul to match the Figma design
     (file MVY8Xm2sVjRcwaq6ugTX1D, node 13751:42533)
     ─────────────────────────────────────────────────────────────── */

  /* Header: store name centered, drop the rating cluster (already hidden
     globally via app.css) and shrink/relax the back button area. */
  .mp-summary {
    justify-content: center !important;
    padding: 12px 16px !important;
    border-bottom: 1px solid #EDEDED !important;
  }
  .mp-summary-back {
    position: absolute !important;
    left: 8px !important;
  }
  .mp-summary-mid {
    text-align: center !important;
  }
  .mp-summary-name {
    font-size: 16px !important;
    font-weight: 800 !important;
    color: #000 !important;
  }
  .mp-summary-status { display: none !important; }

  /* Category tabs: black pill for the selected one, plain text for the
     rest. Hide the per-category count chips. */
  .mp-catnav {
    border-bottom: 1px solid #EDEDED !important;
    padding: 8px 12px !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: none !important;
  }
  .mp-catnav::-webkit-scrollbar { display: none !important; }
  .mp-catnav-track {
    gap: 8px !important;
    flex-wrap: nowrap !important;
    width: max-content !important;
  }
  .mp-cat { white-space: nowrap !important; }
  .mp-cat {
    border: 0 !important;
    background: transparent !important;
    color: #7D7D7D !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    padding: 8px 14px !important;
    border-radius: 999px !important;
  }
  .mp-cat.active {
    background: #000 !important;
    color: #fff !important;
  }
  .mp-cat .count { display: none !important; }

  /* Hide section headers — Figma shows items directly under the tabs */
  .mp-cat-head { display: none !important; }
  /* Figma export bakes a fixed pixel height onto each .mp-cat-section that
     leaves big gaps when the section content is shorter than designed.
     Force auto height + flat padding so sections butt up against each
     other with only the per-item bottom border as a divider. */
  .mp-cat-section {
    height: auto !important;
    block-size: auto !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  /* Menu item card: tighter, divider between rows, smaller square thumb */
  .mp-item {
    padding: 14px 16px !important;
    border-bottom: 1px solid #F4F4F4 !important;
    align-items: flex-start !important;
    gap: 12px !important;
  }
  .mp-item-body { gap: 4px !important; }
  .mp-item-name {
    font-size: 15px !important;
    font-weight: 800 !important;
    color: #000 !important;
  }
  .mp-item-prices {
    display: flex !important;
    align-items: baseline !important;
    gap: 6px !important;
    margin-top: 2px !important;
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
  }
  .mp-item-price {
    font-size: 15px !important;
    font-weight: 800 !important;
    color: #000 !important;
    -webkit-text-fill-color: #000 !important;
  }
  .mp-item-price-old {
    font-size: 13px !important;
    color: #AAAAAA !important;
    -webkit-text-fill-color: #AAAAAA !important;
    text-decoration: line-through !important;
  }
  .mp-item-desc {
    font-size: 12px !important;
    color: #7D7D7D !important;
    line-height: 1.4 !important;
    margin-top: 2px !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
  }
  .mp-item-stock,
  .mp-item-stock * {
    font-size: 11px !important;
    color: #AAAAAA !important;
    -webkit-text-fill-color: #AAAAAA !important;
  }
  .mp-item-stock { margin-top: 4px !important; }
  .mp-item-thumb {
    flex: 0 0 auto !important;
    width: 80px !important;
    height: 80px !important;
    border-radius: 10px !important;
    overflow: hidden !important;
    position: relative !important;
  }
  .mp-item-thumb-emoji {
    font-size: 36px !important;
  }
  /* Featured "100원" badge on the event item's thumbnail */
  .mp-item-thumb-tag {
    position: absolute !important;
    top: 4px !important;
    right: 4px !important;
    background: #FF7949 !important;
    color: #fff !important;
    font-size: 10px !important;
    font-weight: 800 !important;
    padding: 3px 6px !important;
    border-radius: 999px !important;
    line-height: 1 !important;
  }

  /* Detail sheet image — Figma export gives it a huge height that pushes
     the 수량 section past the visible body area. Cap it. */
  #mp-overlay .mp-sheet.role-detail-sheet .mp-dlg-img {
    height: 160px !important;
    block-size: 160px !important;
    min-height: 0 !important;
    flex: 0 0 160px !important;
    border-radius: 0 !important;
  }
  #mp-overlay .mp-sheet.role-detail-sheet .mp-dlg-img-emoji {
    font-size: 56px !important;
  }

  /* Handle row (the grey bar + X close at the top of every sheet). The
     Figma export pins the X to left:374px which is wrong once the panel
     spans 100vw. Re-center the handle, anchor X to the right edge, and
     give the row enough height to contain both. */
  #mp-overlay .mp-sheet .mp-sheet-handle-row {
    height: auto !important;
    block-size: auto !important;
    min-height: 32px !important;
    padding: 12px 16px 8px !important;
    position: relative !important;
    align-items: center !important;
    justify-content: center !important;
  }
  #mp-overlay .mp-sheet .mp-sheet-handle {
    align-self: center !important;
    width: 40px !important;
    height: 4px !important;
    border-radius: 2px !important;
  }
  #mp-overlay .mp-sheet .mp-sheet-close {
    position: absolute !important;
    top: 8px !important;
    right: 8px !important;
    left: auto !important;
    bottom: auto !important;
    inset-inline-start: auto !important;
  }

  /* Body, meta and sections were laid out for a 414px wide panel with
     implicit insets. Now that inner widths are 100%, we re-introduce
     consistent horizontal padding so content doesn't touch the edges. */
  #mp-overlay .mp-sheet .mp-dlg-meta,
  #mp-overlay .mp-sheet .mp-dlg-section {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  #mp-overlay .mp-sheet.role-cart-sheet-panel .mp-cart-line,
  #mp-overlay .mp-sheet.role-cart-sheet-panel .mp-cart-total {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  #mp-overlay .mp-sheet.role-cart-sheet-panel .mp-sheet-top {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  /* Sold-out overlay: lighten and center the label */
  .mp-item.disabled .mp-item-name,
  .mp-item.disabled .mp-item-price,
  .mp-item.disabled .mp-item-desc {
    color: #AAAAAA !important;
  }
  .mp-item-thumb-soldout {
    position: absolute !important;
    inset: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: rgba(255,255,255,0.7) !important;
    color: #7D7D7D !important;
    font-size: 12px !important;
    font-weight: 800 !important;
  }

  /* ---- Bottom padding so content scrolls past the floating cart bar ----
     The bar is fixed at viewport bottom (height ~80px × --scale). Without
     trailing space, the last menu item is covered when the user scrolls
     to the end of the list. */
  .screen[data-screen="menu-empty"] .mp-list,
  .screen[data-screen="menu-with-cart"] .mp-list {
    padding-bottom: 96px !important;
  }

  /* Hide each overlay screen's underlying page copy + duplicate backdrop —
     we only want the overlay's own backdrop and the panel that was moved
     into it. */
  .screen[data-screen="menu-detail"],
  .screen[data-screen="cart-sheet"],
  .screen[data-screen="inapp-modal"] {
    display: none !important;
  }
  /* ...but the original .mp-backdrop inside those screens is irrelevant
     once the panel has been moved out. */

  @keyframes mp-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes mp-sheet-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes mp-modal-pop {
    from { opacity: 0; transform: translate(-50%, -45%) scale(0.96); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
</style>"""


def main():
    parts: list[str] = []
    parts.append("<!doctype html>")
    parts.append('<html lang="ko"><head>')
    parts.append('<meta charset="utf-8">')
    parts.append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">')
    parts.append("<title>메뉴판 — 통합 프로토타입</title>")
    parts.append(f'<link rel="stylesheet" href="{PREFIX}/assets/fonts.css">')
    parts.append(f'<link rel="stylesheet" href="{PREFIX}/assets/app.css">')
    for key in SCREENS:
        parts.append(f'<link rel="stylesheet" href="{PREFIX}/css/{key}.css">')
    parts.append(INLINE_OVERRIDES)
    parts.append("</head><body>")
    parts.append('<div class="stage">')
    for key in SCREENS:
        frag = (ASSETS / "screens" / f"{key}.html").read_text()
        parts.append(f'<div class="screen" data-screen="{key}">')
        parts.append(frag)
        parts.append("</div>")
    parts.append("</div>")
    parts.append(f'<script src="{PREFIX}/assets/app.js"></script>')
    parts.append("</body></html>")
    out = "\n".join(parts)
    (ROOT / "메뉴판.html").write_text(out)
    print(f"메뉴판.html: {len(out):,} bytes")


if __name__ == "__main__":
    main()
