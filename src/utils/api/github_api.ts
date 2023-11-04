export type GithubRepository = {
  full_name: string;
  description: string;
  url: string;
};
export type GithubResponse<T> = {
  items: Array<T>;
  total_count: number;
};
export type GithubErrorResponse = {
  message: string;
  documentation_url?: string;
};

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
      `page=${page}`,
      `per_page=${count}`,
    ].join('&');
    return fetch(`https://api.github.com/search/repositories?${queryParams}`)
      .then<GithubResponse<GithubRepository> | GithubErrorResponse>(
        (httpResponse) => httpResponse.json()
      )
      .then((response) => response);
  }
}

export const DefaultGitHubAPI = new GitHubAPI();
