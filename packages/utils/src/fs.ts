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
