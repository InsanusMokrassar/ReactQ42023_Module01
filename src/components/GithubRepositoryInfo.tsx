import { GithubRepository } from '../utils/api/GithubApi';
import React, { ReactNode } from 'react';

export default function GithubRepositoryInfo({
  info,
  outletRef,
}: {
  info: GithubRepository;
  outletRef: React.RefObject<HTMLDivElement>;
}): ReactNode {
  return (
    <div
      role={'github_repository_info'}
      className={'github_repository_info'}
      ref={outletRef}
    >
      <h3>{info.full_name}</h3>
      <div>{info.description}</div>
      <div>{info.url}</div>
      {info.language !== undefined ? (
        <div>Language: {info.language}</div>
      ) : (
        <></>
      )}
      {info.stargazers_count !== undefined ? (
        <div>⭐ {info.stargazers_count}</div>
      ) : (
        <></>
      )}
      {info.forks_count !== undefined ? <div>⑂ {info.forks_count}</div> : <></>}
      {info.watchers_count !== undefined ? (
        <div>👀 {info.watchers_count}</div>
      ) : (
        <></>
      )}
    </div>
  );
}
