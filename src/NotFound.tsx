import { ReactNode } from 'react';

export default function NotFound(): ReactNode {
  return (
    <div role={'NotFoundContainer'}>
      Sorry, but this page do not exists in the app. Please, follow to{' '}
      <a role={'NotFoundLink'} href={'/'}>
        this
      </a>{' '}
      link to continue usage of site
    </div>
  );
}
