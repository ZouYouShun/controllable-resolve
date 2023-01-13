/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect } from 'react';

import { createControllableResolve } from 'controllable-resolve';

export const CreateControllableResolveExamples = () => {
  useEffect(() => {
    // ! that just a example for how to write like vanilla JavaScript, please never write that in your React component !!!!!!!!
    console.log('bing with vanilla js way');
    const startButton = document.getElementById('start')!;
    const resolveButton = document.getElementById('resolve')!;

    const controllableResolve = createControllableResolve<number>({
      ignorePrevious: true,
      onWaitingChange(state) {
        startButton.style.display = state ? 'none' : 'block';
        resolveButton.style.display = state ? 'block' : 'none';
      },
    });
    const { waitResolved, resolve } = controllableResolve;

    const start = () => {
      waitResolved().then((value) => {
        alert(`do something with value: ${value}`);
      });
    };
    const resolveFn = () => {
      resolve(100);
    };

    startButton.addEventListener('click', start);
    resolveButton.addEventListener('click', resolveFn);

    return () => {
      startButton.removeEventListener('click', start);
      resolveButton.removeEventListener('click', resolveFn);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex gap-4">
        <button id="start" className="button button-primary">
          Start
        </button>
        <button
          id="resolve"
          className="button button-secondary"
          style={{ display: 'none' }}
        >
          Resolve
        </button>
      </div>
    </div>
  );
};
