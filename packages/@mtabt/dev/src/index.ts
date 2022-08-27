import * as path from "path";
import * as fs from "fs";

import {
  ensureServer,
  openServer,
  watchLogs,
  watchResources,
} from "./utils.js";

import type { UnifiedConfig } from "@mtabt/utils/types";

export type DevFunction = (config: UnifiedConfig) => void;

export const dev: DevFunction = async (config) => {
  await ensureServer(config);
  // ensureDefaultResources

  try {
    fs.unlinkSync(path.resolve(config.cwd, ".mtabt/.cache/devManifest.json"));
    // eslint-disable-next-line no-empty
  } catch {}

  // Watch for log files change
  await watchLogs(config);
  // Watch for resources change
  await watchResources(config);

  // Open the server
  openServer(config);
};
