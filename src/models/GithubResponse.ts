export type GithubResponse<T> = {
  items: Array<T>;
  total_count: number;
};
