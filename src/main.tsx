import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// ?lab in the address shows the kraken designs side by side instead of the site.
const Lab = lazy(() => import('./Lab'));
const lab = new URLSearchParams(location.search).has('lab');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {lab ? (
      <Suspense fallback={null}>
        <Lab />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
