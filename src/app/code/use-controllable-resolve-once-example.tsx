import type { FC } from 'react';
import { useState } from 'react';

import { useControllableResolve } from 'use-controllable-resolve';

export const UseControllableResolveOnceExample: FC = () => {
  const controllableResolve = useControllableResolve<number>({
    // once the waitResolved promise be resolved, that will keep that resolve promise until you call reset method manually.
    once: true,
  });
  const { waitResolved, resolve, reset } = controllableResolve;

  const [resolvedList, setResolvedList] = useState<string[]>([]);

  return (
    <>
      <div>
        {resolvedList.map((resolvedListItem, i) => {
          return (
            <div key={i}>
              {i + 1}. {resolvedListItem} 🚀
            </div>
          );
        })}
      </div>
      <div>
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
            reset();
            setResolvedList([]);
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
};
