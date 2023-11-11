import React, { ReactNode } from 'react';

export default function Search({
  state,
  onChange,
}: {
  state: string;
  onChange: (change: string) => void;
}): ReactNode {
  return (
    <input
      role={'SearchInput'}
      type="text"
      value={state}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
    ></input>
  );
}
