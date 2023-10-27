import React, { FormEvent, ReactNode } from 'react';

export default function SearchPanel({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit: () => void;
}): ReactNode {
  function onPreSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form>
      {children}
      <input type="submit" onClick={onPreSubmit} />
    </form>
  );
}
