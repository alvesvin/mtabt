import * as path from "path";
import * as fs from "fs";

import type {
  RunPlugin,
  PluginContext,
  UnifiedConfig,
} from "@mtabt/utils/types";

import { listResourceChanges, listResources } from "./utils.js";
import { ensureDir } from "@mtabt/utils/fs";

import signalePkg from "signale";
const { Signale } = signalePkg;

export type BuildFunction = (config: UnifiedConfig) => Promise<void>;

export const build: BuildFunction = async (config) => {
  ensureDir(config.src);
  ensureDir(config.out);

  const signale = new Signale({ disabled: !config.verbose });
  const resources = listResources(config.src, config);

  for (const absoluteSourcePath of resources) {
    const changes = listResourceChanges(absoluteSourcePath, config);
    const resourceName = path.basename(absoluteSourcePath);
    const resourceLog = signale.scope(resourceName);
    const startTime = Date.now();

    if (changes.length < 1) {
      continue;
    }

    changes.forEach((abs) => {
      const rel = path.relative(config.src, abs);
      const outpath = path.resolve(config.out, rel);

      ensureDir(path.dirname(outpath));
      fs.copyFileSync(abs, outpath);
    });

    // Plugins make changes in place

    for (const plugin of config.plugins) {
      const [module] = Array.isArray(plugin) ? plugin : [plugin];
      await import(module);
    }

    for (const plugin of config.plugins) {
      const [module, args] = Array.isArray(plugin) ? plugin : [plugin];
      const runPlugin = (await import(module)).default as RunPlugin;

      const pluginLog = resourceLog.scope(resourceName, module);
      const pluginStartTime = Date.now();
      pluginLog.log(`Starting ${module}`);

      const ctx: PluginContext = {
        cwd: path.resolve(
          config.out,
          path.relative(config.src, absoluteSourcePath)
        ),
        changes: changes.map((abs) => {
          const rel = path.relative(config.src, abs);
          const outpath = path.resolve(config.out, rel);
          return outpath;
        }),
        logger: {
          error: pluginLog.error,
          log: pluginLog.log,
          warn: pluginLog.warn,
        },
      };

      runPlugin(ctx, args);

      pluginLog.log(
        `Finished ${module} in ${Date.now() - pluginStartTime} ms.`
      );
    }

    resourceLog.log(`Finished ${Date.now() - startTime} ms.`);
  }
};
