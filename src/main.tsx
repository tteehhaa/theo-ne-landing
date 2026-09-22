import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App.tsx';
import './index.css';
import { createI18n, langFromPath } from './i18n';
import { initAnalytics } from './lib/analytics';

const container = document.getElementById('root')!;

const app = (
  <StrictMode>
    <I18nextProvider i18n={createI18n(langFromPath(window.location.pathname))}>
      <App />
    </I18nextProvider>
  </StrictMode>
);

// Prerendered pages carry real markup and are hydrated; `vite dev` serves an
// empty root, which must be rendered from scratch instead.
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

// 렌더가 끝난 뒤에 붙습니다. 섹션 엘리먼트가 아직 없으면 체류 시간을 관측할
// 대상을 찾지 못하기 때문입니다.
requestAnimationFrame(() => initAnalytics());
