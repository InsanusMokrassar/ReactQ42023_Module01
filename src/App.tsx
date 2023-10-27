import { useState } from 'react';
import './App.css';
import Search from './components/Search';
import SearchPanel from './components/SearchPanel';

function App() {
  const [searchState, searchStateChange] = useState('');
  // const [currentResults, onSetResults] = useState<Array<SearchResult>>([]);

  return (
    <>
      <SearchPanel onSubmit={() => window.alert(searchState)}>
        <Search state={searchState} onChange={searchStateChange} />
      </SearchPanel>
    </>
  );
}

export default App;
