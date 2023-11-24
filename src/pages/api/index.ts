import { NextApiRequest, NextApiResponse } from 'next';
import {
  GithubErrorResponse,
  GithubRepository,
  GithubResponse,
} from '../../models/GithubApi';
import { DefaultGitHubAPI } from '../../utils/api/GithubApi';

type MainPageUpdateResponse = {
  repos?: GithubResponse<GithubRepository>;
  error?: GithubErrorResponse;
};

type MainPageUpdateRequest = {
  page: number;
  count: number;
  query: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MainPageUpdateResponse>
) {
  const query = req.body as MainPageUpdateRequest;
  const answer = await DefaultGitHubAPI().search(
    query.query,
    query.page,
    query.count
  );

  const asError = answer as GithubErrorResponse;

  if (asError.message !== undefined) {
    res.status(200).json({
      error: asError,
    });
  } else {
    res.status(200).json({
      repos: answer as GithubResponse<GithubRepository>,
    });
  }
}
