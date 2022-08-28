import * as path from "path";
import * as fs from "fs";
import * as os from "os";

import type { CliParams, ConfigFile, UnifiedConfig } from "./types.js";
import { ensureArray } from "./array.js";

import globToRegexp from "glob-to-regexp";

/**
 * Make a unified config object based on the CLI arguments and the configuration file
 */
export const makeUnifiedConfig = async (
  cliParams: CliParams,
  command: "dev" | "build"
): Promise<UnifiedConfig> => {
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

  const configPath = "file://" + path.resolve(cliParams.cwd, cliParams.config);
  const configFile = (await import(configPath)).default as ConfigFile;

  const plugins =
    {
      dev: configFile.devOptions?.plugins,
      build: configFile.buildOptions?.plugins,
    }[command as string] || [];

  return {
    cwd: path.resolve(cliParams.cwd),
    src: path.resolve(cliParams.cwd, cliParams.src),
    out: path.resolve(cliParams.cwd, cliParams.out),
    ignore: ensureArray(cliParams.ignore)
      .concat(ignoreConfig)
      .map((v) => globToRegexp(v)),
    platform,
    arch,
    serverVersion: configFile.devOptions?.serverVersion || "1.5.9",
    defaultResources: configFile.devOptions?.defaultResources || {},
    verbose: configFile.buildOptions?.verbose || false,
    plugins,
    buildManifest: ".mtabt/.cache/buildManifest.json",
    _raw: cliParams,
  };
};
