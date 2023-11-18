import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routerConfig } from './Router';
import createFetchMock, { FetchMock } from 'vitest-fetch-mock';
import { testGithubResponseWithGithubRepositories } from './components/Result.test';
import userEvent from '@testing-library/user-event';
import { GithubRepository } from './models/GithubApi';
import { SearchSliceStateSlice, store } from './redux/Store';

export function createDefaultFetchMocker(): [
  FetchMock,
  () => GithubRepository | undefined,
  (
    onSearch?: (request: Request) => string | undefined,
    onRepos?: (request: Request) => string | undefined
  ) => void,
] {
  const fetchMocker = createFetchMock(vi);
  let latestRequestedRepo: GithubRepository | undefined = undefined;
  function enableDefaultFetchMocker(
    onSearch: (request: Request) => string | undefined = () => undefined,
    onRepos: (request: Request) => string | undefined = () => undefined
  ) {
    fetchMocker.mockResponse((request) => {
      switch (true) {
        case /search/.test(request.url):
          const onSearchResult = onSearch(request);
          return onSearchResult !== undefined
            ? onSearchResult
            : JSON.stringify(testGithubResponseWithGithubRepositories);
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

  return [fetchMocker, () => latestRequestedRepo, enableDefaultFetchMocker];
}

describe('App and all related tests', async () => {
  const [fetchMocker, , enableDefaultFetchMockerFun] =
    createDefaultFetchMocker();
  beforeAll(() => {
    fetchMocker.enableMocks();
  });

  it('Validate that clicking on a card opens a detailed card component;', async () => {
    enableDefaultFetchMockerFun();
    const memoryProvider = createMemoryRouter(routerConfig, {
      initialEntries: ['/'],
    });

    const rendered = render(<RouterProvider router={memoryProvider} />);

    for (
      let i = 0;
      i < testGithubResponseWithGithubRepositories.items.length;
      i++
    ) {
      const repo = testGithubResponseWithGithubRepositories.items[i];
      const element = await rendered.findByRole(
        `github_repository_result_container${repo.url}`
      );

      await userEvent.click(element);

      expect(
        await rendered.findByRole(
          `github_repository_details_loader/${repo.owner.login}/${repo.name}`
        )
      ).toBeTruthy();
    }
  });

  it('Ensure that clicking the close button hides the component.', async () => {
    enableDefaultFetchMockerFun();
    const memoryProvider = createMemoryRouter(routerConfig, {
      initialEntries: ['/'],
    });

    const rendered = render(<RouterProvider router={memoryProvider} />);

    for (
      let i = 0;
      i < testGithubResponseWithGithubRepositories.items.length;
      i++
    ) {
      const repo = testGithubResponseWithGithubRepositories.items[i];
      const element = await rendered.findByRole(
        `github_repository_result_container${repo.url}`
      );

      await userEvent.click(element);

      const closeElement = await rendered.findByRole(
        'github_repository_details_loader_close'
      );
      await userEvent.click(closeElement);

      let found = false;
      try {
        rendered.getByRole(
          `github_repository_details_loader/${repo.owner.login}/${repo.name}`
        );
        found = true;
      } catch (e) {
        found = false;
      }
      expect(found).toBeFalsy();
    }
  });

  it('Verify that clicking the Search button saves the entered value to the react store;', async () => {
    enableDefaultFetchMockerFun();
    const memoryProvider = createMemoryRouter(routerConfig, {
      initialEntries: ['/'],
    });

    const rendered = render(<RouterProvider router={memoryProvider} />);

    const searchButton = await rendered.findByRole(
      'search_panel_submit_button'
    );
    const input = await rendered.findByRole('SearchInput');

    await userEvent.click(input);
    await userEvent.paste('test data');

    await userEvent.click(searchButton);
    expect((store.getState() as SearchSliceStateSlice).search.search).toBe(
      'test data'
    );
  });

  it('Verify that changing of count per page saves the entered value to the react store;', async () => {
    enableDefaultFetchMockerFun();
    const memoryProvider = createMemoryRouter(routerConfig, {
      initialEntries: ['/'],
    });

    const rendered = render(<RouterProvider router={memoryProvider} />);

    const input = (await rendered.findByRole(
      'navigation_count_select'
    )) as HTMLInputElement;

    for (let i = 0; i < input.children.length; i++) {
      const child = input.children.item(i);
      if (child instanceof HTMLOptionElement) {
        await userEvent.selectOptions(input, child);
        const storeValue = (store.getState() as SearchSliceStateSlice).search
          .itemsPerPage;
        expect(input.value).toBe(child.value);
        expect(storeValue).toBe(parseInt(child.value));
      }
    }
  });

  it('Check that the component retrieves the value from the local storage upon mounting.', async () => {
    enableDefaultFetchMockerFun();
    const memoryProvider = createMemoryRouter(routerConfig, {
      initialEntries: ['/'],
    });

    const rendered = render(<RouterProvider router={memoryProvider} />);

    const input = await rendered.findByRole('SearchInput');

    expect(input.getAttribute('value')).toBe('test data');
  });

  afterEach(() => {
    cleanup();
    fetchMocker.mockClear();
  });
  afterAll(() => {
    fetchMocker.disableMocks();
  });
});
