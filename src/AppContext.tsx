import { GithubRepository, GithubResponse } from './utils/api/GithubApi';
import { createContext } from 'react';
import { defaultSearchHistoryWrapper } from './utils/SearchHistoryWrapper';

function getInitialSearchState(): string {
  const history = defaultSearchHistoryWrapper.getHistory();

  if (history.length > 0) {
    return history[history.length - 1];
  }

  return '';
}

export const initialSearchState = getInitialSearchState();

export type AppContextType = {
  search: string;
  results?: GithubResponse<GithubRepository>;
  setSearch: (newSearch: string) => void;
  setResults: (newResults?: GithubResponse<GithubRepository>) => void;
};

export const AppContext: React.Context<AppContextType> =
  createContext<AppContextType>({
    search: initialSearchState,
    setSearch: () => {},
    setResults: () => {},
  });
