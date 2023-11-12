import { GithubRepository, GithubResponse } from './utils/api/GithubApi';
import { createContext } from 'react';
import { defaultSearchHistoryWrapper } from './utils/SearchHistoryWrapper';

export function getInitialSearchState(): string {
  return defaultSearchHistoryWrapper().getSearch();
}

export type AppContextType = {
  search: string;
  results?: GithubResponse<GithubRepository>;
  setSearch: (newSearch: string) => void;
  setResults: (newResults?: GithubResponse<GithubRepository>) => void;
};

export const AppContext: React.Context<AppContextType> =
  createContext<AppContextType>({
    search: getInitialSearchState(),
    setSearch: () => {},
    setResults: () => {},
  });
