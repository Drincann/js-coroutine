import { Coroutine } from "./GeneratorExecutor";
import { MPromise } from "./Promise";
import fs from "fs";

function readFile(path: string): MPromise<string> {
  return new MPromise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data.toString());
      }
    });
  });
}
function* readFileTask(filenames: string[]): Generator<any, string, any> {
  for (const filename of filenames) {
    const content = yield readFile(filename);
    console.log(content);
  }
  return 'coroutine done';
}

new Coroutine(readFileTask(['a.txt', 'b.txt']))
  .execute().then((v) => {
    console.log(v);
    console.log('read file done');
  });