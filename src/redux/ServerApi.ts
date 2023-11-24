import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  GithubErrorResponse,
  GithubRepository,
  GithubResponse,
} from '../models/GithubApi';

export type SearchGithubParams = {
  query: string;
  page: number;
  count: number;
};
export type GetGithubParams = {
  username: string;
  repo: string;
};

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.github.com/',
  }),
  endpoints: (builder) => ({
    search: builder.query<
      GithubResponse<GithubRepository> | GithubErrorResponse,
      SearchGithubParams
    >({
      query: ({ query, page, count }: SearchGithubParams) => {
        const tagsParams = [
          ...query.trim().split(' '),
          ...(query.trim().length > 0 ? [] : ['lang:typescript']),
        ].join('+');
        const queryParams = [
          `q=${tagsParams}`,
          `page=${page + 1}`,
          `per_page=${count}`,
        ].join('&');
        return `search/repositories?${queryParams}`;
      },
    }),
    get: builder.query<GithubRepository | GithubErrorResponse, GetGithubParams>(
      {
        query: ({ username, repo }: GetGithubParams) => {
          return `repos/${username}/${repo}`;
        },
      }
    ),
  }),
});

export const useSearchQuery = serverApi.useSearchQuery;
export const useGetQuery = serverApi.useGetQuery;
