import { test } from "node:test";
import assert from "node:assert/strict";

import { run, doWork, settler } from "./run.js";

// ========== SECTION 1 Get a entry point up and running ================
// when up to 3. skip 1. and 2.
test("TEST: run())", { skip: true }, async (t) => {
  // Tests are numbered in order of writing
  // 1.
  await t.test("should return exitCode 0", async () => {
    const exitCode = await run();
    assert.equal(exitCode, 0);
  });

  // oh no!
  // seems like all these async activities will require some kind of error handling
  // better jump to the next test
  // for ease of reading we will do everything in run.js
});

// ========= SECTION 2 Need a way to handle async ===========================
// Before refactor
// Note: We also refactor tests
//2.
test("TEST: wrapIt(promise)", { skip: true }, async (t) => {
  //arrange

  /**
   * This is used for us to control rejection and resolve
   * @param {boolean} shouldReject
   */
  const controlledPromise = async (shouldReject) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldReject) {
          return reject("Rejected");
        }
        resolve([1, 2, 3]);
      }, 1);
    });
  };

  await t.test("should return a data [1,2,3] and error undefined", async () => {
    //act
    const { data: got, rejected: err } = await wrapIt(controlledPromise(false));

    //assert
    assert.deepEqual(got, [1, 2, 3]);
    assert.equal(err, undefined);
  });
});

// 3. Refactor Tests because they are ugly
test("TEST: settler(promise)", async (t) => {
  //arrange

  /**
   * This is used for us to control rejection and resolve
   * @param {boolean} shouldReject
   */
  const controlledPromise = async (shouldReject) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldReject) {
          return reject("rejected");
        }
        resolve([1, 2, 3]);
      }, 1);
    });
  };

  // TABLE TEST EXAMPLE

  // {name, shouldReject, controlledPromise ,expected {data, error}}
  const cases = [
    {
      name: "should be {data: [1,2,3], error: undefined} on resolved",
      shouldReject: false,
      controlledPromise,
      expected: { data: [1, 2, 3], rejected: undefined },
    },
    {
      name: "should be {data: undefined, error: 'rejected'} on rejected",
      shouldReject: true,
      controlledPromise,
      expected: { data: undefined, rejected: "rejected" },
    },
    //4. Edge Case
    {
      name: "should error if promise not given to wrapIt",
      shouldReject: undefined,
      controlledPromise: () => "NOT A PROMISE",
      expected: { data: undefined, rejected: "arg was not a promise" },
    },
  ];

  // Here we are looping through each test case and awaiting a test to complete
  // within the test context which comes from our outer test layer parameter (t)
  for (const { name, shouldReject, controlledPromise, expected } of cases) {
    await t.test(name, async () => {
      const got = await settler(controlledPromise(shouldReject));
      assert.deepEqual(got, expected);
    });
  }
});

// 5.
test("TEST: doWork()", async (t) => {
  await t.test("doWork() should return a list of pokemon", async () => {
    const got = await settler(doWork());
    assert.deepEqual(got.data, [
      { name: "squirtle", height: 5, order: 10, weight: 90 },
    ]);
  });
});

// 6. Lets finish up run
test("TEST: run())", async (t) => {
  // Tests are numbered in order of writing
  // 6.
  await t.test("should return exitCode 0", async () => {
    const exitCode = await run(() => {
      return new Promise((resolve, _) => {
        resolve("UNDER TEST");
      });
    });
    assert.equal(exitCode, 0);
  });

  //7. We don't control inputs so prob need to inject doWork
  //in the wild, you would want to inject your system config, loggers, in, outs, third party modules etc
  //this allows you to actually run the program and control all the dials in testing
  await t.test("should exit with 1 if error encounterd", async () => {
    const exitCode = await run(() => {
      return new Promise((_, reject) => {
        reject("UNDER TEST");
      });
    });

    assert.equal(exitCode, 1);
  });
});
