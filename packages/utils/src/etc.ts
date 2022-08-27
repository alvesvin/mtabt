import * as path from "path";
import * as fs from "fs";
import * as os from "os";

import type { CliParams, UnifiedConfig } from "./types";
import { ensureArray } from "./array";

import globToRegexp from "glob-to-regexp";

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

  const ignoreConfig = (() => {
    const ignorePath = path.resolve(cliParams.cwd, ".mtabtignore");
    const lines = fs
      .readFileSync(ignorePath)
      .toString()
      .split("\n")
      .filter((s) => !/^.*#/.test(s) && !!s);
    return lines;
  })();

  return {
    cwd: path.resolve(cliParams.cwd),
    src: path.resolve(cliParams.cwd, cliParams.src),
    out: path.resolve(cliParams.cwd, cliParams.out),
    config: path.resolve(cliParams.cwd, cliParams.config),
    ignore: ensureArray(cliParams.ignore)
      .concat(ignoreConfig)
      .map((v) => globToRegexp(v)),
    platform,
    arch,
    serverVersion: "1.5.9",
    defaultResources: {},
    plugins: ["mtabt-plugin-minify", "mtabt-plugin-archive"],
    buildManifest: ".mtabt/.cache/buildManifest.json",
    _raw: cliParams,
  };
};
