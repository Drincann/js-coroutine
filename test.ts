import { Coroutine, MPromise, Thunk, ThunkCallback } from "./src";

// test cases
class TestPromise {
  // test case 1
  public async test1() {
    let o = {};
    let result = await new Promise((resolve, reject) => {
      try {
        new MPromise(() => {
          setTimeout(() => {
            try {
              resolve(o);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      } catch (e) {
        reject(e);
      }
    });
    if (result !== o) {
      throw { message: "test1" };
    }
  }

  // test case 2
  public async test2() {
    let o = {};
    const result = await new Promise((resolve, reject) => {
      new MPromise(() => {
        throw o;
      }).then(undefined, error => {
        resolve(error);
      });
    });
    if (result !== o) {
      throw { message: "test2" };
    }
  }

  public static async run() {
    for (let method of Object.getOwnPropertyNames(TestPromise.prototype)) {
      if (method.startsWith("test")) {
        try {
          await (TestPromise.prototype as any)[method]();
          console.log(`${method} passed`);
        } catch (error) {
          console.log(`${method} failed, error: ${JSON.stringify(error)}`);
          continue;
        }

      }
    }
  }
}

class TestCoroutine {

  public async test1() {
    let o = {};
    let result = await new Coroutine((function* () {
      return o;
    })()).execute();
    if (result !== o) {
      throw { message: "test1" };
    }
  }

  public async test2() {
    let o = {};
    try {
      let result = await new Coroutine((function* () {
        throw o;
      })()).execute();
    } catch (error) {
      if (error !== o) {
        throw { message: "test2" };
      }
    }
  }

  public static async run() {
    for (let method of Object.getOwnPropertyNames(TestCoroutine.prototype)) {
      if (method.startsWith("test")) {
        try {
          await (TestCoroutine.prototype as any)[method]();
          console.log(`${TestCoroutine.name} ${method} passed`);
        } catch (error) {
          console.log(`${method} failed, error: ${JSON.stringify(error)}`);
          continue;
        }

      }
    }
  }
}

async function TestCasesClassRunner(TestClass: any) {
  for (let method of Object.getOwnPropertyNames(TestClass.prototype)) {
    if (method.startsWith("test")) {
      try {
        await (TestClass.prototype as any)[method]();
        console.log(`${TestClass.name}.${method} passed`);
      } catch (error) {
        console.log(`${TestClass.name}.${method} failed, error: ${JSON.stringify(error)}`);
        continue;
      }
    }
  }
}

class TestThunk {
  public async test1() {
    const o = {};
    const returnO = (cbk: ThunkCallback) => cbk(null, o);
    const thunk = Thunk.toThunk(returnO)().thunk;
    const result1 = await new Promise((resolve, reject) => {
      thunk((error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
    const result2 = await new Promise((resolve, reject) => {
      returnO((error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
    if (result1 !== result2 || result1 !== o) {
      throw { message: "test1" };
    }
  }
}


(async () => {
  await TestCasesClassRunner(TestPromise);
  await TestCasesClassRunner(TestCoroutine);
  await TestCasesClassRunner(TestThunk);
})()
