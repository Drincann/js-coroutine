import { Coroutine, MPromise } from "./src";
import fs from "fs";

function timer(ms: number, message: string): MPromise<string> {
  return new MPromise((resolve, _) => {
    setTimeout(() => {
      resolve(`${new Date().toLocaleString()}> ${message} after ${ms}ms`);
    }, ms);
  });
}

function* setMultiTimerSync(tasksOpt: Array<{ ms: number, message: string }>): Generator<any, string, any> {
  for (const task of tasksOpt) {
    const result = yield timer(task.ms, task.message);
    console.log(result);
  }
  return 'coroutine done';
}

new Coroutine(setMultiTimerSync([
  { ms: 1000, message: 'timer1' },
  { ms: 2000, message: 'timer2' },
  { ms: 3000, message: 'timer3' },
]))
  .execute().then((v) => {
    console.log(v);
    console.log('returned value from coroutine');
  }, (e) => {
    console.log(e);
  });