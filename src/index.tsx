import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RecoilRoot } from 'recoil';
import GlobalStyle from './GlobalStyle';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <RecoilRoot>
    <React.Suspense fallback={<div>Loading...</div>}>
      <GlobalStyle />
      <App />
    </React.Suspense>
  </RecoilRoot>,
);
