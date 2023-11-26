import React, { ReactNode } from 'react';
import { GithubRepository } from '../models/GithubRepository';
import { GithubResponse } from '../models/GithubResponse';

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
        e.stopPropagation();
        onClick();
      }}
      role={`github_repository_result_container${state.url}`}
    >
      <h3>{state.full_name}</h3>
      <div>{state.description}</div>
      <div>{state.url}</div>
    </div>
  );
}

export default function Results({
  results,
  onItemClicked,
}: {
  results?: GithubResponse<GithubRepository>;
  onItemClicked: (repo: GithubRepository) => void;
}): ReactNode {
  return (
    <div
      role={'github_repository_results_container'}
      className={'github_repository_results_container'}
    >
      {results?.items?.length == 0 ? (
        <div role={'github_repository_results_container_empty'}>
          Sorry, but currently there is nothing to show
        </div>
      ) : (
        <></>
      )}
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
