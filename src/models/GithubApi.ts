export type GithubUser = {
  login: string;
};
export type GithubRepository = {
  name: string;
  full_name: string;
  description: string;
  url: string;
  stargazers_count?: number;
  watchers_count?: number;
  forks_count?: number;
  language?: string;
  owner: GithubUser;
};
export type GithubResponse<T> = {
  items: Array<T>;
  total_count: number;
};
export type GithubErrorResponse = {
  message: string;
  documentation_url?: string;
};
