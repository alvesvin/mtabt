import * as path from "path";
import * as fs from "fs";

import { UnifiedConfig } from "@mtabt/utils";

import crypto from "crypto";

/**
 * List all *valid* resources in the specified 'src' directory
 */
export const listResources = (root: string, config: UnifiedConfig) => {
  const tree = (root: string): string[] => {
    return fs
      .readdirSync(root)
      .map((p) => path.join(root, p))
      .filter((p) => fs.statSync(p).isDirectory())
      .filter(
        (p) => !config.ignore.some((s) => s.test(path.relative(config.src, p)))
      )
      .flatMap((p) => (/\[.*\]$/.test(p) ? tree(p) : [p]));
  };

  return tree(root);
};

/**
 * List all *valid* resources in the specified 'src' directory
 */
export const listResourceFiles = (root: string, config: UnifiedConfig) => {
  const tree = (root: string): string[] => {
    return (
      fs
        .readdirSync(root)
        .map((p) => path.join(root, p))
        // .filter((p) => fs.statSync(p).isDirectory())
        .filter(
          (p) =>
            !config.ignore.some((s) => s.test(path.relative(config.src, p)))
        )
        .flatMap((p) => (fs.statSync(p).isDirectory() ? tree(p) : [p]))
    );
  };

  return tree(root);
};

const getBuildManifest = (config: UnifiedConfig) => {
  try {
    const manifestPath = path.resolve(config.cwd, config.buildManifest);

    if (!fs.existsSync(manifestPath)) {
      fs.writeFileSync(manifestPath, "");
    }

    return JSON.parse(fs.readFileSync(manifestPath).toString());
  } catch {
    return {};
  }
};

const updateBuildManifest = (
  obj: Record<string, string>,
  config: UnifiedConfig
) => {
  try {
    const manifestPath = path.resolve(config.cwd, config.buildManifest);
    const manifest = getBuildManifest(config);

    fs.writeFileSync(manifestPath, JSON.stringify({ ...manifest, ...obj }));
    return true;
  } catch {
    return false;
  }
};

export const listResourceChanges = (root: string, config: UnifiedConfig) => {
  const manifest = getBuildManifest(config);
  const files = listResourceFiles(root, config).filter((abs) => {
    const rel = path.relative(config.src, abs);
    const hash = crypto
      .createHash("sha1")
      .update(fs.readFileSync(abs))
      .digest("hex");
    return manifest[rel] !== hash;
  });

  updateBuildManifest(
    files.reduce((a, b) => {
      const rel = path.relative(config.src, b);
      const hash = crypto
        .createHash("sha1")
        .update(fs.readFileSync(b))
        .digest("hex");

      return { ...a, [rel]: hash };
    }, {}),
    config
  );

  return files;
};
