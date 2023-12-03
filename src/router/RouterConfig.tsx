import React from 'react';
import Main from '../pages/Main';
import ControlledForm from '../pages/ControlledForm';
import UncontrolledForm from '../pages/UncontrolledForm';

export const routerConfig = [
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/controlled',
        element: <ControlledForm />,
      },
      {
        path: '/uncontrolled',
        element: <UncontrolledForm />,
      },
    ],
  },
];
