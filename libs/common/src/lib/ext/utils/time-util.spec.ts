import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep, sleepRandom } from './time-util';

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve after the specified duration', async () => {
    const spy = vi.fn();
    const promise = sleep(100).then(spy);
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    await promise;
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should resolve immediately for 0ms', async () => {
    const promise = sleep(0);
    vi.advanceTimersByTime(0);
    await promise;
  });
});

describe('sleepRandom', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should sleep for a random duration within the default range', async () => {
    const promise = sleepRandom();
    vi.advanceTimersByTime(17);
    await promise;
  });

  it('should sleep for a random duration within a custom range', async () => {
    const promise = sleepRandom(100, 200);
    vi.advanceTimersByTime(200);
    await promise;
  });
});
