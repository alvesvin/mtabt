#!/usr/bin/env node

import { build } from "@mtabt/builder";
import { dev } from "@mtabt/dev";

import sade from "sade";

const prog = sade("mtabt");

prog
  .version("1.0.0")
  .option("--config, -c", "Configuration file", ".mtabt.ts")
  .option("--ignore", "Blob pattern to ignore")
  .option("--cwd", "Current working directory", ".")
  .option("--src", "Resources source directory", "resources")
  .option("--out", "Output directory", ".mtabt/release");

prog.command("build").action(build);

prog.command("dev").action(dev);

prog.parse(process.argv);
