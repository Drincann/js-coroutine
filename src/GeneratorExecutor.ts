import { MPromise, Thenable } from "./Promise";

function isGenerator(value: any): value is Generator<any, any, any> {
  return typeof value?.next === 'function' && typeof value?.throw === 'function';
}

function isThenable(value: any): value is Thenable<any> {
  return typeof value?.then === 'function';
}

export class Coroutine<RT> {
  static isCoroutine(value: any): value is Coroutine<any> {
    return value instanceof Coroutine;
  }

  private coroutine: Generator<any, RT, any>;
  public constructor(gen: Generator<any, RT, any>) {
    this.coroutine = gen;
  }

  execute(): MPromise<RT> {
    return new MPromise((resolve, reject) => {
      const next = (value?: any) => {
        const result = this.coroutine.next(value);
        if (result.done) {
          resolve(result.value);
        } else {
          if (isThenable(result.value)) {
            // promise instance
            result.value.then(next, reject);
          } else if (isGenerator(result.value)) {
            // generator
            new Coroutine(result.value).execute().then(next, reject);
          } else if (Coroutine.isCoroutine(result.value)) {
            // coroutine instance
            result.value.execute().then(next, reject);
          } else {
            // value
            next(result.value);
          }
        }
      }; next();
    });
  }
}