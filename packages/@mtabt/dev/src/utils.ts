import * as path from "path";
import * as cp from "child_process";
import * as fs from "fs";

import type { UnifiedConfig } from "@mtabt/utils/types";
import type { ChildProcess } from "child_process";
import { ensureDir, rimraf } from "@mtabt/utils/fs";
import { build } from "@mtabt/builder";

import CheapWatch from "cheap-watch";
import extractZip from "extract-zip";
import crypto from "crypto";
import https from "https";

const cacheServer = async (config: UnifiedConfig) => {
  // https://mtabt.s3.us-east-2.amazonaws.com/1.5.9-linux-x64.zip
  const baseUrl = "https://mtabt.s3.us-east-2.amazonaws.com";
  const fileName =
    [config.serverVersion, config.platform, config.arch].join("-") + ".zip";
  const fullUrl = `${baseUrl}/${fileName}`;
  const cacheDir = path.resolve(config.cwd, ".mtabt/.cache");
  const cachedPath = path.resolve(cacheDir, fileName);

  ensureDir(cacheDir);

  let shouldCache = false;
  let cachedMd5: string | undefined = undefined;

  if (fs.existsSync(cachedPath)) {
    cachedMd5 = crypto
      .createHash("md5")
      .update(fs.readFileSync(cachedPath))
      .digest("hex");
  }

  return new Promise((resolve, reject) => {
    const request = https.request(fullUrl, (response) => {
      shouldCache = response.headers.etag?.replace(/"/g, "") !== cachedMd5;

      if (!shouldCache) {
        resolve(true);
        return;
      }

      const writeStream = fs.createWriteStream(cachedPath);

      response.on("close", () => resolve(true));
      response.on("error", reject);

      response.pipe(writeStream);
    });

    request.on("error", reject);
    request.end();
  });
};

const extractCachedServer = async (config: UnifiedConfig) => {
  if (!config.platform) {
    throw new Error("Unsupported platform");
  }

  if (!config.arch) {
    throw new Error("Unsupported archtecture");
  }

  const fileName =
    [config.serverVersion, config.platform, config.arch].join("-") + ".zip";
  const cacheDir = path.resolve(config.cwd, ".mtabt/.cache");
  const cachedPath = path.resolve(cacheDir, fileName);

  if (!fs.existsSync(cachedPath)) return false;

  const serverDir = path.resolve(config.cwd, ".mtabt/debug", config.platform);

  if (fs.existsSync(serverDir)) return false;

  ensureDir(serverDir);
  await extractZip(cachedPath, { dir: serverDir });

  return true;
};

export const ensureServer = async (config: UnifiedConfig) => {
  await cacheServer(config);
  await extractCachedServer(config);
};

export const openServer = (config: UnifiedConfig) => {
  const cwd = path.resolve(config.cwd, ".mtabt/debug", config.platform);

  const proc = cp.spawn("./start", {
    cwd,
    stdio: ["pipe", "ignore", "ignore"],
  });

  proc.on("exit", process.exit);

  return proc;
};

export const handleStdin = (proc: ChildProcess) => {
  process.stdin.on("data", (data) => {
    const str = data.toString().replace(/\n|\r/gm, "");

    if (["cls", "clear", "clean"].includes(str)) {
      process.stdout.cursorTo(0, 0);
      process.stdout.clearScreenDown();

      return;
    }

    proc.stdin?.write(data);
  });
};

export const watchLogs = async (config: UnifiedConfig) => {
  const logsDir = path.resolve(
    config.cwd,
    ".mtabt/debug",
    config.platform,
    "mods/deathmatch/logs"
  );

  ensureDir(logsDir);

  const watch = new CheapWatch({
    dir: logsDir,
    filter: ({ path: p }: { path: string }) =>
      !config.ignore.some((t) => t.test(p)),
  });

  await watch.init();

  watch.on("+", ({ path: filename }) => undefined);
};

export const watchResources = async (
  proc: ChildProcess,
  config: UnifiedConfig
) => {
  const watch = new CheapWatch({
    dir: config.src,
    debounce: 250,
    filter: ({ path: p }: { path: string }) =>
      !config.ignore.some((t) => t.test(p)),
  });

  await watch.init();
  await build(config);

  const refreshall = () => {
    proc.stdin?.write("refreshall\n");
  };

  watch.on(
    "+",
    async ({ stats }: { path: string; stats: fs.Stats; isNew: boolean }) => {
      await build(config);

      if (!stats.isDirectory()) return;

      refreshall();
    }
  );

  watch.on(
    "-",
    ({ stats, path: filename }: { stats: fs.Stats; path: string }) => {
      if (!stats.isDirectory()) return;

      rimraf(path.resolve(config.out, filename));

      refreshall();
    }
  );
};
