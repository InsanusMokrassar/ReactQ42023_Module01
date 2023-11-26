import React, { ReactNode, useEffect, useState } from 'react';

export default function ErrorThrower({
  throwError,
  onSetErrorToThrow,
}: {
  throwError: boolean;
  onSetErrorToThrow: (set: boolean) => void;
}): ReactNode {
  const [doSkipError, setDoSkipError] = useState(false);
  useEffect(() => {
    switch (true) {
      case throwError && !doSkipError:
        setDoSkipError(true);
        break;
      case !throwError:
        setDoSkipError(false);
        break;
      default:
        break;
    }
  }, [setDoSkipError, doSkipError, throwError]);
  switch (true) {
    case throwError && !doSkipError:
      onSetErrorToThrow(false);
      throw new Error('It is sample error');
    default:
      break;
  }
  return (
    <button
      onClick={() => {
        onSetErrorToThrow(true);
      }}
      role={'error_thrower_button'}
    >
      Push to force the error
    </button>
  );
}
