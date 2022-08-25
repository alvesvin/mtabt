import * as path from "path";
import * as fs from "fs";

import { listResourceChanges, listResources } from "./utils";
import { makeUnifiedConfig, ensureDir } from "@mtabt/utils";
import { CliParams } from "@mtabt/utils";

export type BuildFunction = (params: CliParams) => void;

/**
 * Building is:
 *
 * 1. Parse the config
 *  1.1 Parse the config file
 *  1.2 Parse CLI arguments
 * 2. Discover resources
 * 3. Loop
 *  3.1 Should it be built?
 *  3.2 Yes? Clean old output. No? Skip.
 *  3.3 Run plugins against resource
 */

export const build: BuildFunction = (params) => {
  const config = makeUnifiedConfig(params);

  ensureDir(config.src);
  ensureDir(config.out);

  const resources = listResources(config.src, config);

  for (const absoluteSourcePath of resources) {
    const changes = listResourceChanges(absoluteSourcePath, config);

    changes.forEach((abs) => {
      const rel = path.relative(config.src, abs);
      const outpath = path.resolve(config.out, rel);

      ensureDir(path.dirname(outpath));
      fs.copyFileSync(abs, outpath);
    });

    // Plugins make changes in place
  }
};
