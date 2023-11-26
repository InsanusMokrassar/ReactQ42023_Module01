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
import { cleanup, screen } from '@testing-library/react';
import { getServerSideProps } from './index';
import { testGithubRepositories } from '../../../components/GithubRepositoryInfo.test';
import { GetServerSidePropsContext } from 'next';
import createFetchMock from 'vitest-fetch-mock';
import { PageRequest } from '../../../models/pages/PageRequest';
import { DetailsRequest } from '../../../models/pages/DetailsRequest';
import { ParsedUrlQuery } from 'querystring';

let calledHrefs: Array<string> = [];
describe('Details Index', async () => {
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

  it('getServerSideProps works properly on no context params and query', async () => {
    const testingRepo = testGithubRepositories[0];
    const query: PageRequest = {
      page: '0',
      count: '10',
      query: 'sample',
    };
    const params: DetailsRequest & ParsedUrlQuery = {
      username: testingRepo.owner.login,
      repo: testingRepo.name,
    };
    const props = {
      query,
      params,
    };
    fetchMocker.mockResponse(() => {
      return JSON.stringify(testingRepo);
    });
    const resultProps = await getServerSideProps(
      props as unknown as GetServerSidePropsContext
    );

    expect(JSON.stringify(resultProps.props.details.response.details)).toBe(
      JSON.stringify(testingRepo)
    );
    expect(resultProps.props.details.response.error).toBeNull();
    expect(resultProps.props.details.request).toBe(params);
  });

  afterAll(() => {
    fetchMocker.disableMocks();
  });
});
