import * as path from "path";

import type { CliParams, UnifiedConfig } from "./types";
import { ensureArray } from "./array";

/**
 * Make a unified config object based on the CLI arguments and the configuration file
 */
export const makeUnifiedConfig = (cliParams: CliParams): UnifiedConfig => {
  return {
    cwd: path.resolve(cliParams.cwd),
    src: path.resolve(cliParams.cwd, cliParams.src),
    out: path.resolve(cliParams.cwd, cliParams.out),
    config: path.resolve(cliParams.cwd, cliParams.config),
    ignore: ensureArray(cliParams.ignore),
  };
};
