import { GithubRepository } from '../GithubRepository';
import { GithubErrorResponse } from '../GithubErrorResponse';

export type DetailsResponse = {
  details: GithubRepository | null;
  error: GithubErrorResponse | null;
};
