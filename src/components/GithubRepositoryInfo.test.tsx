import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { GithubRepository } from '../models/GithubApi';
import GithubRepositoryInfo from './GithubRepositoryInfo';
import { useRef } from 'react';

function FakeContainer({ info }: { info: GithubRepository }) {
  const reference = useRef<HTMLDivElement>(null);
  return (
    <>
      <GithubRepositoryInfo info={info} outletRef={reference} />
    </>
  );
}

export const testGithubRepositories: Array<GithubRepository> = [];
for (let i = 0; i < 10; i++) {
  testGithubRepositories.push({
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

describe('GithubRepositoryInfo', async () => {
  screen.debug();
  beforeEach(() => {
    cleanup();
  });
  it('Make sure the detailed card component correctly displays the detailed card data;', async () => {
    for (let i = 0; i < testGithubRepositories.length; i++) {
      const info = testGithubRepositories[i];
      render(<FakeContainer info={info} />);

      const container = await screen.findByRole('github_repository_info');

      const titleElement = container.getElementsByTagName('h3');
      expect(titleElement.length).toBe(1);
      expect(titleElement.item(0)!.innerHTML).toBe(info.full_name);

      const additionalInfoElements = container.getElementsByTagName('div');
      expect(additionalInfoElements.length).toBe(6);
      expect(additionalInfoElements.item(0)!.innerHTML).toBe(info.description);
      expect(additionalInfoElements.item(1)!.innerHTML).toBe(info.url);
      expect(additionalInfoElements.item(2)!.innerHTML).toContain(
        info.language
      );
      expect(additionalInfoElements.item(3)!.innerHTML).toContain(
        info.stargazers_count
      );
      expect(additionalInfoElements.item(4)!.innerHTML).toContain(
        info.forks_count
      );
      expect(additionalInfoElements.item(5)!.innerHTML).toContain(
        info.watchers_count
      );

      cleanup();
    }
  });
});
