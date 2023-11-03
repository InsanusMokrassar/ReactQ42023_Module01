import React, { ReactNode, useEffect, useState } from 'react';
import './App.css';
import Search from './components/Search';
import SearchPanel from './components/SearchPanel';
import { defaultSearchHistoryWrapper } from './utils/SearchHistoryWrapper';
import { GithubRepository, DefaultGitHubAPI } from './utils/api/github_api';
import Results from './components/Result';
import ErrorBoundary from './ErrorBoundary';
import ErrorThrower from './ErrorThrower';
import ErrorLogger from './components/ErrorLogger';

export default function App({
  initialSearchState,
}: {
  initialSearchState: string;
}): ReactNode {
  const [isLoading, setIsLoading] = useState(true);
  const [searchState, setSearchState] = useState(initialSearchState);
  const [results, setResults] = useState<Array<GithubRepository>>([]);
  const [throwError, setThrowError] = useState<boolean>(false);

  function doSearch() {
    setIsLoading(true);
    defaultSearchHistoryWrapper.add(searchState);
    DefaultGitHubAPI.search(searchState).then((result) => {
      setResults(result);
      setIsLoading(false);
    });
  }

  const loadingInfoNode = isLoading ? <div>Loading</div> : <></>;

  const [requireSearch, setRequireSearch] = useState(true);
  useEffect((): void => {
    if (requireSearch) {
      setRequireSearch(false);
      doSearch();
    }
  }, [requireSearch, setRequireSearch, doSearch]);

  async function resetError(throwError: boolean) {
    requestAnimationFrame(() => setThrowError(throwError));
  }

  return (
    <ErrorBoundary
      fallback={() => {
        resetError(false);
        return ErrorLogger({});
      }}
    >
      <div className="main_container">
        <div className="main_content">
          <SearchPanel onSubmit={doSearch}>
            <Search state={searchState} onChange={setSearchState} />
          </SearchPanel>
          {loadingInfoNode}
          <Results state={results} />
          <ErrorThrower
            throwError={throwError}
            onSetErrorToThrow={resetError}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
