import * as path from "path";
import * as fs from "fs";

import { listResourceChanges, listResources } from "./utils";
import {
  ensureDir,
  RunPlugin,
  PluginContext,
  UnifiedConfig,
} from "@mtabt/utils";

export type BuildFunction = (config: UnifiedConfig) => void;

export const build: BuildFunction = (config) => {
  ensureDir(config.src);
  ensureDir(config.out);

  const resources = listResources(config.src, config);

  for (const absoluteSourcePath of resources) {
    const changes = listResourceChanges(absoluteSourcePath, config);

    if (changes.length < 1) {
      // console.warn(`Skipping ${path.basename(absoluteSourcePath)}`);
      continue;
    }

    changes.forEach((abs) => {
      const rel = path.relative(config.src, abs);
      const outpath = path.resolve(config.out, rel);

      ensureDir(path.dirname(outpath));
      fs.copyFileSync(abs, outpath);
    });

    // Plugins make changes in place

    config.plugins.forEach((plugin) => {
      const [module] = Array.isArray(plugin) ? plugin : [plugin];
      require.resolve(module);
    });

    config.plugins.forEach((plugin) => {
      const [module, args] = Array.isArray(plugin) ? plugin : [plugin];
      const _import = require(module);
      const runPlugin = _import.default as RunPlugin;

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
    });
  }
};
