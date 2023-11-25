import { ReactNode } from 'react';
import { GithubErrorResponse, GithubRepository } from '../models/GithubApi';
import GithubRepositoryInfo from './GithubRepositoryInfo';

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
  // const [githubRepo, setGithubRepo]: [
  //   GithubRepository | undefined,
  //   (
  //     value:
  //       | ((
  //           prevState: GithubRepository | undefined
  //         ) => GithubRepository | undefined)
  //       | GithubRepository
  //       | undefined
  //   ) => void,
  // ] = useState<GithubRepository | undefined>(undefined);
  // const [error, setError]: [
  //   string | undefined,
  //   (
  //     value:
  //       | ((prevState: string | undefined) => string | undefined)
  //       | string
  //       | undefined
  //   ) => void,
  // ] = useState<string | undefined>(undefined);
  // const [isLoading, setIsLoading] = useState(false);

  // function unsetCurrentlyShownObject() {
  //   // dispatcher(setDetailedInfo({ username: undefined, repo: undefined }));
  // }

  // const outletRef: React.RefObject<HTMLDivElement> =
  //   useRef<HTMLDivElement>(null);
  // useOnClickOutside(outletRef, () => {
  //   unsetCurrentlyShownObject();
  // });

  // const getRepoRequest = useGetQuery(
  //   username ? (repo ? { username, repo } : skipToken) : skipToken
  // );

  // useEffect(() => {
  //   const isLoading = getRepoRequest.isLoading || getRepoRequest.isFetching;
  //   setLoading({ detailedItemLoading: isLoading }));
  //   if (
  //     isLoading ||
  //     getRepoRequest.data === undefined ||
  //     username == undefined ||
  //     repo == undefined
  //   ) {
  //     return;
  //   }
  //   const result: GithubRepository | GithubErrorResponse | undefined =
  //     getRepoRequest.data;
  //
  //   const asError = result as GithubErrorResponse;
  //   const asRepo = result as GithubRepository;
  //   if (asError.message) {
  //     setError(asError.message);
  //   } else {
  //     setGithubRepo(asRepo);
  //   }
  // }, [dispatcher, getRepoRequest, isLoading, repo, username]);

  // if (username == undefined || repo == undefined) {
  //   if (githubRepo !== undefined) {
  //     setGithubRepo(undefined);
  //   }
  //   return;
  // }

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
