import React from 'react';
import ReactDOM from 'react-dom/client';
// Order matters: tailwind first (preflight is disabled in tailwind.config),
// then design tokens, then ui-kit. Page-level CSS is imported per route.
import './styles/tailwind.css';
import './styles/tokens.css';
import './styles/ui-kit.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
