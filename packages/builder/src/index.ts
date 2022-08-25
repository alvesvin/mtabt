import { makeUnifiedConfig, ensureDir } from "@mtabt/utils";
import { listResources } from "./utils";
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

  const resources = listResources(config.src);

  for (const absoluteSourcePath of resources) {
    const relativePath = "";
  }

  console.log(config);
};
