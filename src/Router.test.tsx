import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routerConfig } from './Router';

describe('All tests related to router work', () => {
  window = Object.create(window);
  const url = 'http://test.com/asd';
  Object.defineProperty(window, 'location', {
    value: {
      href: url,
    },
    writable: true, // possibility to override
  });
  afterEach(() => {
    cleanup();
  });
  it('Ensure that the 404 page is displayed when navigating to an invalid route.', async () => {
    const localRouter = createMemoryRouter(routerConfig, {
      initialEntries: ['/test'],
    });
    render(<RouterProvider router={localRouter} />);

    expect(await screen.findByRole('NotFoundContainer')).toBeTruthy();
  });
});
