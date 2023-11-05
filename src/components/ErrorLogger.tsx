import React, { ReactNode } from 'react';
import ErrorBoundary from '../ErrorBoundary';

export default function ErrorLogger({}: object): ReactNode {
  if (ErrorBoundary.LatestError === undefined) {
    return <></>;
  } else {
    return (
      <div>
        <p>{ErrorBoundary.LatestError.name}</p>
        <p>{ErrorBoundary.LatestError.message}</p>
        <p>{ErrorBoundary.LatestError.stack}</p>
      </div>
    );
  }
}
