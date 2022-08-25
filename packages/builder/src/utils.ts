import * as fs from "fs";

/**
 * List all *valid* resources in the specified 'src' directory
 */
export const listResources = (root: string) => {
  const tree = (root: string): string[] => {
    return (
      fs
        .readdirSync(root)
        .map((p) => `${root}/${p}`)
        .filter((p) => fs.statSync(p).isDirectory())
        // .filter((p) => fs.existsSync(`${p}/*.lua`) || /\[.*\]$/.test(p))
        .flatMap((p) => (/\[.*\]$/.test(p) ? tree(p) : [p]))
    );
  };

  return tree(root);
};
