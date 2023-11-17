import React, { ReactNode, useEffect, useState } from 'react';
import './App.css';
import Search from './components/Search';
import SearchPanel from './components/SearchPanel';
import { defaultSearchHistoryWrapper } from './utils/SearchHistoryWrapper';
import {
  GithubRepository,
  DefaultGitHubAPI,
  GithubErrorResponse,
  GithubResponse,
} from './utils/api/GithubApi';
import Results from './components/Result';
import ErrorBoundary from './ErrorBoundary';
import ErrorThrower from './ErrorThrower';
import ErrorLogger from './components/ErrorLogger';
import Navigation from './components/Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch } from './redux/SearchSlice';

import { SearchSliceStateSlice } from './redux/Store';
import { setDetailedInfo } from './redux/DetailedInfoSlice';
import GithubRepositoryLoader from './components/GithubRepositoryLoader';

export default function App({
  page,
  count,
  onSetPageAndCount,
}: {
  page: number;
  count: number;
  onSetPageAndCount: (page: number, count: number) => void;
}): ReactNode {
  const search = useSelector((state: SearchSliceStateSlice) => {
    return state.search.search;
  });
  const dispatcher = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<
    undefined | GithubResponse<GithubRepository>
  >();
  const [currentSearchInput, setCurrentSearchInput] = useState(search);
  const [throwError, setThrowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [wholeCountOfItems, setWholeCountOfItems] = useState<
    number | undefined
  >(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function doSearch() {
    setIsLoading(true);
    defaultSearchHistoryWrapper().setSearch(currentSearchInput);
    DefaultGitHubAPI()
      .search(currentSearchInput, page, count)
      .then((result) => {
        const asError = result as GithubErrorResponse;
        const asResult = result as GithubResponse<GithubRepository>;
        switch (true) {
          case asError.message != null:
            setResults(undefined);
            setErrorMessage(asError.message);
            break;
          default:
            setErrorMessage(undefined);
            setResults(asResult);
            setWholeCountOfItems(asResult.total_count);
            break;
        }
        setIsLoading(false);
      });
  }

  const loadingInfoNode = isLoading ? <div>Loading</div> : <></>;
  const errorInfoNode = errorMessage ? (
    <label>
      GitHub error message: {'"'}
      {errorMessage}
      {'"'}
    </label>
  ) : (
    <></>
  );

  const [requireSearch, setRequireSearch] = useState(true);
  useEffect((): void => {
    if (requireSearch) {
      setRequireSearch(false);
      doSearch();
    }
  }, [requireSearch, setRequireSearch, doSearch]);

  const onChangePageAndCount = (page: number, count: number): void => {
    setRequireSearch(true);
    onSetPageAndCount(page, count);
  };

  async function resetError(throwError: boolean) {
    requestAnimationFrame(() => setThrowError(throwError));
  }

  function setCurrentlyShownObject(repo: GithubRepository) {
    dispatcher(
      setDetailedInfo({ username: repo.owner.login, repo: repo.name })
    );
    // navigate({
    //   pathname: `/github/${repo.owner.login}/${repo.name}`,
    //   search: location.search,
    // });
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
          <SearchPanel
            onSubmit={() => {
              dispatcher(setSearch({ text: currentSearchInput }));
              doSearch();
            }}
          >
            <Search
              state={currentSearchInput}
              onChange={setCurrentSearchInput}
            />
          </SearchPanel>
          {errorInfoNode}
          {loadingInfoNode}
          <div className={'main_content-results'}>
            <Results
              results={results}
              onItemClicked={setCurrentlyShownObject}
            />
            <GithubRepositoryLoader />
          </div>
          <ErrorThrower
            throwError={throwError}
            onSetErrorToThrow={resetError}
          />
          <Navigation
            page={page}
            count={count}
            wholeObjectsAmount={wholeCountOfItems}
            onSetPage={onChangePageAndCount}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
