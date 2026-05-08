#!/usr/bin/env python3
"""Refactor Figma-exported screen fragments into semantic HTML + extracted CSS.

Pipeline:
  1) Strip Figma debug attributes (data-om-id, etc.)
  2) Parse each element's inline style; drop properties whose value equals
     the browser baseline for that tag (captured via browser-harness in the
     same page context — so inheritance is accounted for).
  3) Detect semantic roles by text content (cart bar / menu card / etc.)
     and tag those nodes with role-* classes.
  4) Hash the remaining "essential" styles, dedupe → generate per-screen
     CSS classes (`.{screen}__el-XXXXXX`) and replace style attrs.
  5) Pretty-print the resulting HTML.

Output:
  dist/screens-clean/<key>.html   — pretty-printed, classes only
  dist/css/<key>.css              — extracted classes
"""

from __future__ import annotations

import json
import hashlib
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path("/Users/pp/Desktop/passorder-frontend/wireframe/메뉴판")
DIST = ROOT / "dist"
SCREENS_OUT = DIST / "screens"
CSS_OUT = DIST / "css"
BASELINE = json.loads(Path("/tmp/menupan_refactor/baseline.json").read_text())

# Map output key → source HTML file (full Figma export under the project root)
SOURCES = {
    "menu-empty":     ROOT / "메뉴판_빈상태.html",
    "menu-with-cart": ROOT / "메뉴판_메뉴담은상태.html",
    "menu-detail":    ROOT / "메뉴판_메뉴상세.html",
    "cart-sheet":     ROOT / "메뉴판_장바구니시트.html",
    "inapp-modal":    ROOT / "메뉴판_인앱전환모달.html",
}
SCREENS = list(SOURCES.keys())

# Attributes to strip wholesale (Figma debug noise)
STRIP_ATTRS_PREFIX = ("data-om-",)

# Properties we always want to keep, even if they look default (safety)
KEEP_ALWAYS = {
    # transform / position critical
    "transform", "position", "top", "left", "right", "bottom",
    "z-index", "display",
}

# Menu names used for semantic detection of menu cards
MENU_NAMES = [
    "♥100원 아메리카노♥", "모닝아메리카노", "모닝카페라떼",
    "아메리카노", "카페라떼", "카푸치노", "콜드브루",
    "생오렌지주스", "딸기 스무디", "자몽에이드",
    "캐모마일 티", "얼그레이",
    "크루아상", "당근 케이크",
]


def parse_style(s: str) -> dict[str, str]:
    """Parse a style attribute string into a property dict."""
    out: dict[str, str] = {}
    if not s:
        return out
    # split on ; that aren't inside parens (url(), rgb(), etc.)
    depth = 0
    buf = []
    parts: list[str] = []
    for ch in s:
        if ch == "(":
            depth += 1
            buf.append(ch)
        elif ch == ")":
            depth -= 1
            buf.append(ch)
        elif ch == ";" and depth == 0:
            parts.append("".join(buf))
            buf = []
        else:
            buf.append(ch)
    if buf:
        parts.append("".join(buf))
    for part in parts:
        if ":" not in part:
            continue
        k, _, v = part.partition(":")
        k = k.strip().lower()
        v = v.strip()
        if k:
            out[k] = v
    return out


def serialize_style(props: dict[str, str]) -> str:
    return "; ".join(f"{k}: {v}" for k, v in props.items())


def filter_defaults(tag: str, props: dict[str, str]) -> dict[str, str]:
    """Drop properties whose value matches the browser baseline for this tag."""
    base = BASELINE.get(tag) or BASELINE.get("div") or {}
    out: dict[str, str] = {}
    for k, v in props.items():
        if k in KEEP_ALWAYS:
            out[k] = v
            continue
        if k in base and base[k] == v:
            continue  # matches default → drop
        out[k] = v
    return out


def style_hash(props: dict[str, str]) -> str:
    if not props:
        return ""
    canonical = ";".join(f"{k}:{v}" for k, v in sorted(props.items()))
    return hashlib.sha1(canonical.encode("utf-8")).hexdigest()[:8]


# ---------------------------------------------------------------------------
# Semantic role detection
# ---------------------------------------------------------------------------

def text_of(el) -> str:
    return (el.get_text() or "").strip()


def all_text_contains(el, fragments) -> bool:
    t = text_of(el)
    return all(f in t for f in fragments)


def find_smallest(soup, predicate):
    """Find the smallest (deepest) element satisfying the predicate."""
    candidates = [el for el in soup.find_all() if predicate(el)]
    if not candidates:
        return None
    candidates.sort(key=lambda el: len(text_of(el)))
    return candidates[0]


