import lazy from '../Lazy';
import {
  GithubErrorResponse,
  GithubRepository,
  GithubResponse,
} from '../../models/GithubApi';

export default class GitHubAPI {
  async search(
    query: string,
    page: number = 0,
    count: number = 5
  ): Promise<GithubResponse<GithubRepository> | GithubErrorResponse> {
    const tagsParams = [
      ...query.trim().split(' '),
      ...(query.trim().length > 0 ? [] : ['lang:typescript']),
    ].join('+');
    const queryParams = [
      `q=${tagsParams}`,
      `page=${page + 1}`,
      `per_page=${count}`,
    ].join('&');
    return fetch(`https://api.github.com/search/repositories?${queryParams}`)
      .then<GithubResponse<GithubRepository> | GithubErrorResponse>(
        (httpResponse) => httpResponse.json()
      )
      .then((response) => response);
  }
  async get(
    user: string,
    repo: string
  ): Promise<GithubRepository | GithubErrorResponse> {
    return fetch(`https://api.github.com/repos/${user}/${repo}`)
      .then<GithubRepository | GithubErrorResponse>((httpResponse) =>
        httpResponse.json()
      )
      .then((response) => response);
  }
}

const LazyDefaultGitHubAPI = lazy(() => new GitHubAPI());
export function DefaultGitHubAPI(): GitHubAPI {
  return LazyDefaultGitHubAPI();
}
