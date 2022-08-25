import * as path from "path";
import * as os from "os";
import * as fs from "fs";

import { CliParams, ensureDir } from "@mtabt/utils";

import extractZip from "extract-zip";

const cacheServer = async (config: CliParams) => {};

const extractCachedServer = async (config: CliParams) => {};

export const ensureServer = async (config: CliParams) => {
  const platform = {
    linux: "linux",
    darwin: "linux",
    win32: "win",
  }[os.platform() as string];

  const arch = os.arch();

  if (!platform) {
    throw new Error("Unsupported platform");
  }

  if (!["x32", "x64"].includes(os.arch())) {
    throw new Error("Unsupported archtecture");
  }

  await cacheServer(config);
  await extractCachedServer(config);

  // const serverDir = path.resolve(config.cwd, ".mtabt/debug", platform);
  // ensureDir(serverDir);

  // const tmpZip = path.resolve(__dirname, "../1.5.9-linux-x64.zip");
  // await extractZip(tmpZip, { dir: serverDir });
};
