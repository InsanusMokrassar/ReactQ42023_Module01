import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Page, { getServerSideProps } from './index';
import { testGithubResponseWithGithubRepositories } from '../components/Result.test';
import { testGithubRepositories } from '../components/GithubRepositoryInfo.test';
import { GetServerSidePropsContext } from 'next';
import createFetchMock from 'vitest-fetch-mock';
import { PageRequest } from '../models/pages/PageRequest';
import userEvent from '@testing-library/user-event';

let calledHrefs: Array<string> = [];
describe('Root Index', async () => {
  screen.debug();
  const fetchMocker = createFetchMock(vi);
  beforeAll(() => {
    fetchMocker.enableMocks();
  });
  beforeEach(() => {
    calledHrefs = [];
    vi.mock('next/router', () => {
      const newUseRouter = () => {
        return {
          push: async (href: string) => {
            calledHrefs.push(href);
          },
        };
      };

      return { useRouter: newUseRouter };
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('Loader is shown', async () => {
    // const routerMock = vi.fn().mockImplementation(useRouter);
    // routerMock.mockReturnValue(mockedRouter);
    const rendered = render(
      <Page page={0} count={10} query={'react'} response={null} error={null} />
    );

    expect(rendered.getByRole('root_index_loader')).toBeTruthy();
  });
  it('Repos are shown', async () => {
    // const routerMock = vi.fn().mockImplementation(useRouter);
    // routerMock.mockReturnValue(mockedRouter);
    const rendered = render(
      <Page
        page={0}
        count={10}
        query={'react'}
        response={testGithubResponseWithGithubRepositories}
        error={null}
      />
    );

    expect(
      rendered.getByRole('github_repository_results_container')
    ).toBeTruthy();

    testGithubRepositories.forEach((repo) => {
      expect(
        rendered.getByRole(`github_repository_result_container${repo.url}`)
      ).toBeTruthy();
    });
  });
  it('Error is shown', async () => {
    const testError = { documentation_url: 'sample', message: 'test' };
    const rendered = render(
      <Page
        page={0}
        count={10}
        query={'react'}
        response={null}
        error={testError}
      />
    );

    const infoNode = rendered.getByRole('error_info_node');

    expect(infoNode).toBeTruthy();
    expect(infoNode.innerHTML).toBe(
      `GitHub error message: "${testError.message}"`
    );
  });
  it('Repos clicks works properly', async () => {
    // const routerMock = vi.fn().mockImplementation(useRouter);
    // routerMock.mockReturnValue(mockedRouter);
    const rendered = render(
      <Page
        page={0}
        count={10}
        query={'react'}
        response={testGithubResponseWithGithubRepositories}
        error={null}
      />
    );

    expect(
      rendered.getByRole('github_repository_results_container')
    ).toBeTruthy();

    for (let i = 0; i < testGithubRepositories.length; i++) {
      const repo = testGithubRepositories[i];
      const element = rendered.getByRole(
        `github_repository_result_container${repo.url}`
      );
      await userEvent.click(element);
      expect(
        calledHrefs.filter((href) =>
          href.startsWith(`/${repo.owner.login}/${repo.name}`)
        ).length
      ).toBe(1);
    }
  });
  it('Empty message is shown', async () => {
    // const routerMock = vi.fn().mockImplementation(useRouter);
    // routerMock.mockReturnValue(mockedRouter);
    const rendered = render(
      <Page
        page={0}
        count={10}
        query={'react'}
        response={{
          items: [],
          total_count: 0,
        }}
        error={null}
      />
    );

    expect(
      rendered.getByRole('github_repository_results_container')
    ).toBeTruthy();

    expect(
      rendered.getByRole('github_repository_results_container_empty')
    ).toBeTruthy();
  });

  it('getServerSideProps works properly on no context params and query', async () => {
    const query: PageRequest = {
      page: '0',
      count: '10',
      query: 'sample',
    };
    const props = {
      query,
    };
    fetchMocker.mockOnce(() => {
      return JSON.stringify(testGithubResponseWithGithubRepositories);
    });
    const resultProps = await getServerSideProps(
      props as GetServerSidePropsContext
    );

    expect(resultProps.props.page).toBe(parseInt(query.page!));
    expect(resultProps.props.count).toBe(parseInt(query.count!));
    expect(resultProps.props.query).toBe(query.query);
    expect(JSON.stringify(resultProps.props.response)).toBe(
      JSON.stringify(testGithubResponseWithGithubRepositories)
    );
  });

  afterAll(() => {
    fetchMocker.disableMocks();
  });
});
