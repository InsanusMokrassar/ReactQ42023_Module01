export type GithubRepository = {
  full_name: string;
  description: string;
  url: string;
};
export type GithubResponse<T> = {
  items: Array<T>;
};

export default class GitHubAPI {
  async search(
    query: string,
    page: number = 0,
    count: number = 5
  ): Promise<Array<GithubRepository>> {
    const tagsParams = query.trim().split(' ').join('+');
    const queryParams = [
      `q=${tagsParams}`,
      `page=${page}`,
      `per_page=${count}`,
    ].join('&');
    return fetch(`https://api.github.com/search/repositories?${queryParams}`)
      .then<GithubResponse<GithubRepository>>((response) => response.json())
      .then((response) => response.items);
  }
}

export const DefaultGitHubAPI = new GitHubAPI();
