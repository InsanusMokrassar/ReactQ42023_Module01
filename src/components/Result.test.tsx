import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GithubRepository, GithubResponse } from '../utils/api/GithubApi';
import { AppContext } from '../AppContext';
import Results from './Result';
import { testGithubRepositories } from './GithubRepositoryInfo.test';

export const testGithubResponseWithGithubRepositories: GithubResponse<GithubRepository> =
  {
    items: testGithubRepositories,
    total_count: testGithubRepositories.length,
  };

describe('Result and Results tests', async () => {
  screen.debug();
  beforeEach(() => {
    cleanup();
  });
  it('Results shown correctly', async () => {
    let latestClickedRepo: GithubRepository | undefined = undefined;
    const onStateChange = (repo: GithubRepository) => {
      latestClickedRepo = repo;
    };
    render(
      <AppContext.Provider
        value={{
          search: '',
          setSearch: () => {},
          results: testGithubResponseWithGithubRepositories,
          setResults: () => {},
        }}
      >
        <Results onItemClicked={onStateChange} />
      </AppContext.Provider>
    );

    await screen.findByRole('github_repository_results_container');

    const container = screen.getByRole('github_repository_results_container');

    for (
      let i = 0;
      i < testGithubResponseWithGithubRepositories.items.length;
      i++
    ) {
      const testDataItem = testGithubResponseWithGithubRepositories.items[i];

      const itemContainer = await screen.findByRole(
        `github_repository_result_container${testDataItem.url}`
      );

      expect(container.contains(itemContainer)).toBeTruthy();

      const titleElement = itemContainer.getElementsByTagName('h3');
      expect(titleElement.length).toBe(1);
      expect(titleElement.item(0)!.innerHTML).toBe(testDataItem.full_name);

      const additionalInfoElements = itemContainer.getElementsByTagName('div');
      expect(additionalInfoElements.length).toBe(2);
      expect(additionalInfoElements.item(0)!.innerHTML).toBe(
        testDataItem.description
      );
      expect(additionalInfoElements.item(1)!.innerHTML).toBe(testDataItem.url);

      expect(itemContainer);

      await userEvent.click(itemContainer);
      expect(latestClickedRepo).toBe(testDataItem);
    }
  });
  it('Empty results shown correctly', async () => {
    render(
      <AppContext.Provider
        value={{
          search: '',
          setSearch: () => {},
          results: {
            items: [],
            total_count: 0,
          },
          setResults: () => {},
        }}
      >
        <Results onItemClicked={() => {}} />
      </AppContext.Provider>
    );

    await screen.findByRole('github_repository_results_container');

    const emptyList = await screen.findByRole(
      'github_repository_results_container_empty'
    );

    expect(emptyList.innerHTML).toBe(
      'Sorry, but currently there is nothing to show'
    );
  });
});
