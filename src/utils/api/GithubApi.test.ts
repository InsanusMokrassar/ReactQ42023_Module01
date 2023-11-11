import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import GitHubAPI from './GithubApi';

describe('Tests of GithubApi', () => {
  const fetchMocker = createFetchMock(vi);
  beforeAll(() => {
    fetchMocker.enableMocks();
  });
  it('GithubApi#search tests', () => {
    const answerForFirstPage = '{"answer": 1}';
    const answerForSecondPage = '{"answer": 2}';
    fetchMocker.doMockOnceIf(/page=1/, () => {
      return answerForFirstPage;
    });
    fetchMocker.doMockOnceIf(/page=2/, () => {
      return answerForSecondPage;
    });

    const githubApi = new GitHubAPI();
    githubApi
      .search('gg', 1)
      .then((response) =>
        expect(response).toEqual(JSON.parse(answerForFirstPage))
      );
    githubApi
      .search('gg', 2)
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
