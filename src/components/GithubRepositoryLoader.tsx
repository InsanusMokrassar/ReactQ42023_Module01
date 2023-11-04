import { ReactNode, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DefaultGitHubAPI,
  GithubErrorResponse,
  GithubRepository,
} from '../utils/api/GithubApi';
import GithubRepositoryInfo from './GithubRepositoryInfo';
import useOnClickOutside from '../utils/UseOnClickOutside';

export default function GithubRepositoryLoader(): ReactNode {
  const { username, repo } = useParams<{ username: string; repo: string }>();

  const [didRequestFor, setDidRequestFor] = useState<string | undefined>(
    undefined
  );
  const [githubRepo, setGithubRepo] = useState<GithubRepository | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  function unsetCurrentlyShownObject() {
    navigate('/');
  }

  const outletRef: React.RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);
  useOnClickOutside(outletRef, () => {
    unsetCurrentlyShownObject();
  });

  if (username === undefined) {
    return (
      <span>
        Unable to show info about the repo when username is not available
      </span>
    );
  }

  if (repo === undefined) {
    return (
      <span>
        Unable to show info about the repo of user {username} when repo is not
        available
      </span>
    );
  }

  const usernameRepo = `${username}/${repo}`;
  if (didRequestFor != usernameRepo) {
    setDidRequestFor(usernameRepo);
    setIsLoading(true);
    setError(undefined);
    setGithubRepo(undefined);
    DefaultGitHubAPI.get(username, repo).then((result) => {
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

  return (
    <div>
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
        <div ref={outletRef}>Loading of {`${username}/${repo}`}</div>
      ) : (
        <></>
      )}
    </div>
  );
}
