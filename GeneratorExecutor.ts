import { MPromise } from "./Promise";

export class Coroutine<RT> {
  private coroutine: Generator<any, RT, any>;
  public constructor(gen: Generator<any, RT, any> | GeneratorFunction) {
    if (typeof gen === 'function') {
      gen = gen();
    }
    this.coroutine = gen;
  }

  execute(): MPromise<RT> {
    return new MPromise((resolve, reject) => {
      const next = (value: any) => {
        const result = this.coroutine.next(value);
        if (result.done) {
          resolve(result.value);
        } else {
          if (typeof result.value.then === 'function') {
            result.value.then(next, reject);
          } else if (typeof result.value === 'function') {
            new Coroutine(result.value).execute().then(next, reject);
          }
        }
      }
      next(undefined);
    });
  }
}