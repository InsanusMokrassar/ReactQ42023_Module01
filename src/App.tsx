import { useState } from 'react';
import './App.css';
import Search from './components/Search';
import SearchPanel from './components/SearchPanel';
import ResentSearches from './components/RecentSearches';
import { defaultSearchHistoryWrapper } from './utils/SearchHistoryWrapper';

function App() {
  const [searchState, searchStateChange] = useState('');
  const [recentSearches, onSetResentSearches] = useState<Array<string>>(
    defaultSearchHistoryWrapper.getHistory()
  );

  function updateRecentSearches() {
    onSetResentSearches(defaultSearchHistoryWrapper.getHistory());
  }

  function doSearch(query: string) {
    defaultSearchHistoryWrapper.add(query);
    updateRecentSearches();
  }

  return (
    <>
      <div className="main_container">
        <div></div>
        <div className="main_content">
          <SearchPanel onSubmit={() => doSearch(searchState)}>
            <Search state={searchState} onChange={searchStateChange} />
          </SearchPanel>
        </div>
        <ResentSearches
          state={recentSearches}
          onSelect={(query) => searchStateChange(query)}
        />
      </div>
    </>
  );
}

export default App;
