import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routerConfig } from './Router';
import createFetchMock from 'vitest-fetch-mock';
import { testGithubResponseWithGithubRepositories } from './components/Result.test';
import userEvent from '@testing-library/user-event';
import { GithubRepository } from './utils/api/GithubApi';

describe('App and all related tests', () => {
  const fetchMocker = createFetchMock(vi);
  let latestRequestedRepo: GithubRepository | undefined = undefined;

  beforeAll(() => {
    fetchMocker.enableMocks();
    fetchMocker.mockResponse((request) => {
      switch (true) {
        case /search/.test(request.url):
          return JSON.stringify(testGithubResponseWithGithubRepositories);
        case /repos/.test(request.url):
          const usernameRepoString = request.url
            .substring(request.url.indexOf('repos/') + 'repos/'.length)
            .split('/') as [string, string];
          for (
            let i = 0;
            i < testGithubResponseWithGithubRepositories.items.length;
            i++
          ) {
            const repo = testGithubResponseWithGithubRepositories.items[i];
            if (
              repo.owner.login == usernameRepoString[0] &&
              repo.name == usernameRepoString[1]
            ) {
              latestRequestedRepo = repo;
              return JSON.stringify(repo);
            }
          }
          break;
      }
      return '{}';
    });
  });

  it('Validate that clicking on a card opens a detailed card component;', async () => {
    const memoryProvider = createMemoryRouter(routerConfig, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={memoryProvider} />);

    for (
      let i = 0;
      i < testGithubResponseWithGithubRepositories.items.length;
      i++
    ) {
      const repo = testGithubResponseWithGithubRepositories.items[i];
      const element = await screen.findByRole(
        `github_repository_result_container${repo.url}`
      );

      await userEvent.click(element);

      expect(memoryProvider.state.location.pathname).toBe(
        `/github/${repo.owner.login}/${repo.name}`
      );
      expect(
        await screen.findByRole(
          `github_repository_details_loader/${repo.owner.login}/${repo.name}`
        )
      ).toBeTruthy();
    }
  });

  it('Check that clicking triggers an additional API call to fetch detailed information.', async () => {
    const memoryProvider = createMemoryRouter(routerConfig, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={memoryProvider} />);

    for (
      let i = 0;
      i < testGithubResponseWithGithubRepositories.items.length;
      i++
    ) {
      const repo = testGithubResponseWithGithubRepositories.items[i];
      const element = await screen.findByRole(
        `github_repository_result_container${repo.url}`
      );

      await userEvent.click(element);

      expect(latestRequestedRepo).toBe(repo);
    }
  });

  afterEach(() => {
    cleanup();
  });
  afterAll(() => {
    fetchMocker.dontMock();
  });
});
