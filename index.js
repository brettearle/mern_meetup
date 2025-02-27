import { run, doWork } from "./run.js";
//
//entry point to system
async function main() {
  run(doWork);
}

await main();
