import { describe, expect, it } from 'vitest';
import SearchHistoryWrapper from './SearchHistoryWrapper';
import { TestLocalStorage } from './TestLocalStorage';

describe('Tests of SearchHistoryWrapper', () => {
  it('Main SearchHistoryWrapper test', () => {
    const testLocalStorage = TestLocalStorage();
    const searchHistoryWrapper = new SearchHistoryWrapper(testLocalStorage);
    const dataToTest = 'dataToTest';
    expect(searchHistoryWrapper.getSearch()).toBe('');
    expect(searchHistoryWrapper.setSearch(dataToTest)).toBe(true);
    expect(searchHistoryWrapper.getSearch()).toBe(dataToTest);
    expect(testLocalStorage.getItem(testLocalStorage.key(0) as string)).toBe(
      dataToTest
    );
  });
});
