import { ReactNode } from 'react';

export default function NotFound(): ReactNode {
  return (
    <div>
      Sorry, but this page do not exists in the app. Please, follow to{' '}
      <a href={'/'}>this</a> link to continue usage of site
    </div>
  );
}
