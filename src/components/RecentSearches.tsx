import React, { ReactNode } from 'react';
import './RecentSearches.css';

function ResentSearch({
  state,
  onSelect,
}: {
  state: string;
  onSelect: () => void;
}) {
  return (
    <div key={state}>
      <button className={'recent_search-item'} onClick={onSelect}>
        {state}
      </button>
    </div>
  );
}

export default function ResentSearches({
  state,
  onSelect,
}: {
  state: Array<string>;
  onSelect: (query: string) => void;
}): ReactNode {
  return (
    <div>
      <h3>Recent searches</h3>
      {state.map((element) =>
        ResentSearch({ state: element, onSelect: () => onSelect(element) })
      )}
    </div>
  );
}
