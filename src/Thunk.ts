export type ThunkCallback<T = any> = (error: any, value: T) => void;
export type ThunkFn<T = any> = (callback: ThunkCallback<T>) => void;

export class Thunk<T = any> {
  public static toThunk<T>(
    asyncFn: (
      ...argsAndCallback: (any | ThunkCallback<T>)[]
    ) => void
  ): (...args: any[]) => Thunk<T> {
    return (...args: any[]): Thunk<T> => {
      return new Thunk((callback: ThunkCallback<T>) => {
        asyncFn(...args, callback);
      });
    }
  }

  public static isThunk(value: any): value is Thunk {
    return value instanceof Thunk;
  }

  private constructor(public thunk: ThunkFn<T>) { }
}