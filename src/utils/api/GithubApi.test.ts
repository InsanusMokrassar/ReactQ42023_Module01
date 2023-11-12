import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import GitHubAPI from './GithubApi';

describe('Tests of GithubApi', () => {
  const fetchMocker = createFetchMock(vi);
  beforeAll(() => {
    fetchMocker.enableMocks();
  });
  it('GithubApi#search tests', async () => {
    const answerForFirstPage = '{"answer": 1}';
    const answerForSecondPage = '{"answer": 2}';
    fetchMocker.mockResponse((request) => {
      switch (true) {
        case /page=1/.test(request.url):
          return answerForFirstPage;
        case /page=2/.test(request.url):
          return answerForSecondPage;
      }
      return '{}';
    });

    const githubApi = new GitHubAPI();
    await githubApi
      .search('gg', 0)
      .then((response) =>
        expect(response).toEqual(JSON.parse(answerForFirstPage))
      );
    await githubApi
      .search('gg', 1)
      .then((response) =>
        expect(response).toEqual(JSON.parse(answerForSecondPage))
      );
  });
  it('GithubApi#get tests', () => {
    const answerForFirstPage = '{"answer": 1}';
    const answerForSecondPage = '{"answer": 2}';
    fetchMocker.doMockOnceIf(/gg\/wp/, () => {
      return answerForFirstPage;
    });
    fetchMocker.doMockOnceIf(/gg\/wp2/, () => {
      return answerForSecondPage;
    });

    const githubApi = new GitHubAPI();
    githubApi
      .get('gg', 'wp')
      .then((response) =>
        expect(response).toEqual(JSON.parse(answerForFirstPage))
      );
    githubApi
      .get('gg', 'wp2')
      .then((response) =>
        expect(response).toEqual(JSON.parse(answerForSecondPage))
      );
  });
  afterAll(() => {
    fetchMocker.dontMock();
  });
});
