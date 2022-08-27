#!/usr/bin/env node

const main = async () => {
  await import("@mtabt/cli");
  // await run();
};

main().catch((e) => console.log(e));
