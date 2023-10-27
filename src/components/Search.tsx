import React, { ReactNode } from 'react';

export default function Search({
  state,
  onChange,
}: {
  state: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}): ReactNode {
  return (
    <input
      type="text"
      value={state}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
    ></input>
  );
}
