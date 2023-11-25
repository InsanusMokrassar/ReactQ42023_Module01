import { GithubUser } from './GithubUser';

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
