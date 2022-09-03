import * as fs from "fs";

import type { RunPlugin } from "@mtabt/plugin";

// @ts-expect-error no types
import luamin from "luamin";
import bytes from "pretty-bytes";
import path from "path";

const runPlugin: RunPlugin = ({ changes, logger }) => {
  changes
    .filter((abs) => path.extname(abs) === ".lua")
    .forEach((abs) => {
      const str = fs.readFileSync(abs).toString();
      const minified = luamin.minify(str);

      const percent = (
        ((str.length - minified.length) / str.length) *
        100
      ).toFixed(0);

      fs.writeFileSync(abs, minified);
      logger.log(
        `'${path.basename(abs)}' is ${percent}% smaller (${bytes(
          minified.length
        )})`
      );
    });
};

export default runPlugin;
