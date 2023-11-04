import { GithubRepository } from '../utils/api/GithubApi';
import React, { ReactNode } from 'react';
import './GithubRepositoryInfo.css';

export default function GithubRepositoryInfo({
  info,
}: {
  info: GithubRepository;
}): ReactNode {
  return (
    <div className={'github_repository_info'}>
      <h3>{info.full_name}</h3>
      <div>{info.description}</div>
      <div>{info.url}</div>
      {info.language ? <div>Language: {info.language}</div> : <></>}
      {info.stargazers_count ? <div>⭐ {info.stargazers_count}</div> : <></>}
      {info.forks_count ? <div>⑂ {info.forks_count}</div> : <></>}
      {info.watchers_count ? <div>👀 {info.watchers_count}</div> : <></>}
    </div>
  );
}