def detect_roles(soup, screen_key: str) -> dict:
    """Return dict mapping role name → element. Each role applied as class."""
    roles: dict[str, list] = {}

    def add(role, el):
        if el is not None:
            roles.setdefault(role, []).append(el)

    # Cart bar (담은 상태에서)
    cart_bar = find_smallest(
        soup,
        lambda el: all_text_contains(el, ["담은 메뉴", "합계", "주문하기"])
        and len(text_of(el)) < 200,
    )
    add("cart-bar", cart_bar)

    # Menu detail bottom sheet
    detail_sheet = find_smallest(
        soup,
        lambda el: all_text_contains(el, ["사이즈", "추가 옵션", "장바구니 담기"])
        and len(text_of(el)) < 1500,
    )
    add("detail-sheet", detail_sheet)

    # Cart sheet (장바구니 시트)
    cart_sheet = find_smallest(
        soup,
        lambda el: all_text_contains(el, ["장바구니", "합계", "주문하기"])
        and "사이즈" not in text_of(el)
        and 30 < len(text_of(el)) < 800,
    )
    add("cart-sheet-panel", cart_sheet)

    # In-app modal
    inapp_modal = find_smallest(
        soup,
        lambda el: "앱에서 바로 결제" in text_of(el) and len(text_of(el)) < 800,
    )
    add("inapp-modal-panel", inapp_modal)

    # Status bar
    status_bar = find_smallest(
        soup,
        lambda el: text_of(el) == "9:41",
    )
    add("status-bar-time", status_bar)

    # Restaurant header
    header = find_smallest(
        soup,
        lambda el: all_text_contains(el, ["에슬로우커피 라운지점", "영업중", "4.8"])
        and len(text_of(el)) < 80,
    )
    add("shop-header", header)

    # Category tabs (전체 / 선착순 한정 이벤트 / COFFEE / FRESH JUICE / HEAL TEA / DESSERT)
    tabs = find_smallest(
        soup,
        lambda el: all_text_contains(el, ["전체", "COFFEE", "FRESH JUICE"])
        and len(text_of(el)) < 200,
    )
    add("category-tabs", tabs)

    # Menu cards: one per menu name, smallest containing the name + a price
    for name in MENU_NAMES:
        card = find_smallest(
            soup,
            lambda el, n=name: n in text_of(el)
            and re.search(r"\d[\d,]*원", text_of(el)) is not None
            and len(text_of(el)) < 200,
        )
        add("menu-card", card)

    # Sold-out badge
    sold_out = find_smallest(
        soup,
        lambda el: text_of(el) == "품절",
    )
    add("sold-out", sold_out)

    # Cart bottom CTA "장바구니 담기" inside detail
    detail_cta = find_smallest(
        soup,
        lambda el: "장바구니 담기" in text_of(el)
        and "사이즈" not in text_of(el)
        and len(text_of(el)) < 80,
    )
    add("detail-cta", detail_cta)

    # Modal close (닫기)
    if screen_key == "inapp-modal":
        close_btn = find_smallest(
            soup,
            lambda el: text_of(el) == "닫기",
        )
        add("modal-close", close_btn)
        install_btn = find_smallest(
            soup,
            lambda el: "앱 설치하고 결제" in text_of(el) and len(text_of(el)) < 30,
        )
        add("modal-install", install_btn)

    return roles


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def process_screen(key: str) -> tuple[int, int, int, int]:
    full = SOURCES[key].read_text()
    src_size = len(full)
    # Slice out the <body> innerHTML so we can drop the duplicated head
    # (3.7MB of base64 fonts, already promoted to assets/fonts.css).
    bs = full.find("<body")
    bso = full.find(">", bs) + 1
    be = full.find("</body>")
    src = full[bso:be]
    soup = BeautifulSoup(src, "lxml")

    # 1) Strip Figma debug attributes
    for el in soup.find_all(True):
        for attr in list(el.attrs.keys()):
            if any(attr.startswith(p) for p in STRIP_ATTRS_PREFIX):
                del el.attrs[attr]

    # 2) Detect semantic roles before mutation (uses textual signals)
    roles = detect_roles(soup, key)
    role_classes_for: dict = {}
    for role, els in roles.items():
        for el in els:
            role_classes_for.setdefault(id(el), []).append(f"role-{role}")

    # 3) Filter inline style props against baseline
    style_to_class: dict[str, str] = {}
    class_decls: dict[str, dict[str, str]] = {}

    for el in soup.find_all(True):
        style = el.attrs.get("style")
        classes: list[str] = []
        # apply role classes
        for c in role_classes_for.get(id(el), []):
            classes.append(c)
        if style:
            tag = el.name.lower()
            props = parse_style(style)
            essential = filter_defaults(tag, props)
            if essential:
                h = style_hash(essential)
                cname = f"{key.replace('-', '_')}__el-{h}"
                if cname not in class_decls:
                    class_decls[cname] = essential
                classes.append(cname)
            del el.attrs["style"]
        if classes:
            existing = el.attrs.get("class") or []
            if isinstance(existing, str):
                existing = existing.split()
            el.attrs["class"] = existing + classes

    # 4) Emit CSS
    css_lines = [f"/* {key} — auto-extracted from Figma export */", ""]
    # Sort classes by name for stability
    for cname in sorted(class_decls.keys()):
        props = class_decls[cname]
        css_lines.append(f".{cname} {{")
        for k, v in sorted(props.items()):
            css_lines.append(f"  {k}: {v};")
        css_lines.append("}")
    css = "\n".join(css_lines) + "\n"
    (CSS_OUT / f"{key}.css").write_text(css)

    # 5) Serialize HTML.
    # We can't use BS4.prettify() because it inserts whitespace between
    # adjacent inline elements which leaks into rendered text (e.g., "(192)"
    # becomes "( 192 )"). Instead, format only block-level boundaries by
    # adding newlines after closing tags of structural divs that contain
    # only block children — leaves any element with mixed/text content
    # untouched.
    html_out = "".join(str(c) for c in soup.contents)
    html_out = _format_safely(html_out)
    (SCREENS_OUT / f"{key}.html").write_text(html_out)

    return (
        src_size,
        len(html_out),
        len(css),
        len(class_decls),
    )


