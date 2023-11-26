import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Custom404 from './404';

describe('NotFound tests', async () => {
  screen.debug();
  it('Main test for not found page', async () => {
    render(<Custom404 />);

    await screen.findByRole('NotFoundContainer');

    const a = screen.getByRole('NotFoundLink');
    expect(a).toHaveProperty('href');
    expect(a.getAttribute('href')).toBe('/');
  });
});
