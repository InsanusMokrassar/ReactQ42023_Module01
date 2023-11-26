import { GithubResponse } from '../GithubResponse';
import { GithubRepository } from '../GithubRepository';
import { GithubErrorResponse } from '../GithubErrorResponse';
import { DetailsResponse } from './DetailsResponse';
import { DetailsRequest } from './DetailsRequest';

export type RootPageResponse = {
  page: number;
  count: number;
  query: string;
  response: GithubResponse<GithubRepository> | null;
  error: GithubErrorResponse | null;
  details?: {
    request: DetailsRequest;
    response?: DetailsResponse;
  };
};
