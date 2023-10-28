import { Component } from 'react';
import './App.css';
import Search from './components/Search';
import SearchPanel from './components/SearchPanel';
import { defaultSearchHistoryWrapper } from './utils/SearchHistoryWrapper';
import { GithubRepository, DefaultGitHubAPI } from './utils/api/github_api';
import Results from './components/Result';

export default class App extends Component {
  private recentSearches: Array<string> = [];
  private searchState: string = '';
  private results: Array<GithubRepository> = [];
  private _isMounted: boolean = false;

  private doSearch(query: string = this.searchState) {
    defaultSearchHistoryWrapper.add(query);
    this.updateRecentSearches();
    DefaultGitHubAPI.search(query).then((result) => this.setResults(result));
  }

  constructor(params: object = {}) {
    super(params);
    this.updateRecentSearches();
    this.searchStateChange(
      this.searchState.length > 0
        ? this.searchState
        : this.recentSearches.length > 0
        ? this.recentSearches[this.recentSearches.length - 1]
        : ''
    );
    this.doSearch(this.searchState);
  }

  private doRefresh() {
    if (this._isMounted) {
      this.forceUpdate();
    }
  }

  private searchStateChange(newSearchState: string) {
    this.searchState = newSearchState;
    this.doRefresh();
  }

  private updateRecentSearches() {
    this.recentSearches = defaultSearchHistoryWrapper.getHistory();
    this.doRefresh();
  }

  private setResults(newResults: Array<GithubRepository>) {
    this.results = newResults;
    this.doRefresh();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { searchState, results } = this;
    return (
      <>
        <div className="main_container">
          <div></div>
          <div className="main_content">
            <SearchPanel onSubmit={() => this.doSearch()}>
              <Search
                state={searchState}
                onChange={(newState) => this.searchStateChange(newState)}
              />
            </SearchPanel>
            <Results state={results} />
          </div>
        </div>
      </>
    );
  }
}

// function App() {
//   function searchStateChange(newSearchState: string) {
//     searchState = newSearchState;
//     refreshDrawing();
//   }
//
//   function updateRecentSearches() {
//     recentSearches = defaultSearchHistoryWrapper.getHistory();
//     refreshDrawing()
//   }
//
//   function setResults(newResults: Array<GithubRepository>) {
//     results = newResults;
//     refreshDrawing()
//   }
//
//   function doSearch(query: string = searchState) {
//     defaultSearchHistoryWrapper.add(query);
//     updateRecentSearches();
//     DefaultGitHubAPI.search(query).then((result) => setResults(result));
//   }
//
//   if (!didFirstLoad) {
//     didFirstLoad = true;
//     doSearch();
//   }
//
//   return (
//     <>
//       <div className="main_container">
//         <div></div>
//         <div className="main_content">
//           <SearchPanel onSubmit={() => doSearch()}>
//             <Search state={searchState} onChange={searchStateChange} />
//           </SearchPanel>
//           <Results state={results} />
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;
