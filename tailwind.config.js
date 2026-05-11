/** @type {import('tailwindcss').Config} */
// preflight is disabled because the existing tokens.css/ui-kit.css already
// define their own resets — Tailwind preflight would clobber the
// pixel-perfect Figma-derived styles in store/menu/magazine pages.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  corePlugins: { preflight: false },
  plugins: [],
};
