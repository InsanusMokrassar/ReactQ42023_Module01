import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import GithubRepositoryLoader from './GithubRepositoryLoader';
import { testGithubRepositories } from './GithubRepositoryInfo.test';

describe('GithubRepositoryLoader', async () => {
  screen.debug();
  afterEach(() => {
    cleanup();
  });
  it('Loader is showing', async () => {
    testGithubRepositories.forEach((repo) => {
      const rendered = render(
        <GithubRepositoryLoader
          unsetCurrentlyShownObject={() => {}}
          username={repo.owner.login}
          repoName={repo.name}
        />
      );

      expect(
        rendered.getByRole(
          `github_repository_details_loader/${repo.owner.login}/${repo.name}`
        )
      ).toBeTruthy();

      expect(
        rendered.getByRole(`github_repository_details_loader_loading`)
      ).toBeTruthy();

      expect(
        rendered.getByRole(`github_repository_details_loader_close`)
      ).toBeTruthy();

      cleanup();
    });
  });
  it('Repo is showing', async () => {
    testGithubRepositories.forEach((repo) => {
      const rendered = render(
        <GithubRepositoryLoader
          unsetCurrentlyShownObject={() => {}}
          username={repo.owner.login}
          repoName={repo.name}
          repo={repo}
        />
      );

      expect(
        rendered.getByRole(
          `github_repository_details_loader/${repo.owner.login}/${repo.name}`
        )
      ).toBeTruthy();

      expect(rendered.getByRole(`github_repository_info`)).toBeTruthy();

      expect(
        rendered.getByRole(`github_repository_details_loader_close`)
      ).toBeTruthy();

      cleanup();
    });
  });
  it('Error is showing', async () => {
    testGithubRepositories.forEach((repo) => {
      const rendered = render(
        <GithubRepositoryLoader
          unsetCurrentlyShownObject={() => {}}
          username={repo.owner.login}
          repoName={repo.name}
          repo={repo}
          error={{ documentation_url: repo.url, message: repo.name }}
        />
      );

      expect(
        rendered.getByRole(
          `github_repository_details_loader/${repo.owner.login}/${repo.name}`
        )
      ).toBeTruthy();

      expect(
        rendered.getByRole(`github_repository_details_loader_error`)
      ).toBeTruthy();

      expect(
        rendered.getByRole(`github_repository_details_loader_close`)
      ).toBeTruthy();

      cleanup();
    });
  });
});
