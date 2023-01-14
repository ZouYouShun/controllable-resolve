# controllable-resolve

![](https://github.com/ZouYouShun/controllable-resolve/actions/workflows/main-merge.yml/badge.svg)
![](https://github.com/ZouYouShun/controllable-resolve/actions/workflows/npm-publish.yml/badge.svg)
[![npm](https://img.shields.io/npm/v/controllable-resolve.svg)](https://www.npmjs.com/package/controllable-resolve)
![license](https://img.shields.io/npm/l/controllable-resolve)

[Example](https://zouyoushun.github.io/controllable-resolve/)

A simple controllable promise resolve let you can control when to resolve promise

## Installation

```bash
npm install controllable-resolve
```

## API

### createControllableResolve

```ts
import { createControllableResolve } from 'controllable-resolve';

const controllableResolve = createControllableResolve();
const { waitResolved, resolve } = controllableResolve;

const startButton = document.getElementById('start');
const resolveButton = document.getElementById('resolve');

startButton.addEventListener('click', () => {
  // wait promise resolved
  waitResolved().then((value) => {
    alert(`do something with value: ${value}`);
  });
});

resolveButton.addEventListener('click', () => {
  // resolve that promise when you need
  resolve(100);
});
```

### createControllableResolve options

| field             | default | type                      | description                                                                                                              |
| ----------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `ignorePrevious`  | `false` | `boolean`                 | if that be `true`, when `waitResolved` will ignore previous one,                                                         |
| `once`            | `false` | `boolean`                 | once the `waitResolved` promise be resolved, that will keep that resolve promise until you call `reset` method manually. |
| `onWaitingChange` | -       | `(state:boolean) => void` | be triggered when promise waiting state change                                                                           |


### React hook

[use-controllable-resolve](https://github.com/ZouYouShun/controllable-resolve/tree/main/libs/use-controllable-resolve)


### Unpkg link

[iife](https://unpkg.com/controllable-resolve/unpkg/controllable-resolve.iife.js)
[umd](https://unpkg.com/controllable-resolve/unpkg/controllable-resolve.umd.js)