import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import {
  GithubErrorResponse,
  GithubRepository,
  GithubResponse,
} from '../models/GithubApi';
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
  const [isLoading, setIsLoading] = useState(false);

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

  const currentIsLoadingKey = props;
  const [latestKey, setLatestKey] = useState(currentIsLoadingKey);
  useEffect(() => {
    if (latestKey === currentIsLoadingKey) {
      return;
    }
    setIsLoading(false);
    setLatestKey(currentIsLoadingKey);
  }, [setIsLoading, setLatestKey, currentIsLoadingKey, latestKey]);

  const onChangePageAndCount = (page: number, count: number): void => {
    setIsLoading(true);
    router.push(buildUrl(query, page, count));
  };

  async function resetError(throwError: boolean) {
    requestAnimationFrame(() => setThrowError(throwError));
  }

  function setCurrentlyShownObject(repo: GithubRepository) {
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
              setIsLoading(true);
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
            {props.details ? (
              <GithubRepositoryLoader
                username={props.details?.request?.username}
                repoName={props.details?.request?.repo}
                repo={details != null ? details : undefined}
                error={detailsError != null ? detailsError : undefined}
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
