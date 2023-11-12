import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

describe('NotFound tests', async () => {
  screen.debug();
  it('Main test for not found page', async () => {
    render(<NotFound />);

    await screen.findByRole('NotFoundContainer');

    const a = screen.getByRole('NotFoundLink');
    expect(a).toHaveProperty('href');
    expect(a.getAttribute('href')).toBe('/');
  });
});
