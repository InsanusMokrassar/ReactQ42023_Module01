import { ReactNode } from 'react';
import { GithubRepository } from '../models/GithubRepository';
import GithubRepositoryInfo from './GithubRepositoryInfo';
import { GithubErrorResponse } from '../models/GithubErrorResponse';

export default function GithubRepositoryLoader({
  username,
  repoName,
  repo,
  error,
  unsetCurrentlyShownObject,
}: {
  username?: string;
  repoName?: string;
  repo?: GithubRepository;
  error?: GithubErrorResponse;
  unsetCurrentlyShownObject: () => void;
}): ReactNode {
  const isLoading =
    username != null &&
    repoName != null &&
    (repo == null ||
      repo.name != repoName ||
      repo.owner.login != repo.owner.login);

  return (
    <div role={`github_repository_details_loader/${username}/${repoName}`}>
      {isLoading ? (
        <div role={'github_repository_details_loader_loading'}>
          {`Loading of ${username}/${repoName}`}
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
          Error in loading of repo {`${username}/${repoName}`}:{' '}
          {`"${error.message}"`}
        </div>
      ) : (
        <></>
      )}
      {repo ? <GithubRepositoryInfo info={repo} /> : <></>}
    </div>
  );
}
