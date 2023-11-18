import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from './Navigation';

describe('Navigation tests', () => {
  const testTotalCount = 100500;
  const pages = Math.ceil(testTotalCount / 10);
  it('It is possible to go to the last page', async () => {
    const rendered = render(
      <Navigation
        page={5}
        count={10}
        onSetPage={(page: number) => {
          expect(page).toBe(pages);
        }}
        wholeObjectsAmount={testTotalCount}
      />
    );

    const lastButton = await rendered.findByRole('navigation_to_last');
    await userEvent.click(lastButton);
  });
  it('It is possible to go to the first page', async () => {
    const rendered = render(
      <Navigation
        page={5}
        count={10}
        onSetPage={(page: number) => {
          expect(page).toBe(0);
        }}
        wholeObjectsAmount={testTotalCount}
      />
    );

    const lastButton = await rendered.findByRole('navigation_to_first');
    await userEvent.click(lastButton);
  });
  it('It is possible to go to the next page', async () => {
    const initialPage = 5;
    const rendered = render(
      <Navigation
        page={initialPage}
        count={10}
        onSetPage={(page: number) => {
          expect(page).toBe(initialPage + 1);
        }}
        wholeObjectsAmount={testTotalCount}
      />
    );

    const lastButton = await rendered.findByRole('navigation_to_next');
    await userEvent.click(lastButton);
  });
  it('It is possible to go to the previous page', async () => {
    const initialPage = 5;
    const rendered = render(
      <Navigation
        page={initialPage}
        count={10}
        onSetPage={(page: number) => {
          expect(page).toBe(initialPage - 1);
        }}
        wholeObjectsAmount={testTotalCount}
      />
    );

    const lastButton = await rendered.findByRole('navigation_to_previous');
    await userEvent.click(lastButton);
  });

  afterEach(() => {
    cleanup();
  });
});
