//1. No Function run exists

//1. Fail
// const run = async () => {};

//1. Pass
// const run = async () => 0;

//1. Refactor
// const run = async () => {
//   return 0;
// };

//2. No wrapIt function exists

//2. Fail
// const wrapIt = async (promise) => {
//   return { data: undefined, error: 1 };
// };

//2. Pass
// const wrapIt = async (promise) => {
//   return { data: [1, 2, 3], error: undefined };
// };

//2. Refactor
// const wrapIt = async (promise) => {
//   return Promise.allSettled([promise]).then(function ([{ value, reason }]) {
//     return { data: value, error: reason };
//   });
// };

//3. Refactor Tests
//4. Edge Case Promise check
const settler = async (promise) => {
  if (promise instanceof Promise) {
    return Promise.allSettled([promise]).then(function ([{ value, reason }]) {
      return { data: value, rejected: reason };
    });
  }

  return { data: undefined, rejected: "arg was not a promise" };
};

// 5. No function exists
//
// 5. Fail
//const doWork = async () => {};
// 5. Pass
// const doWork = async () => {
//   return [{ name: "squirtle", height: 5, order: 10, weight: 90 }];
// };
// 5. Refactor
const doWork = async () => {
  const { data: res, rejected: reason } = await settler(
    fetch("https://pokeapi.co/api/v2/pokemon/squirtle"),
  );
  if (reason) {
    console.error("Promise rejected: ", reason);
    return;
  }
  if (!res.ok) {
    console.log("response not ok");
    return;
  }
  const json = await res.json();
  return [
    {
      name: json.name,
      height: json.height,
      order: json.order,
      weight: json.weight,
    },
  ];
};

// 8. Refactor run and test our wicked program
const run = async (cbfn) => {
  const { data: squirtle, rejected: reason } = await settler(cbfn());
  if (reason) {
    return 1;
  }
  console.log(squirtle);
  return 0;
};

// ========Practice yourself if you want =====
// 9 = squirtle is not the only pokemon we want to see, might need to refactor doWork which will
// include adding tests
// 10 = add some sweet moves to the pokemon retrieved, this will require refactoring tests that already work or extending with new ones
// 11 = why are we not handing everything into run. logger should be controlled. Hand it into run so in tests you can log to a string or array and test against it.
//
// Note Solutions on branch solutions

export { run, settler, doWork };
