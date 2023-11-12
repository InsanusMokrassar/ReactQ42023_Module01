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
import { defaultSearchHistoryWrapper } from './utils/SearchHistoryWrapper';

describe('App and all related tests', () => {
  const fetchMocker = createFetchMock(vi);
  let latestRequestedRepo: GithubRepository | undefined = undefined;
  function enableDefaultFetchMocker(
    onSearch: (request: Request) => string | undefined = () => undefined,
    onRepos: (request: Request) => string | undefined = () => undefined
  ) {
    fetchMocker.mockResponse((request) => {
      switch (true) {
        case /search/.test(request.url):
          return (
            onSearch(request) ||
            JSON.stringify(testGithubResponseWithGithubRepositories)
          );
        case /repos/.test(request.url):
          const onReposResult = onRepos(request);
          if (onReposResult !== undefined) {
            return onReposResult;
          }
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
  }

  beforeAll(() => {
    fetchMocker.enableMocks();
  });

  it('Validate that clicking on a card opens a detailed card component;', async () => {
    enableDefaultFetchMocker();
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
    enableDefaultFetchMocker();
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

  it('Check that a loading indicator is displayed while fetching data;', async () => {
    let checked = false;
    enableDefaultFetchMocker(undefined, () => {
      expect(
        screen.getByRole('github_repository_details_loader_loading')
      ).toBeTruthy();
      checked = true;
      return undefined;
    });
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

      expect(checked).toBeTruthy();
      checked = false;
    }
  });

  it('Ensure that clicking the close button hides the component.', async () => {
    enableDefaultFetchMocker();
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

      const closeElement = await screen.findByRole(
        'github_repository_details_loader_close'
      );
      await userEvent.click(closeElement);

      let found = false;
      try {
        screen.getByRole(
          `github_repository_details_loader/${repo.owner.login}/${repo.name}`
        );
        found = true;
      } catch (e) {
        found = false;
      }
      expect(found).toBeFalsy();
    }
  });

  it('Make sure the component updates URL query parameter when page changes.', async () => {
    const testTotalCount = 100500;
    const pages = Math.ceil(testTotalCount / 10);
    enableDefaultFetchMocker(() =>
      JSON.stringify({
        ...testGithubResponseWithGithubRepositories,
        total_count: testTotalCount,
      })
    );
    const memoryProvider = createMemoryRouter(routerConfig, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={memoryProvider} />);

    const lastButton = await screen.findByRole('navigation_to_last');
    await userEvent.click(lastButton);

    expect(
      memoryProvider.state.location.search.indexOf('count=10')
    ).toBeGreaterThan(-1);
    expect(
      memoryProvider.state.location.search.indexOf(`page=${pages}`)
    ).toBeGreaterThan(-1);

    const firstButton = await screen.findByRole('navigation_to_first');
    await userEvent.click(firstButton);

    expect(
      memoryProvider.state.location.search.indexOf('count=10')
    ).toBeGreaterThan(-1);
    expect(
      memoryProvider.state.location.search.indexOf(`page=0`)
    ).toBeGreaterThan(-1);

    const nextButton = await screen.findByRole('navigation_to_next');
    await userEvent.click(nextButton);

    expect(
      memoryProvider.state.location.search.indexOf('count=10')
    ).toBeGreaterThan(-1);
    expect(
      memoryProvider.state.location.search.indexOf(`page=1`)
    ).toBeGreaterThan(-1);

    const previousButton = await screen.findByRole('navigation_to_previous');
    await userEvent.click(previousButton);

    expect(
      memoryProvider.state.location.search.indexOf('count=10')
    ).toBeGreaterThan(-1);
    expect(
      memoryProvider.state.location.search.indexOf(`page=0`)
    ).toBeGreaterThan(-1);
  });

  it('Verify that clicking the Search button saves the entered value to the local storage;', async () => {
    enableDefaultFetchMocker();
    const memoryProvider = createMemoryRouter(routerConfig, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={memoryProvider} />);

    const searchButton = await screen.findByRole('search_panel_submit_button');
    const input = await screen.findByRole('SearchInput');

    await userEvent.click(input);
    await userEvent.paste('test data');

    await userEvent.click(searchButton);
    expect(defaultSearchHistoryWrapper().getSearch()).toBe('test data');
  });

  afterEach(() => {
    cleanup();
    fetchMocker.mockClear();
  });
  afterAll(() => {
    fetchMocker.dontMock();
  });
});
