import React, { ReactNode, useEffect, useState } from 'react';
import './App.css';
import Search from './components/Search';
import SearchPanel from './components/SearchPanel';
import {
  GithubRepository,
  GithubErrorResponse,
  GithubResponse,
} from './models/GithubApi';
import Results from './components/Result';
import ErrorBoundary from './ErrorBoundary';
import ErrorThrower from './ErrorThrower';
import ErrorLogger from './components/ErrorLogger';
import Navigation from './components/Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setItemsPerPage, setSearch } from './redux/SearchSlice';

import { LoadersSliceStateSlice, SearchSliceStateSlice } from './redux/Store';
import { setDetailedInfo } from './redux/DetailedInfoSlice';
import GithubRepositoryLoader from './components/GithubRepositoryLoader';
import { useSearchQuery } from './redux/GithubApi';
import { setLoading } from './redux/LoadersSlice';

export default function App({
  page,
  onSetPageAndCount,
}: {
  page: number;
  onSetPageAndCount: (page: number) => void;
}): ReactNode {
  const search = useSelector((state: SearchSliceStateSlice) => {
    return state.search.search;
  });
  const count = useSelector((state: SearchSliceStateSlice) => {
    return state.search.itemsPerPage;
  });
  const dispatcher = useDispatch();
  const isLoading = useSelector(
    (state: LoadersSliceStateSlice) => state.loaders.itemsLoading
  );
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

  const searchResult = useSearchQuery({
    query: search,
    page,
    count,
  });

  useEffect(() => {
    const isLoading = searchResult.isLoading || searchResult.isFetching;
    dispatcher(setLoading({ itemsLoading: isLoading }));
    if (isLoading || searchResult.data === undefined) {
      return;
    }
    const result:
      | GithubResponse<GithubRepository>
      | GithubErrorResponse
      | undefined = searchResult.data;
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
  }, [dispatcher, isLoading, searchResult]);

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

  const [latestSearchParams, setLatestSearchParams] = useState('');
  const actualSearchParams = `${search}?page=${page}&count=${count}`;
  useEffect((): void => {
    if (latestSearchParams != actualSearchParams) {
      setLatestSearchParams(actualSearchParams);
    }
  }, [actualSearchParams, latestSearchParams, setLatestSearchParams]);

  const onChangePageAndCount = (page: number, count: number): void => {
    onSetPageAndCount(page);
    dispatcher(setItemsPerPage({ count: count }));
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
