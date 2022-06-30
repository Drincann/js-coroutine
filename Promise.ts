interface Thenable<T = any> {
  then<RT>(
    onFulfilled?: (value: T) => Thenable<RT> | RT | null | undefined | void,
    onRejected?: (error: any) => Thenable<RT> | RT | null | undefined | void,
  ): Thenable<RT>;
}
export class MPromise<T = any> implements Thenable<T> {
  private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
  private value: T | any = null;
  private callbackes: Array<{
    onFulfilled: (value: T) => void,
    onRejected: (error: any) => void,
  }> = [];

  public constructor(
    resolver: (
      resolve: (value: MPromise<T> | T) => void,
      reject: (error: any) => void,
    ) => void
  ) {
    resolver(this.resolve.bind(this), this.reject.bind(this));
  }

  private reject(error: any) {
    this.value = error;
    this.state = 'rejected';
    this.callbackes.forEach(callback => callback.onRejected(error));
  }

  private fulfill(value: T) {
    this.value = value;
    this.state = 'fulfilled';
    this.callbackes.forEach(callback => callback.onFulfilled(value));
  }
  private resolve<ThenableReturnedT>(value: Thenable<ThenableReturnedT> | T) {
    if (typeof (value as Thenable)?.then === 'function') {
      (value as Thenable).then(this.resolve.bind(this), this.reject.bind(this));
      return;
    }
    this.fulfill(value as T);
  }

  public then<NextPromiseRT>(
    onFulfilled?: (value: T) => MPromise<NextPromiseRT> | null | undefined | void,
    onRejected?: (error: any) => MPromise<NextPromiseRT> | null | undefined | void,
  ): MPromise<NextPromiseRT> {
    return new MPromise<NextPromiseRT | any>((resolve, reject) => {
      if (this.state === 'pending') {
        this.callbackes.push({
          onFulfilled: value => {
            let nextValue; try {
              nextValue = onFulfilled?.(value);
            } catch (error) { reject(error); return; }
            resolve(nextValue);
          },
          onRejected: error => {
            let nextValue; try {
              nextValue = onRejected?.(error);
            } catch (error) { reject(error); return; }
            resolve(nextValue);
          },
        });
      } else if (this.state === 'fulfilled') {
        const nextValue = onFulfilled?.(this.value as T);
        resolve(nextValue);
      } else /* this.state === 'rejected */ {
        const nextValue = onRejected?.(this.value);
        resolve(nextValue);
      }
    });
  }
}
