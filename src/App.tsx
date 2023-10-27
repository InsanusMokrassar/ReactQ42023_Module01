import { useState } from 'react';
import './App.css';
import Search from './components/Search';
import SearchPanel from './components/SearchPanel';
import { defaultSearchHistoryWrapper } from './utils/SearchHistoryWrapper';
import { GithubRepository, DefaultGitHubAPI } from './utils/api/github_api';
import Results from './components/Result';

let didFirstLoad = false;

function App() {
  const [recentSearches, onSetResentSearches] = useState<Array<string>>(
    defaultSearchHistoryWrapper.getHistory()
  );
  const [searchState, searchStateChange] = useState(
    recentSearches.length > 0 ? recentSearches[recentSearches.length - 1] : ''
  );
  const [results, setResults] = useState<Array<GithubRepository>>([]);

  function updateRecentSearches() {
    onSetResentSearches(defaultSearchHistoryWrapper.getHistory());
  }

  function doSearch(query: string = searchState) {
    defaultSearchHistoryWrapper.add(query);
    updateRecentSearches();
    DefaultGitHubAPI.search(query).then((result) => setResults(result));
  }

  if (!didFirstLoad) {
    didFirstLoad = true;
    doSearch();
  }

  return (
    <>
      <div className="main_container">
        <div></div>
        <div className="main_content">
          <SearchPanel onSubmit={() => doSearch()}>
            <Search state={searchState} onChange={searchStateChange} />
          </SearchPanel>
          <Results state={results} />
        </div>
      </div>
    </>
  );
}

export default App;
