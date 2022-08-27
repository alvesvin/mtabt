import * as path from "path";
import * as fs from "fs";

import type {
  RunPlugin,
  PluginContext,
  UnifiedConfig,
} from "@mtabt/utils/types";

import { listResourceChanges, listResources } from "./utils.js";
import { ensureDir } from "@mtabt/utils/fs";

export type BuildFunction = (config: UnifiedConfig) => Promise<void>;

export const build: BuildFunction = async (config) => {
  if (config.verbose) {
    console.time("Build");
  }

  ensureDir(config.src);
  ensureDir(config.out);

  const resources = listResources(config.src, config);

  for (const absoluteSourcePath of resources) {
    const changes = listResourceChanges(absoluteSourcePath, config);

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
      };

      runPlugin(ctx, args);
    }
  }

  if (config.verbose) {
    console.timeEnd("Build");
  }
};
