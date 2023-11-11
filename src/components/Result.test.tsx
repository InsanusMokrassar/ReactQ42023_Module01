import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GithubRepository, GithubResponse } from '../utils/api/GithubApi';
import { AppContext } from '../AppContext';
import Results from './Result';

describe('Result and Results tests', async () => {
  screen.debug();
  const testData: Array<GithubRepository> = [];
  for (let i = 0; i < 10; i++) {
    testData.push({
      description: `d${i}`,
      forks_count: i,
      full_name: `fn${i}`,
      name: `n${i}`,
      url: `u${i}`,
      language: `l${i}`,
      owner: {
        login: `o_l${i}`,
      },
      stargazers_count: i,
      watchers_count: i,
    });
  }
  const results: GithubResponse<GithubRepository> = {
    items: testData,
    total_count: testData.length,
  };
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
          results,
          setResults: () => {},
        }}
      >
        <Results onItemClicked={onStateChange} />
      </AppContext.Provider>
    );

    await screen.findByRole('github_repository_results_container');

    const container = screen.getByRole('github_repository_results_container');

    for (let i = 0; i < testData.length; i++) {
      const testDataItem = testData[i];

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
