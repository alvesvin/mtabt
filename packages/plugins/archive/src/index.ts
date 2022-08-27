import * as path from "path";
import * as fs from "fs";

import type { RunPlugin } from "@mtabt/plugin";

import archiver from "archiver";
import rimraf from "rimraf";

interface Args {
  deleteAfter: boolean;
}

const runPlugin: RunPlugin<Args> = ({ cwd }, { deleteAfter = true } = {}) => {
  const zipPath = path.resolve(path.dirname(cwd), `${path.basename(cwd)}.zip`);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);

  archive.on("end", () => {
    if (deleteAfter) {
      rimraf.sync(cwd);
    }
  });

  archive.directory(cwd, false);

  archive.finalize();
};

export default runPlugin;
