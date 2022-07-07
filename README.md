# js-coroutine

[chinese version](#chinese)

The wrapper of coroutine impelemented by typescript, including the generator executor and a simple promise implementation.

Usage please refer to `./demo.ts`.

## test

```sh
npm test
```

## build

```sh
npm run build
```

## API

### `Coroutine<T>` extends `MPromise<T>`

```ts
public constructor(private coroutine: Generator<any, T, any>)
```

### `MPromise<T>`

```ts
public constructor(
  resolver: (
    resolve: (value: MPromise<T> | T) => void,
    reject: (error: any) => void,
  ) => void
)
```

```ts
public then<NextPromiseRT>(
  onFulfilled?: (value: T) => MPromise<NextPromiseRT> | null | undefined | void,
  onRejected?: (error: any) => MPromise<NextPromiseRT> | null | undefined | void,
): MPromise<NextPromiseRT> 
```

### `Thunk<T>`

```ts
public static toThunk<T>(
  asyncFn: (
    ...argsAndCallback: (any | ThunkCallback<T>)[]
  ) => void
): (...args: any[]) => Thunk<T>
```

```ts
public static isThunk(value: any): value is Thunk
```

<hr>

<span id="chinese"></span>

TypeScript 实现的协程包装器，包含生成器执行器和简单的 Promise 实现。

API 请参考示例 `./demo.ts`。

## test

```sh
npm test
```

## build

```sh
npm run build
```
