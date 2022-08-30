import * as path from "path";
import * as fs from "fs";

import {
  ensureServer,
  handleStdin,
  openServer,
  watchLogs,
  watchResources,
} from "./utils.js";

import type { UnifiedConfig } from "@mtabt/utils/types";

export type DevFunction = (config: UnifiedConfig) => void;

export const dev: DevFunction = async (config) => {
  try {
    fs.unlinkSync(path.resolve(config.cwd, ".mtabt/.cache/devManifest.json"));
    // eslint-disable-next-line no-empty
  } catch {}

  await ensureServer(config);
  // ensureDefaultResources

  const proc = openServer(config);

  handleStdin(proc);
  await watchLogs(config);
  await watchResources(proc, config);
};
