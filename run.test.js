import { test, describe, it } from "node:test";
import assert from "node:assert/strict";

import { run, wrapIt } from "./run.js";

// SECTION 1 Get a entry point up and running
// when up to 3 skip 1 and 2
test.skip("System entry: fn run", async (t) => {
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

// SECTION 2 Need a way to handle async
test.skip("Async wrapper to produce values", async (t) => {
  //2.
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
    const { data: got, error: err } = await wrapIt(controlledPromise(false));

    //assert
    assert.deepEqual(got, [1, 2, 3]);
    assert.equal(err, undefined);
  });
});

// 3. Refactor Tests because they are ugly
test("wrapIt: async wrapper to return object", async (t) => {
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

  // TABLE TEST EXAMPLE
  // {name, shouldReject, expected {data, error}}
  const cases = [
    {
      name: "should be {data: [1,2,3], error: undefined} on resolved",
      shouldReject: false,
      expected: { data: [1, 2, 3], error: undefined },
    },
    {
      name: "should be {data: undefined, error: 'Rejected'} on rejected",
      shouldReject: true,
      expected: { data: undefined, error: "Rejected" },
    },
    //4. Edge Case
    {
      name: "should error if promise not given to wrapIt",
      shouldReject: undefined,
      expected: { data: undefined, error: "Arg was not a promise" },
    },
  ];

  for (const { name, shouldReject, expected } of cases) {
    await t.test(name, async () => {
      const got = await wrapIt(controlledPromise(shouldReject));
      assert.deepEqual(got, expected);
    });
  }

  // ALTERNATE WAY only issue is they all look the same
  // await test("should return data [1,2,3] as data property", async () => {
  //   const { data: got } = await wrapIt(controlledPromise(false));
  //   assert.deepEqual(got, [1, 2, 3]);
  // });
  // await test("should return error undefined as error property", async () => {
  //   const { error: err } = await wrapIt(controlledPromise(false));
  //   assert.deepEqual(err, undefined);
  // });
  // await test("should return data undefined if promise rejects", async () => {
  //   const { data: got } = await wrapIt(controlledPromise(true));
  //   assert.deepEqual(got, undefined);
  // });
  // await test("should return error string 'Rejected' if promise rejects", async () => {
  //   const { error: err } = await wrapIt(controlledPromise(true));
  //   assert.deepEqual(err, "Rejected");
  // });
});