def _format_safely(html: str) -> str:
    """Add indentation only around block-level boundaries that don't risk
    altering rendered text. Whitespace is only injected at points where the
    *parent* element does not directly contain text and is not an inline tag
    (otherwise the rendered text content gets extra spaces).
    """
    # HTML inline elements — never insert whitespace inside these.
    INLINE_TAGS = {
        "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data",
        "dfn", "em", "i", "kbd", "mark", "q", "rp", "rt", "rtc", "ruby",
        "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u",
        "var", "wbr", "label", "button",
    }

    root = BeautifulSoup(html, "lxml")
    body = root.body or root

    out: list[str] = []

    def walk(el, indent: int):
        # text node
        if el.name is None:
            t = str(el)
            # collapse pure-whitespace text nodes that BS introduced from prettifying
            if t.strip() == "":
                return
            out.append(t)
            return
        # element node
        children = list(el.children)
        has_direct_text = any(c.name is None and str(c).strip() != "" for c in children)
        is_inline = el.name in INLINE_TAGS
        only_blocks = (
            not has_direct_text
            and not is_inline
            and len(children) > 0
            and all(c.name is not None for c in children if str(c).strip() != "")
        )

        attrs = ""
        for k, v in el.attrs.items():
            if isinstance(v, list):
                v = " ".join(v)
            attrs += f' {k}="{v}"'
        open_tag = f"<{el.name}{attrs}>"
        close_tag = f"</{el.name}>"

        # void elements
        VOID = {"img", "br", "hr", "input", "meta", "link", "rect", "circle",
                "path", "line", "polygon", "polyline", "ellipse", "use"}
        if el.name in VOID and not children:
            out.append("  " * indent + open_tag.replace(">", " />") + "\n")
            return

        if only_blocks:
            out.append("  " * indent + open_tag + "\n")
            for c in children:
                walk(c, indent + 1)
            out.append("  " * indent + close_tag + "\n")
        else:
            # Inline: keep on one line, no whitespace inserts
            out.append("  " * indent + open_tag)
            for c in children:
                if c.name is None:
                    out.append(str(c))
                else:
                    out.append(_inline(c))
            out.append(close_tag + "\n")

    def _inline(el) -> str:
        if el.name is None:
            return str(el)
        attrs = ""
        for k, v in el.attrs.items():
            if isinstance(v, list):
                v = " ".join(v)
            attrs += f' {k}="{v}"'
        VOID = {"img", "br", "hr", "input", "meta", "link", "rect", "circle",
                "path", "line", "polygon", "polyline", "ellipse", "use"}
        if el.name in VOID and not list(el.children):
            return f"<{el.name}{attrs} />"
        inner = "".join(_inline(c) if c.name else str(c) for c in el.children)
        return f"<{el.name}{attrs}>{inner}</{el.name}>"

    for c in body.contents:
        walk(c, 0)
    return "".join(out)


def main():
    SCREENS_OUT.mkdir(parents=True, exist_ok=True)
    CSS_OUT.mkdir(parents=True, exist_ok=True)
    print(f"{'screen':<20} {'orig':>10} {'html':>10} {'css':>10} {'classes':>8}")
    print("-" * 64)
    totals = [0, 0, 0, 0]
    for key in SCREENS:
        src_size, html_size, css_size, n_classes = process_screen(key)
        totals[0] += src_size
        totals[1] += html_size
        totals[2] += css_size
        totals[3] += n_classes
        print(f"{key:<20} {src_size:>10,} {html_size:>10,} {css_size:>10,} {n_classes:>8}")
    print("-" * 64)
    print(f"{'TOTAL':<20} {totals[0]:>10,} {totals[1]:>10,} {totals[2]:>10,} {totals[3]:>8}")
    saved = totals[0] - (totals[1] + totals[2])
    print(f"saved bytes: {saved:,} ({saved/totals[0]*100:.1f}%)")


if __name__ == "__main__":
    main()
