import React, { ReactNode } from 'react';
import './RecentSearches.css';
import { GithubRepository } from '../utils/api/GithubApi';

export function Result({ state }: { state: GithubRepository }): ReactNode {
  return (
    <div key={state.url}>
      <h3>{state.full_name}</h3>
      <div>{state.description}</div>
      <div>{state.url}</div>
    </div>
  );
}

export default function Results({
  state,
}: {
  state: Array<GithubRepository>;
}): ReactNode {
  return <div>{state.map((cat) => Result({ state: cat }))}</div>;
}
