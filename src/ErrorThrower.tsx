import React, { ReactNode } from 'react';

let doSkipError = false;

export default function ErrorThrower({
  throwError,
  onSetErrorToThrow,
}: {
  throwError: boolean;
  onSetErrorToThrow: (set: boolean) => void;
}): ReactNode {
  switch (true) {
    case throwError && !doSkipError:
      doSkipError = true;
      onSetErrorToThrow(false);
      throw new Error('It is sample error');
    case !throwError:
      doSkipError = false;
      break;
    default:
      break;
  }
  return (
    <button
      onClick={() => {
        onSetErrorToThrow(true);
      }}
    >
      Push to force the error
    </button>
  );
}
