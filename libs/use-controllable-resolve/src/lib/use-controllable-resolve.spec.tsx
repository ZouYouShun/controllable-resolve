import { renderHook } from '@testing-library/react';

import type { UseControllableResolveOptions } from './use-controllable-resolve';
import { useControllableResolve } from './use-controllable-resolve';

describe('[useControllableResolve] main logic', () => {
  it('basic logic work correctly', async () => {
    const { result } = renderHook(() => useControllableResolve());

    const current = result.current;
    expect(current.waitResolved).toBeDefined();
    expect(current.cancel).toBeDefined();
    expect(current.resolve).toBeDefined();
    expect(current.waiting).toBeDefined();
    const resolveFn = vi.fn();

    current.waitResolved().then(resolveFn);
    current.resolve();

    await Promise.resolve();
    expect(resolveFn).toBeCalled();
  });
  it('resolve value can be get in waitResolved .then callback', async () => {
    const { result } = renderHook(() => useControllableResolve<number>());

    const current = result.current;
    const resolveFn = vi.fn();

    current.waitResolved().then(resolveFn);
    current.resolve(100);

    await Promise.resolve();
    expect(resolveFn).toBeCalledWith(100);
  });

  it('when have multiple wait, all can be trigger once resolve', async () => {
    const { result } = renderHook(() => useControllableResolve());

    const current = result.current;
    const resolveFn = vi.fn();

    current.waitResolved().then(resolveFn);
    current.waitResolved().then(resolveFn);
    current.waitResolved().then(resolveFn);
    current.resolve();

    await Promise.resolve();
    expect(resolveFn).toBeCalledTimes(3);
  });

  it('after cancel, do resolve will not trigger resolve anymore', async () => {
    const { result } = renderHook(() => useControllableResolve());

    const current = result.current;
    const resolveFn = vi.fn();

    current.waitResolved().then(resolveFn);
    current.cancel();
    await Promise.resolve();
    expect(resolveFn).not.toBeCalled();

    current.resolve();
    await Promise.resolve();
    expect(resolveFn).not.toBeCalled();
  });

  it('turn on `ignorePrevious`, when have multiple wait, only latest onc waitResolved be trigger', async () => {
    const { result } = renderHook(() =>
      useControllableResolve({ ignorePrevious: true })
    );

    const current = result.current;
    const resolveFn = vi.fn();
    const lastResolveFn = vi.fn();

    current.waitResolved().then(resolveFn);
    current.waitResolved().then(resolveFn);
    current.waitResolved().then(lastResolveFn);
    current.resolve();

    await Promise.resolve();
    expect(resolveFn).not.toBeCalled();
    expect(lastResolveFn).toBeCalledTimes(1);
  });

  it('get waiting state be correctly', async () => {
    const { result } = renderHook(() => useControllableResolve());

    const current = result.current;

    expect(current.waiting()).toBeFalsy();

    current.waitResolved();
    expect(current.waiting()).toBeTruthy();

    current.resolve();
    expect(current.waiting()).toBeFalsy();

    current.waitResolved();
    expect(current.waiting()).toBeTruthy();

    current.cancel();
    expect(current.waiting()).toBeFalsy();
  });

  it('`onWaitingChange` be called when state change', async () => {
    const onWaitingChangeFn = vi.fn();
    const { result } = renderHook(() =>
      useControllableResolve({ onWaitingChange: onWaitingChangeFn })
    );

    const current = result.current;

    expect(onWaitingChangeFn).not.toBeCalled();

    current.waitResolved();
    expect(onWaitingChangeFn).toBeCalledWith(true);
    onWaitingChangeFn.mockReset();
    // when call again, state be same, not trigger anymore
    current.waitResolved();
    expect(onWaitingChangeFn).not.toBeCalled();

    current.resolve();
    expect(onWaitingChangeFn).toBeCalledWith(false);

    current.waitResolved();
    expect(onWaitingChangeFn).toBeCalledWith(true);

    current.cancel();
    expect(onWaitingChangeFn).toBeCalledWith(false);
  });

  it('turn on `once` option, that wait promise will emit result directly after resolved once', async () => {
    const { result } = renderHook(() => useControllableResolve({ once: true }));

    const current = result.current;
    const resolveFn = vi.fn();

    current.waitResolved().then(resolveFn);
    current.resolve();

    await Promise.resolve();
    expect(resolveFn).toBeCalled();

    resolveFn.mockReset();
    expect(resolveFn).not.toBeCalled();

    current.waitResolved().then(resolveFn);
    current.waitResolved().then(resolveFn);
    current.waitResolved().then(resolveFn);
    await Promise.resolve();
    expect(resolveFn).toBeCalledTimes(3);
  });

  it('turn on `once` option and resolve and cancel before wait then resolved, then wait again, once still work with emit result directly', async () => {
    const { result } = renderHook(() => useControllableResolve({ once: true }));

    const resolveFn = vi.fn();

    const current = result.current;
    current.cancel();
    current.resolve();
    expect(resolveFn).not.toBeCalled();

    current.waitResolved().then(resolveFn);
    current.resolve();
    await Promise.resolve();
    expect(resolveFn).toBeCalled();

    resolveFn.mockReset();
    current.waitResolved().then(resolveFn);
    await Promise.resolve();
    expect(resolveFn).toBeCalled();
  });
});

describe('[useControllableResolve] console warning', () => {
  it('`ignorePrevious` should not change after first render, should show error in console', async () => {
    const spy = vi.spyOn(console, 'error');

    const { rerender } = renderHook((options: UseControllableResolveOptions) =>
      useControllableResolve(options)
    );

    rerender({
      ignorePrevious: true,
    });

    expect(spy).toBeCalled();
  });

  it('call resolve or cancel before waitResolved should show warn in console', async () => {
    const spy = vi.spyOn(console, 'warn');

    const { result } = renderHook(() => useControllableResolve());

    const current = result.current;
    current.cancel();
    expect(spy).toBeCalledTimes(1);
    current.cancel();
    expect(spy).toBeCalledTimes(2);
    current.resolve();
    expect(spy).toBeCalledTimes(3);
    current.resolve();
    expect(spy).toBeCalledTimes(4);
  });

  it('turn on `once` option, call resolve or cancel after resolve will show warning with `[createResolve] there have set `once` option, and that promise be completed, not need cancel again.` ', async () => {
    const spy = vi.spyOn(console, 'warn');

    const { result } = renderHook(() => useControllableResolve({ once: true }));

    const current = result.current;
    current.waitResolved();
    current.resolve();

    expect(spy).not.toBeCalled();
    current.resolve();

    expect(spy).toBeCalledWith(
      '[createResolve] there have set `once` option, and that promise be completed, not need resolve again.'
    );

    current.cancel();
    expect(spy).toBeCalledWith(
      '[createResolve] there have set `once` option, and that promise be completed, not need cancel again.'
    );
  });
});
