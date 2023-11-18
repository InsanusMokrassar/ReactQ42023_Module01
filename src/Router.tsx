import { createBrowserRouter } from 'react-router-dom';
import MainComponent from './MainComponent';
import GithubRepositoryLoader from './components/GithubRepositoryLoader';
import NotFound from './NotFound';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/Store';

export const routerConfig = [
  {
    path: '/',
    element: (
      <Provider store={store}>
        {' '}
        <MainComponent />
      </Provider>
    ),
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
