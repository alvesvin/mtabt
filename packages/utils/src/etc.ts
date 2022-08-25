import * as path from "path";
import * as os from "os";

import type { CliParams, UnifiedConfig } from "./types";
import { ensureArray } from "./array";

/**
 * Make a unified config object based on the CLI arguments and the configuration file
 */
export const makeUnifiedConfig = (cliParams: CliParams): UnifiedConfig => {
  const platform = { win32: "win", linux: "linux", darwin: "linux" }[
    os.platform() as string
  ] as "win" | "linux";

  const arch = { x86: "x86", x64: "x64" }[os.arch()] as "x86" | "x64";

  if (!platform) {
    throw new Error("Unsupported platform");
  }

  if (!arch) {
    throw new Error("Unsupported archtecture");
  }

  return {
    cwd: path.resolve(cliParams.cwd),
    src: path.resolve(cliParams.cwd, cliParams.src),
    out: path.resolve(cliParams.cwd, cliParams.out),
    config: path.resolve(cliParams.cwd, cliParams.config),
    ignore: ensureArray(cliParams.ignore),
    platform,
    arch,
    serverVersion: "1.5.9",
  };
};
