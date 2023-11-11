export default class SearchHistoryWrapper {
  public static search: string = 'search';
  private storage: Storage;
  private cache: string = '';

  private reinitCache() {
    this.cache = this.storage.getItem(SearchHistoryWrapper.search) || '';
  }

  private pasteCache() {
    this.storage.setItem(SearchHistoryWrapper.search, this.cache);
  }

  constructor(storage: Storage) {
    this.storage = storage;
    this.reinitCache();
  }

  add(query: string): boolean {
    this.cache = query;
    this.pasteCache();
    return true;
  }

  getSearch(): string {
    return this.cache;
  }
}

export const defaultSearchHistoryWrapper: SearchHistoryWrapper =
  new SearchHistoryWrapper(window.localStorage);
