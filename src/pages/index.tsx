import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { GithubRepository } from '../models/GithubRepository';
import { DefaultGitHubAPI } from '../utils/api/GithubApi';
import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import ErrorLogger from '../components/ErrorLogger';
import SearchPanel from '../components/SearchPanel';
import Search from '../components/Search';
import Results from '../components/Result';
import GithubRepositoryLoader from '../components/GithubRepositoryLoader';
import ErrorThrower from '../ErrorThrower';
import Navigation from '../components/Navigation';
import { useRouter } from 'next/navigation';
import { GithubErrorResponse } from '../models/GithubErrorResponse';
import { GithubResponse } from '../models/GithubResponse';

export interface PageRequest extends ParsedUrlQuery {
  page?: string;
  count?: string;
  query?: string;
}

export type DetailsRequest = {
  username: string;
  repo: string;
};

export type DetailsResponse = {
  details: GithubRepository | null;
  error: GithubErrorResponse | null;
};

export type PageResponse = {
  page: number;
  count: number;
  query: string;
  response: GithubResponse<GithubRepository> | null;
  error: GithubErrorResponse | null;
  details?: {
    request: DetailsRequest;
    response?: DetailsResponse;
  };
};

export const getServerSideProps = (async (context) => {
  const queryAsParams = context.query as PageRequest;
  const page = parseInt(queryAsParams?.page || '0');
  const count = parseInt(queryAsParams?.count || '10');
  const resultPage = isNaN(page) ? 0 : page;
  const resultCount = isNaN(count) ? 10 : count;
  const resultQuery = queryAsParams?.query || 'react';
  const result = await DefaultGitHubAPI().search(
    resultQuery,
    resultPage,
    resultCount
  );
  const asError = result as GithubErrorResponse;
  const asResponse = result as GithubResponse<GithubRepository>;
  return {
    props: {
      page: resultPage,
      count: resultCount,
      query: resultQuery,
      response: asError.message ? null : asResponse,
      error: asError.message ? asError : null,
    },
  };
}) satisfies GetServerSideProps<PageResponse>;

function buildUrl(
  query: string,
  page: number,
  count: number,
  username?: string,
  repo?: string
): string {
  const prefix = username ? (repo ? `/${username}/${repo}` : '/') : '/';
  return `${prefix}?query=${encodeURIComponent(
    query
  )}&page=${encodeURIComponent(page)}&count=${encodeURIComponent(count)}`;
}

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps> & PageResponse
) {
  const { page, count, query, response, error } = props;
  const router = useRouter();
  const results = response == null ? undefined : response;
  const [currentSearchInput, setCurrentSearchInput] = useState(query);
  const [throwError, setThrowError] = useState<boolean>(false);
  const errorMessage = error?.message;
  const wholeCountOfItems = response?.total_count;
  const [responseIsLoading, setResponseIsLoading] = useState(false);
  const [username, setUsername] = useState(props.details?.request?.username);
  const [repo, setRepo] = useState(props.details?.request?.repo);
  const [showDetails, setShowDetails] = useState(
    username != null && repo != null
  );

  const loadingInfoNode = responseIsLoading ? <div>Loading</div> : <></>;
  const errorInfoNode = errorMessage ? (
    <label>
      GitHub error message: {'"'}
      {errorMessage}
      {'"'}
    </label>
  ) : (
    <></>
  );

  const responseIsLoadingKey = props.response;
  const [latestResponseIsLoadingKey, setLatestResponseIsLoadingKey] =
    useState(responseIsLoadingKey);
  useEffect(() => {
    if (latestResponseIsLoadingKey === responseIsLoadingKey) {
      return;
    }
    setResponseIsLoading(false);
    setLatestResponseIsLoadingKey(responseIsLoadingKey);
  }, [
    setResponseIsLoading,
    setLatestResponseIsLoadingKey,
    responseIsLoadingKey,
    latestResponseIsLoadingKey,
  ]);

  const onChangePageAndCount = (page: number, count: number): void => {
    setResponseIsLoading(true);
    router.push(buildUrl(query, page, count));
  };

  async function resetError(throwError: boolean) {
    requestAnimationFrame(() => setThrowError(throwError));
  }

  function setCurrentlyShownObject(repo: GithubRepository) {
    setUsername(repo.owner.login);
    setRepo(repo.name);
    setShowDetails(true);
    router.push(buildUrl(query, page, count, repo.owner.login, repo.name));
  }

  const details = props.details?.response?.details;
  const detailsError = props.details?.response?.error;

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
              setResponseIsLoading(true);
              router.push(buildUrl(currentSearchInput, page, count));
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
            {showDetails ? (
              <GithubRepositoryLoader
                username={username}
                repoName={repo}
                repo={details != null ? details : undefined}
                error={detailsError != null ? detailsError : undefined}
                unsetCurrentlyShownObject={() => {
                  setShowDetails(false);
                  router.push(buildUrl(query, page, count));
                }}
              />
            ) : (
              <></>
            )}
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
