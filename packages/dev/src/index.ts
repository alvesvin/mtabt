import { ensureServer, openServer, watchLogs, watchResources } from "./utils";
import { makeUnifiedConfig } from "@mtabt/utils";
import { CliParams } from "@mtabt/utils";

export type DevFunction = (params: CliParams) => void;

export const dev: DevFunction = async (params) => {
  const config = makeUnifiedConfig(params);

  await ensureServer(config);
  // ensureDefaultResources

  // Open the server
  openServer(config);
  // Watch for log files change
  await watchLogs(config);
  // Watch for resources change
  await watchResources(config);
  // Rebuild

  console.log(config);
};
