# use-controllable-resolve

![](https://github.com/ZouYouShun/controllable-resolve/actions/workflows/main-merge.yml/badge.svg)
![](https://github.com/ZouYouShun/controllable-resolve/actions/workflows/npm-publish-use-controllable-resolve.yml/badge.svg)
[![npm](https://img.shields.io/npm/v/use-controllable-resolve.svg)](https://www.npmjs.com/package/use-controllable-resolve)
![license](https://img.shields.io/npm/l/use-controllable-resolve)

A hook to use [controllable-resolve](https://github.com/ZouYouShun/controllable-resolve) as a React hook to create a simple controllable promise resolve let you can control when to resolve promise

# Demo

- [Demo Website](https://zouyoushun.github.io/controllable-resolve/)
- [Stackblitz Online Demo](https://stackblitz.com/edit/vitejs-vite-cor8h1?file=src/UseControllableResolveExample.tsx)

## Installation

```bash
npm install use-controllable-resolve
```

## Usage

### `useControllableResolve`

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

## API

For more detail api, view on [controllable-resolve](https://github.com/ZouYouShun/controllable-resolve),
that `use-controllable-resolve` just a wrapper with that, and provide you some hints about that.

## Unpkg link

- [iife](https://unpkg.com/use-controllable-resolve/unpkg/use-controllable-resolve.iife.js)
- [umd](https://unpkg.com/use-controllable-resolve/unpkg/use-controllable-resolve.umd.js)
