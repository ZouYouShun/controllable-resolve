# controllable-resolve

![](https://github.com/ZouYouShun/controllable-resolve/actions/workflows/main-merge.yml/badge.svg)
![](https://github.com/ZouYouShun/controllable-resolve/actions/workflows/npm-publish.yml/badge.svg)
[![npm](https://img.shields.io/npm/v/controllable-resolve.svg)](https://www.npmjs.com/package/controllable-resolve)
![license](https://img.shields.io/npm/l/controllable-resolve)

[Example](https://zouyoushun.github.io/controllable-resolve/)

A simple controllable promise resolve let you can control promise when to resolve

# Demo

- [Demo Website](https://zouyoushun.github.io/controllable-resolve/)

## Installation

```bash
npm install controllable-resolve
```

## Usage

### `createControllableResolve`

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

### Once mode

when you use `once` mode, that can be use like an event center, once that `waitResolved` be resolved,
the promise will be keep and you can get `value` from our `controllableResolve`,
also the `waitResolved` will be `fulfilled`, so that will pass that `Promise` directly, `.then` method will be triggered directly.

```ts
import { createControllableResolve } from 'controllable-resolve';

const controllableResolve = createControllableResolve<number>({
  once: true,
});
const { waitResolved, resolve, reset } = controllableResolve;

waitResolved().then((value) => {
  console.log('7', `do something with value: ${value}`);
});

console.log('1', controllableResolve.waiting); // true
resolve(100); // will trigger above console.log

console.log('2', controllableResolve.waiting); // false
// that promise.then will be trigger directly
waitResolved().then((value) => {
  console.log('8', `do something with value: ${value}`);
});

// that resolved value be keep, you can use that synchronously.
console.log('3', controllableResolve.value); // 100
console.log('4', controllableResolve.waiting); // true

// clear keep promise and value
reset();
console.log('5', controllableResolve.value); // undefined
console.log('6', controllableResolve.waiting); // falsee
```

### onWaitingChange

`onWaitingChange` be call before `waiting` state change.

```ts
import { createControllableResolve } from 'controllable-resolve';

const controllableResolve = createControllableResolve({
  onWaitingChange: (state) => {
    console.log(state);
  },
});
const { waitResolved, resolve, reset, cancel } = controllableResolve;

waitResolved(); // onWaitingChange will be triggered with `true`

resolve(100); // onWaitingChange will be triggered with `false`

waitResolved(); // onWaitingChange will be triggered with `true`

cancel(); // onWaitingChange will be triggered with `false`
reset(); // onWaitingChange can be triggered, that inner waiting still be `false`

waitResolved(); // onWaitingChange will be triggered with `true`

reset(); // onWaitingChange will be triggered with `false`
```

## API

### createControllableResolve return instance

| field          | type                      | description                                                                                      |
| -------------- | ------------------------- | ------------------------------------------------------------------------------------------------ |
| `waitResolved` | `(state:boolean) => void` | create a wait resolved promise for you can control when to resolve promise                       |
| `resolve`      | `(value: T): void`        | `waitResolved` promise, this method need be call after `waitResolved`                            |
| `cancel`       | `(): void`                | cancel waitResolve when you not need wait anymore, this method need be call after `waitResolved` |
| `waiting`      | `readonly boolean`        | is there have promise be waiting                                                                 |
| `reset`        | `(): void`                | when you use `once` mode, use to clear those keep promise and resolve value.                     |
| `value`        | `readonly T \| undefined` | when you use `once` mode, that value be keep inside the promise result                           |

### createControllableResolve options

| field             | default | type                      | description                                                                                                              |
| ----------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `ignorePrevious`  | `false` | `boolean`                 | if that be `true`, when `waitResolved` will ignore previous one,                                                         |
| `once`            | `false` | `boolean`                 | once the `waitResolved` promise be resolved, that will keep that resolve promise until you call `reset` method manually. |
| `onWaitingChange` | -       | `(state:boolean) => void` | be triggered when promise waiting state change                                                                           |

### React hook

[use-controllable-resolve](https://github.com/ZouYouShun/controllable-resolve/tree/main/libs/use-controllable-resolve)

### Unpkg link

- [Stackblitz Online Demo](https://stackblitz.com/edit/web-platform-aabfvr?file=index.html)
- [controllable-resolve.iife.js](https://unpkg.com/controllable-resolve/unpkg/controllable-resolve.iife.js)
- [controllable-resolve.umd.js](https://unpkg.com/controllable-resolve/unpkg/controllable-resolve.umd.js)
