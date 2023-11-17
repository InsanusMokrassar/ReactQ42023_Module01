import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  DefaultGitHubAPI,
  GithubErrorResponse,
  GithubRepository,
} from '../utils/api/GithubApi';
import GithubRepositoryInfo from './GithubRepositoryInfo';
import { useOnClickOutside } from 'usehooks-ts';
import { useDispatch, useSelector } from 'react-redux';
import { DetailedInfoSliceStateSlice } from '../redux/Store';
import { setDetailedInfo } from '../redux/DetailedInfoSlice';

export default function GithubRepositoryLoader(): ReactNode {
  const { username, repo } = useSelector(
    (state: DetailedInfoSliceStateSlice) => state.details
  );

  const [didRequestFor, setDidRequestFor]: [
    string | undefined,
    (
      value:
        | ((prevState: string | undefined) => string | undefined)
        | string
        | undefined
    ) => void,
  ] = useState<string | undefined>(undefined);
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
  const [isLoading, setIsLoading]: [
    boolean,
    (value: ((prevState: boolean) => boolean) | boolean) => void,
  ] = useState<boolean>(true);

  const dispatcher = useDispatch();

  function unsetCurrentlyShownObject() {
    dispatcher(setDetailedInfo({ username: undefined, repo: undefined }));
  }

  const outletRef: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);
  useOnClickOutside(outletRef, () => {
    unsetCurrentlyShownObject();
  });

  async function doRequest(username: string, repo: string) {
    setDidRequestFor(usernameRepo);
    setIsLoading(true);
    setError(undefined);
    setGithubRepo(undefined);
    DefaultGitHubAPI()
      .get(username, repo)
      .then((result) => {
        const asError = result as GithubErrorResponse;
        const asRepo = result as GithubRepository;
        if (asError.message) {
          setError(asError.message);
        } else {
          setGithubRepo(asRepo);
        }
        setIsLoading(false);
      });
  }
  const usernameRepo = `${username}/${repo}`;
  useEffect(() => {
    if (
      username != undefined &&
      repo != undefined &&
      didRequestFor != usernameRepo
    ) {
      doRequest(username, repo);
    }
  });

  if (username == undefined || repo == undefined) {
    return;
  }

  return (
    <div role={`github_repository_details_loader/${username}/${repo}`}>
      <button
        role={'github_repository_details_loader_close'}
        onClick={unsetCurrentlyShownObject}
      >
        Close
      </button>
      {error ? (
        <div ref={outletRef}>
          Error in loading of repo {`${username}/${repo}`}: {`"${error}"`}
        </div>
      ) : (
        <></>
      )}
      {githubRepo ? (
        <GithubRepositoryInfo info={githubRepo} outletRef={outletRef} />
      ) : (
        <></>
      )}
      {isLoading ? (
        <div role={'github_repository_details_loader_loading'} ref={outletRef}>
          Loading of {`${username}/${repo}`}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
