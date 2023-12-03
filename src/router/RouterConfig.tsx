import React from 'react';
import Main from '../pages/Main';
import ControlledForm from '../pages/ControlledForm';

export const routerConfig = [
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/controlled',
        element: <ControlledForm />,
      },
    ],
  },
];
