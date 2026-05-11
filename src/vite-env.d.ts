/// <reference types="vite/client" />

declare module '*.html?raw' {
  const content: string;
  export default content;
}

declare module './menuApp.js' {
  export function initMenu(): (() => void) | void;
}
