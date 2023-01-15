import { createControllableResolve } from './controllable-resolve';

describe('[createControllableResolve] main logic', () => {
  it('basic logic work correctly', async () => {
    const current = createControllableResolve();

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
    const current = createControllableResolve<number>();

    const resolveFn = vi.fn();

    current.waitResolved().then(resolveFn);
    current.resolve(100);

    await Promise.resolve();
    expect(resolveFn).toBeCalledWith(100);
  });

  it('when have multiple wait, all can be trigger once resolve', async () => {
    const current = createControllableResolve();

    const resolveFn = vi.fn();

    current.waitResolved().then(resolveFn);
    current.waitResolved().then(resolveFn);
    current.waitResolved().then(resolveFn);
    current.resolve();

    await Promise.resolve();
    expect(resolveFn).toBeCalledTimes(3);
  });

  it('after cancel, do resolve will not trigger resolve anymore', async () => {
    const current = createControllableResolve();

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
    const current = createControllableResolve({ ignorePrevious: true });

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
    const current = createControllableResolve();

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
    const current = createControllableResolve({
      onWaitingChange: onWaitingChangeFn,
    });

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
    const current = createControllableResolve({ once: true });

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
    const current = createControllableResolve({ once: true });

    const resolveFn = vi.fn();

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

  it('turn on `once` option and can get value from that controllableResolve', async () => {
    const current = createControllableResolve<number>({ once: true });
    const spy = vi.spyOn(console, 'warn');

    expect(current.value).toBeUndefined();

    current.waitResolved();

    current.resolve(100);

    expect(current.value).toBe(100);

    current.resolve(200);
    // still be 100, and show warning
    expect(current.value).toBe(100);
    expect(spy).toBeCalledWith(
      '[createResolve] there have set `once` option, and that promise be completed, not need resolve again.'
    );

    // when not be `once` mode should never get value with that controllableResolve

    expect(current.value).toBe(100);
    expect(spy).toBeCalledWith(
      '[createResolve] there have set `once` option, and that promise be completed, not need resolve again.'
    );
  });

  it('when not be `once` mode should never get value with that controllableResolve', async () => {
    const current = createControllableResolve<number>();
    const spy = vi.spyOn(console, 'warn');

    expect(current.value).toBeUndefined();
    expect(spy).toBeCalledWith(
      '[createResolve] resolve value only work when `once` be true, not supported normal mode.'
    );

    current.waitResolved();

    current.resolve(100);

    expect(current.value).toBeUndefined();

    current.resolve(200);
    // still be 100, and show warning
    expect(current.value).toBeUndefined();

    expect(spy.mock.calls).toEqual([
      [
        '[createResolve] resolve value only work when `once` be true, not supported normal mode.',
      ],
      [
        '[createResolve] resolve value only work when `once` be true, not supported normal mode.',
      ],
      [
        '[createResolve] promise still not be created, please do waitResolved before resolve',
      ],
      [
        '[createResolve] resolve value only work when `once` be true, not supported normal mode.',
      ],
    ]);

    expect(spy).not.toBeCalledWith(
      '[createResolve] there have set `once` option, and that promise be completed, not need resolve again.'
    );
  });
});

describe('[createControllableResolve] console warning', () => {
  it('call resolve or cancel before waitResolved should show warn in console', async () => {
    const spy = vi.spyOn(console, 'warn');

    const current = createControllableResolve();

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

    const current = createControllableResolve({ once: true });

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
