import { Coroutine, MPromise } from "./src";
import { Thunk, ThunkCallback } from "./src/Thunk";

function timerPromise(ms: number, message: string): MPromise<string> {
  return new MPromise((resolve, _) => {
    setTimeout(() => {
      resolve(`${new Date().toLocaleString()}> promise timer ${message} after ${ms}ms`);
    }, ms);
  });
}

const timerThunk = Thunk.toThunk((ms: number, message: string, callback: ThunkCallback): void => {
  setTimeout(() => {
    callback(null, `${new Date().toLocaleString()}> thunk timer ${message} after ${ms}ms`);
  }, ms);
})

function* setMultiTimerSync(tasksOpt: Array<{ ms: number, message: string }>): Generator<any, string, any> {
  for (const task of tasksOpt) {
    const result1 = yield timerPromise(task.ms, task.message);
    console.log(result1);
    const result2 = yield timerThunk(task.ms, task.message);
    console.log(result2);
  }
  return 'coroutine done';
}



new Coroutine(setMultiTimerSync([
  { ms: 1000, message: 'timer1' },
  { ms: 2000, message: 'timer2' },
  { ms: 3000, message: 'timer3' },
])).then((v) => {
  console.log(v);
  console.log('returned value from coroutine');
}, (e) => {
  console.log(e);
});