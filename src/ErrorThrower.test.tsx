import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ErrorThrower from './ErrorThrower';

describe('ErrorThrower', async () => {
  screen.debug();
  afterEach(() => {
    cleanup();
  });
  it('Nothing throwed when throw is false', async () => {
    const rendered = render(
      <ErrorThrower throwError={false} onSetErrorToThrow={() => {}} />
    );
    expect(rendered.getByRole('error_thrower_button')).toBeTruthy();
  });
  it('Throwing when throw is true', async () => {
    try {
      render(<ErrorThrower throwError={true} onSetErrorToThrow={() => {}} />);
    } catch (e) {
      expect((e as Error)?.message).toBe('It is sample error');
    }
  });
});
