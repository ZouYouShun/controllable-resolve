import { useMemo, useRef } from 'react';

import type { CreateControllableResolveOptions } from 'controllable-resolve';
import { createControllableResolve } from 'controllable-resolve';

export type UseControllableResolveOptions = CreateControllableResolveOptions;

/**
 * react hook that provide a waitResolve instance for you can control when to resolve promise.
 *
 * @example
 * ```tsx
 * const { waitResolved, resolve, cancel, waiting } = useResolve<number>();
 *
 * waitResolved().then((value) => {
 *   console.log('🚀 ~ resolved', value);
 * });
 *
 *
 * resolve(100); // above will resolve 100
 *
 * cancel(); // also you can cancel wait resolve when you not need wait anymore
 * ```
 */
export function useControllableResolve<T = void>({
  ignorePrevious = false,
  once = false,
  onWaitingChange,
}: UseControllableResolveOptions = {}) {
  const ignorePreviousRef = useRef(ignorePrevious);

  if (
    process.env.NODE_ENV !== 'production' &&
    ignorePreviousRef.current !== ignorePrevious
  ) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    console.error(
      '[useResolved] ignorePrevious should not dynamic change after first execution'
    );
  }

  return useMemo(
    () =>
      createControllableResolve<T>({
        ignorePrevious: ignorePreviousRef.current,
        onWaitingChange,
        once,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}
