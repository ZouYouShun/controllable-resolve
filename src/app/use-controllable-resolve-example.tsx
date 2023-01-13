import type { FC } from 'react';
import { useState } from 'react';

import { useControllableResolve } from 'use-controllable-resolve';

export const UseControllableResolveExample: FC = () => {
  const controllableResolve = useControllableResolve<number>();
  const { waitResolved, resolve, cancel, reset } = controllableResolve;

  const [resolvedList, setResolvedList] = useState<string[]>([]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex gap-4 mt-4 w-full max-h-[200px]">
        <div className="flex-auto overflow-auto">
          {resolvedList.map((resolvedListItem, i) => {
            return (
              <div key={i}>
                {i + 1}. {resolvedListItem} 🚀
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="button button-primary"
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
            className="button button-secondary"
            onClick={() => {
              resolve(100);
            }}
          >
            Resolve
          </button>
          <button
            className="button button-secondary"
            onClick={() => {
              cancel();
            }}
          >
            Cancel
          </button>
          <button
            className="button button-secondary"
            onClick={() => {
              reset();
              setResolvedList([]);
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
