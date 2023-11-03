import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { defaultSearchHistoryWrapper } from './utils/SearchHistoryWrapper';

function getInitialSearchState(): string {
  const history = defaultSearchHistoryWrapper.getHistory();

  if (history.length > 0) {
    return history[history.length - 1];
  }

  return '';
}

const initialSearchState = getInitialSearchState();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App initialSearchState={initialSearchState} />
  </React.StrictMode>
);
