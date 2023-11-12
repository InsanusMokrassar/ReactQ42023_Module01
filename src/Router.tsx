import { createBrowserRouter } from 'react-router-dom';
import MainComponent from './MainComponent';
import GithubRepositoryLoader from './components/GithubRepositoryLoader';
import NotFound from './NotFound';
import React from 'react';

export const routerConfig = [
  {
    path: '/',
    element: <MainComponent />,
    children: [
      {
        path: '/github/:username/:repo',
        element: <GithubRepositoryLoader />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routerConfig);
