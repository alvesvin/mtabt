import * as path from "path";
import * as fs from "fs";

export const ensureDir = (dir: string) => {
  try {
    fs.mkdirSync(dir, { recursive: true });
    return {};
  } catch (error) {
    return { error: error as Error };
  }
};

export const rimraf = (thing: string) => {
  if (!fs.existsSync(thing)) return;

  const stats = fs.statSync(thing);

  if (stats.isDirectory()) {
    fs.readdirSync(thing).forEach((file) => {
      rimraf(path.join(thing, file));
    });

    fs.rmdirSync(thing);
  } else {
    fs.unlinkSync(thing);
  }
};
