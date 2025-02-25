//1. No Function run exists

//1. Fail
// const run = async () => {};

//1. Pass
// const run = async () => 0;

//1. Refactor
const run = async () => {
  return 0;
};

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
//4. Edge Case
const wrapIt = async (promise) => {
  return Promise.allSettled([promise]).then(function ([{ value, reason }]) {
    return { data: value, error: reason };
  });
};

export { run, wrapIt };
