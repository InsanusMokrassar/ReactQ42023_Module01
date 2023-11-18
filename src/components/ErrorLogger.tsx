import React, { ReactNode } from 'react';
import ErrorBoundary from '../ErrorBoundary';

export default function ErrorLogger({}: object): ReactNode {
  if (ErrorBoundary.LatestError === undefined) {
    return <></>;
  } else {
    return (
      <div>
        <p role={'error_logger_name'}>{ErrorBoundary.LatestError.name}</p>
        <p role={'error_logger_message'}>{ErrorBoundary.LatestError.message}</p>
        <p role={'error_logger_stack'}>{ErrorBoundary.LatestError.stack}</p>
      </div>
    );
  }
}
