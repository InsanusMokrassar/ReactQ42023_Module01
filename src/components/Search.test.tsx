import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Search from './Search';
import userEvent from '@testing-library/user-event';

describe('Search tests', async () => {
  screen.debug();
  it('Main test for search page', async () => {
    const state = 'test state';
    const changedStateSuffix = ' changed';
    const changedState = state + changedStateSuffix;
    let latestInput = '';
    const onStateChange = (newState: string) => {
      latestInput = newState;
    };
    render(<Search state={state} onChange={onStateChange} />);

    await screen.findByRole('SearchInput');

    const input = screen.getByRole('SearchInput');

    expect(input.getAttribute('value')).toBe(state);
    await userEvent.click(input);
    await userEvent.paste(changedStateSuffix);
    expect(latestInput).toBe(changedState);
    expect(input.getAttribute('value')).toBe(state);
  });
});
