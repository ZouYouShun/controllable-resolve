export type CreateControllableResolveOptions = {
  /**
   * if that be `true`, when `waitResolved` will ignore previous one,
   * @default false
   */
  ignorePrevious?: boolean;
  /**
   * once the `waitResolved` promise be resolved, that will keep that resolve promise until you call `reset` method manually.
   * @default false
   */
  once?: boolean;
  /**
   * be triggered when promise waiting state change
   */
  onWaitingChange?: (state: boolean) => void;
};

/**
 * that provide a waitResolve instance for you can control when to resolve promise.
 */
export function createControllableResolve<T = void>({
  ignorePrevious = false,
  once = false,
  onWaitingChange,
}: CreateControllableResolveOptions = {}) {
  let keep: {
    promise?: Promise<T>;
    resolve?: (value: T | PromiseLike<T>) => void;
    value?: T;
  } = {};

  let waiting = false;

  const setWaiting = (state: boolean) => {
    if (waiting !== state) {
      onWaitingChange?.(state);
    }

    waiting = state;
  };

  function reset() {
    if (!once) {
      keep = {};
    }

    // when promise exist, clear resolve to mark that be completely
    else if (keep.promise) {
      keep.resolve = undefined;
    }
    setWaiting(false);
  }

  return {
    /**
     * resolve `waitResolved` promise, this method need be call after `waitResolved`
     */
    resolve(value: T) {
      if (process.env.NODE_ENV !== 'production') {
        if (!keep.promise) {
          console.warn(
            '[createResolve] promise still not be created, please do waitResolved before resolve'
          );
        }
        if (once && keep.promise && !keep.resolve) {
          console.warn(
            '[createResolve] there have set `once` option, and that promise be completed, not need resolve again.'
          );
        }
      }

      if (keep.resolve) {
        keep.resolve(value);

        if (once) keep.value = value;
      }

      reset();
    },
    /**
     * cancel waitResolve when you not need wait anymore,
     * this method need be call after `waitResolved`
     */
    cancel() {
      if (process.env.NODE_ENV !== 'production') {
        if (!keep.promise) {
          console.warn(
            '[createResolve] promise still not be created, please do waitResolved before cancel'
          );
        }
        if (once && keep.promise && !keep.resolve) {
          console.warn(
            '[createResolve] there have set `once` option, and that promise be completed, not need cancel again.'
          );
        }
      }

      reset();
    },
    /**
     * create a wait resolved promise for you can control when to resolve promise
     */
    waitResolved() {
      if (once && keep.promise && !keep.resolve) {
        return keep.promise;
      }

      if (ignorePrevious) {
        keep = {};
      }

      if (!keep.promise) {
        keep.promise = new Promise<T>((resolve) => (keep.resolve = resolve));
      }

      setWaiting(true);
      return keep.promise;
    },
    /**
     * is there have promise be waiting
     */
    get waiting() {
      return waiting;
    },
    /**
     * when you use `once` mode, use to clear those keep promise and resolve value.
     */
    reset() {
      keep = {};
      reset();
    },
    /**
     * when you use `once` mode, that value be keep inside the promise result
     */
    get value() {
      if (process.env.NODE_ENV !== 'production' && !once) {
        console.warn(
          '[createResolve] resolve value only work when `once` be true, not supported normal mode.'
        );
      }

      return keep.value;
    },
  };
}
