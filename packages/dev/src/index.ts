import { makeUnifiedConfig } from "@mtabt/utils";
import { CliParams } from "@mtabt/utils";
import { ensureServer } from "./utils";

export type DevFunction = (params: CliParams) => void;

export const dev: DevFunction = async (params) => {
  const config = makeUnifiedConfig(params);

  await ensureServer(config);

  console.log(config);
};
