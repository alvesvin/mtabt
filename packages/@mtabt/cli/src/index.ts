#!/usr/bin/env node

import * as path from "path";

import { makeUnifiedConfig } from "@mtabt/utils";
import { build } from "@mtabt/builder";
import { dev } from "@mtabt/dev";

import sade from "sade";

const prog = sade("mtabt");

prog
  .version("1.0.0")
  .option("--config, -c", "Configuration file", ".mtabt.js")
  .option("--ignore", "Blob pattern to ignore")
  .option("--cwd", "Current working directory", ".")
  .option("--src", "Resources source directory", "resources")
  .option("--out", "Output directory", ".mtabt/release");

prog.command("build").action(async (args) => {
  const config = await makeUnifiedConfig(args, "build");
  build(config);
});

prog.command("dev").action(async (args) => {
  const config = await makeUnifiedConfig(args, "dev");
  dev({
    ...config,
    verbose: false,
    buildManifest: ".mtabt/.cache/devManifest.json",
    out: path.resolve(
      config.cwd,
      ".mtabt/debug",
      config.platform,
      "mods/deathmatch/resources"
    ),
  });
});

prog.parse(process.argv);
