import {StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// The markup is prerendered at build time (scripts/prerender.mjs), so the
// client hydrates the existing tree rather than creating it (spec S1.2).
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
);
