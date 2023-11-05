import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainComponent from './MainComponent';
import GithubRepositoryLoader from './components/GithubRepositoryLoader';

const router = createBrowserRouter([
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
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
