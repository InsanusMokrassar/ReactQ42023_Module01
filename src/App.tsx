import React, { ReactNode, useContext, useEffect, useState } from 'react';
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
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppContext, AppContextType } from './AppContext';

export default function App({
  page,
  count,
  onSetPageAndCount,
}: {
  page: number;
  count: number;
  onSetPageAndCount: (page: number, count: number) => void;
}): ReactNode {
  const [isLoading, setIsLoading] = useState(true);
  const { search, setSearch, setResults } =
    useContext<AppContextType>(AppContext);
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
    defaultSearchHistoryWrapper.add(search);
    DefaultGitHubAPI.search(search, page, count).then((result) => {
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

  const navigate = useNavigate();
  const location = useLocation();

  function setCurrentlyShownObject(repo: GithubRepository) {
    navigate({
      pathname: `/github/${repo.owner.login}/${repo.name}`,
      search: location.search,
    });
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
            <Search state={search} onChange={setSearch} />
          </SearchPanel>
          {errorInfoNode}
          {loadingInfoNode}
          <div className={'main_content-results'}>
            <Results onItemClicked={setCurrentlyShownObject} />
            <Outlet />
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
