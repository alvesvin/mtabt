import * as path from "path";
import * as fs from "fs";

import { ensureServer, openServer, watchLogs, watchResources } from "./utils";
import { UnifiedConfig } from "@mtabt/utils";

export type DevFunction = (config: UnifiedConfig) => void;

export const dev: DevFunction = async (config) => {
  await ensureServer(config);
  // ensureDefaultResources

  try {
    fs.unlinkSync(path.resolve(config.cwd, ".mtabt/.cache/devManifest.json"));
  } catch {}

  // Watch for log files change
  await watchLogs(config);
  // Watch for resources change
  await watchResources(config);

  // Open the server
  openServer(config);
};
