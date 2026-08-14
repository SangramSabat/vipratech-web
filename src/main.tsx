import {StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import {HOME_ROUTE, routeFor} from './routes.ts';
import './index.css';

// Every route is prerendered to its own document (scripts/prerender.mjs), so
// the client hydrates the existing tree rather than creating it (spec S1.2).
// The route is derived from the URL the browser actually loaded — there is no
// client-side router; links navigate normally.
const route = routeFor(window.location.pathname) ?? HOME_ROUTE;

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App route={route} />
  </StrictMode>,
);
