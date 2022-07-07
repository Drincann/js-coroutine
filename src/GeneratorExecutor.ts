import { Thenable } from "./Promise";
import { MPromise } from "./Promise";
import { Thunk } from "./Thunk";

function isGenerator(value: any): value is Generator<any, any, any> {
  return typeof value?.next === 'function' && typeof value?.throw === 'function';
}

function isThenable(value: any): value is Thenable<any> {
  return typeof value?.then === 'function';
}

export class Coroutine<T> extends MPromise<T> {
  static isCoroutine(value: any): value is Coroutine<any> {
    return value instanceof Coroutine;
  }

  public constructor(private coroutine: Generator<any, T, any>) {
    super((resolve, reject) => this.execute(resolve, reject) /* use this outside the constructor */);
  }

  private execute(resolve: (value: T) => void, reject: (error: any) => void): void {
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
          new Coroutine(result.value).then(next, reject);
        } else if (Coroutine.isCoroutine(result.value)) {
          // coroutine instance
          result.value.then(next, reject);
        } else if (Thunk.isThunk(result.value)) {
          // thunk instance
          result.value.thunk((err, value) => {
            if (err) {
              reject(err);
            } else {
              next(value);
            }
          })
        } else {
          // value
          next(result.value);
        }
      }
    }; next();
  }
}