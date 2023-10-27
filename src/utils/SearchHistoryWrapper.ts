// class SearchHistoryWrapper {
//   public static searchHistoryKey: string = 'search_history';
//   public static defaultInstance: SearchHistoryWrapper =
//     new SearchHistoryWrapper(window.localStorage);
//   private storage: Storage;
//   private cache: Array<string> = [];
//
//   private reinitCache() {
//     this.cache = JSON.parse(
//       this.storage.getItem(SearchHistoryWrapper.searchHistoryKey) || '[]'
//     );
//   }
//
//   private pasteCache() {
//     this.storage.setItem(
//       SearchHistoryWrapper.searchHistoryKey,
//       JSON.stringify(this.cache)
//     );
//   }
//
//   constructor(storage: Storage) {
//     this.storage = storage;
//     this.reinitCache();
//   }
//
//   add(query: string): boolean {
//     if (this.cache.includes(query)) {
//       return false;
//     } else {
//       this.cache.push(query);
//       this.pasteCache();
//     }
//     return true;
//   }
//
//   getHistory(): Array<string> {
//     return [...this.cache];
//   }
// }
