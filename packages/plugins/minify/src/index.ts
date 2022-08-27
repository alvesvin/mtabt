import * as fs from "fs";

import type { RunPlugin } from "@mtabt/plugin";

// @ts-expect-error no types
import { minify } from "luamin";
import path from "path";

const runPlugin: RunPlugin = ({ changes }) => {
  changes
    .filter((abs) => path.extname(abs) === ".lua")
    .forEach((abs) => {
      const str = fs.readFileSync(abs).toString();
      const minified = minify(str);
      fs.writeFileSync(abs, minified);
    });
};

export default runPlugin;
