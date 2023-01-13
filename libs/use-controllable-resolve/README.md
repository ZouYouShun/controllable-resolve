# use-controllable-resolve

![](https://github.com/ZouYouShun/controllable-resolve/actions/workflows/main-merge.yml/badge.svg)
![](https://github.com/ZouYouShun/controllable-resolve/actions/workflows/npm-publish.yml/badge.svg)
[![npm](https://img.shields.io/npm/v/controllable-resolve.svg)](https://www.npmjs.com/package/use-controllable-resolve)
![license](https://img.shields.io/npm/l/use-controllable-resolve)

[Example](https://zouyoushun.github.io/controllable-resolve/)

A hook to use [controllable-resolve](https://github.com/ZouYouShun/controllable-resolve) as a React hook to create a simple controllable promise resolve let you can control when to resolve promise

## Installation

```bash
npm install use-controllable-resolve
```

## API

### useControllableResolve

```tsx
import type { FC } from 'react';

import { useControllableResolve } from 'use-controllable-resolve';

export const UseControllableResolveExample: FC = () => {
  const controllableResolve = useControllableResolve<number>();
  const { waitResolved, resolve } = controllableResolve;

  return (
    <>
      <button
        onClick={() => {
          waitResolved().then((value) => {
            console.log('🚀 ~ value', value);
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
    </>
  );
};
```

### UseControllableResolve options

| field             | default | type                      | description                                                                                                              |
| ----------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `ignorePrevious`  | `false` | `boolean`                 | if that be `true`, when `waitResolved` will ignore previous one,                                                         |
| `once`            | `false` | `boolean`                 | once the `waitResolved` promise be resolved, that will keep that resolve promise until you call `reset` method manually. |
| `onWaitingChange` | -       | `(state:boolean) => void` | be triggered when promise waiting state change                                                                           |
