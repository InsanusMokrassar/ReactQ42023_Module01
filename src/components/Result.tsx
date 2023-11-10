import React, { ReactNode, useContext } from 'react';
import './RecentSearches.css';
import { GithubRepository } from '../utils/api/GithubApi';
import './Result.css';
import { AppContext, AppContextType } from '../AppContext';

export function Result({
  state,
  onClick,
}: {
  state: GithubRepository;
  onClick: () => void;
}): ReactNode {
  return (
    <div
      key={state.url}
      className={'github_repository_result_container'}
      onClick={(e) => {
        e.stopPropagation(); // prevent propagation to already opened github repo loader
        onClick();
      }}
    >
      <h3>{state.full_name}</h3>
      <div>{state.description}</div>
      <div>{state.url}</div>
    </div>
  );
}

export default function Results({
  onItemClicked,
}: {
  onItemClicked: (repo: GithubRepository) => void;
}): ReactNode {
  const { results } = useContext<AppContextType>(AppContext);
  return (
    <div className={'github_repository_results_container'}>
      {(results?.items || []).map((repo) => (
        <Result
          key={repo.url}
          state={repo}
          onClick={() => onItemClicked(repo)}
        />
      ))}
    </div>
  );
}
