import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorLogger from './ErrorLogger';
import ErrorBoundary from '../ErrorBoundary';

describe('ErrorLogger tests', () => {
  it('Test that ErrorLogger correctly showing parameters', async () => {
    const testError: Error = new Error('test message');
    ErrorBoundary.LatestError = testError;
    render(<ErrorLogger />);

    expect((await screen.findByRole('error_logger_name')).innerHTML).toBe(
      testError.name
    );
    expect((await screen.findByRole('error_logger_message')).innerHTML).toBe(
      testError.message
    );
    expect((await screen.findByRole('error_logger_stack')).innerHTML).toBe(
      testError.stack
    );
  });
});
