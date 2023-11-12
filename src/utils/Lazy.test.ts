import { describe, expect, it } from 'vitest';
import lazy from './Lazy';

describe('Lazy tests', () => {
  it('Test that value is not initialized before first call', () => {
    let lazyCalled: boolean = false;
    lazy<boolean>(() => {
      lazyCalled = true;
      return lazyCalled;
    });
    expect(lazyCalled).toBe(false);
  });
  it('Test that value is initialized after first call', () => {
    let lazyCalled: boolean = false;
    expect(
      lazy<boolean>(() => {
        lazyCalled = true;
        return lazyCalled;
      })()
    ).toBe(true);
    expect(lazyCalled).toBe(true);
  });
  it('Test that value is calculated once after first call', () => {
    let called: number = 0;
    const lazyFun = lazy(() => {
      called++;
      return called;
    });
    expect(lazyFun()).toBe(1);
    expect(called).toBe(1);
    expect(lazyFun()).toBe(1);
    expect(called).toBe(1);
  });
});
