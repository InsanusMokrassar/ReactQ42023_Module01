import { ReactNode, useEffect, useRef, useState } from 'react';
import { GithubErrorResponse, GithubRepository } from '../models/GithubApi';
import GithubRepositoryInfo from './GithubRepositoryInfo';
import { useOnClickOutside } from 'usehooks-ts';
import { useDispatch, useSelector } from 'react-redux';
import {
  DetailedInfoSliceStateSlice,
  LoadersSliceStateSlice,
} from '../redux/Store';
import { setDetailedInfo } from '../redux/DetailedInfoSlice';
import { useGetQuery } from '../redux/GithubApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { setLoading } from '../redux/LoadersSlice';

export default function GithubRepositoryLoader(): ReactNode {
  const { username, repo } = useSelector(
    (state: DetailedInfoSliceStateSlice) => state.details
  );
  const [githubRepo, setGithubRepo]: [
    GithubRepository | undefined,
    (
      value:
        | ((
            prevState: GithubRepository | undefined
          ) => GithubRepository | undefined)
        | GithubRepository
        | undefined
    ) => void,
  ] = useState<GithubRepository | undefined>(undefined);
  const [error, setError]: [
    string | undefined,
    (
      value:
        | ((prevState: string | undefined) => string | undefined)
        | string
        | undefined
    ) => void,
  ] = useState<string | undefined>(undefined);
  const isLoading = useSelector(
    (state: LoadersSliceStateSlice) => state.loaders.detailedItemLoading
  );

  const dispatcher = useDispatch();

  function unsetCurrentlyShownObject() {
    dispatcher(setDetailedInfo({ username: undefined, repo: undefined }));
  }

  const outletRef: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);
  useOnClickOutside(outletRef, () => {
    unsetCurrentlyShownObject();
  });

  const getRepoRequest = useGetQuery(
    username ? (repo ? { username, repo } : skipToken) : skipToken
  );

  useEffect(() => {
    const isLoading = getRepoRequest.isLoading || getRepoRequest.isFetching;
    dispatcher(setLoading({ detailedItemLoading: isLoading }));
    if (
      isLoading ||
      getRepoRequest.data === undefined ||
      username == undefined ||
      repo == undefined
    ) {
      return;
    }
    const result: GithubRepository | GithubErrorResponse | undefined =
      getRepoRequest.data;

    const asError = result as GithubErrorResponse;
    const asRepo = result as GithubRepository;
    if (asError.message) {
      setError(asError.message);
    } else {
      setGithubRepo(asRepo);
    }
  }, [dispatcher, getRepoRequest, isLoading, repo, username]);

  if (username == undefined || repo == undefined) {
    if (githubRepo !== undefined) {
      setGithubRepo(undefined);
    }
    return;
  }

  return (
    <div
      role={`github_repository_details_loader/${username}/${repo}`}
      ref={outletRef}
    >
      {isLoading ? (
        <div role={'github_repository_details_loader_loading'}>
          {`Loading of ${username}/${repo}`}
        </div>
      ) : (
        <></>
      )}
      <button
        role={'github_repository_details_loader_close'}
        onClick={unsetCurrentlyShownObject}
      >
        Close
      </button>
      {error ? (
        <div>
          Error in loading of repo {`${username}/${repo}`}: {`"${error}"`}
        </div>
      ) : (
        <></>
      )}
      {githubRepo ? <GithubRepositoryInfo info={githubRepo} /> : <></>}
    </div>
  );
}
