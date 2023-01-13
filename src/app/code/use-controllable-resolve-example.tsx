import type { FC } from 'react';
import { useState } from 'react';

import { useControllableResolve } from 'use-controllable-resolve';

export const UseControllableResolveExample: FC = () => {
  const controllableResolve = useControllableResolve<number>();
  const { waitResolved, resolve, cancel, reset } = controllableResolve;

  const [resolvedList, setResolvedList] = useState<string[]>([]);

  return (
    <>
      <>
        {resolvedList.map((resolvedListItem, i) => {
          return (
            <div key={i}>
              {i + 1}. {resolvedListItem}
            </div>
          );
        })}
      </>
      <>
        <button
          onClick={() => {
            waitResolved().then((value) => {
              console.log('🚀 ~ value', value);
              setResolvedList((list) => [...list, 'resolved']);
            });
          }}
        >
          Start
        </button>
        <button
          onClick={() => {
            resolve(100);
          }}
        >
          Resolve
        </button>
        <button
          onClick={() => {
            cancel();
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            reset();
            setResolvedList([]);
          }}
        >
          Reset
        </button>
      </>
    </>
  );
};
