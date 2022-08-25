export interface CliParams {
  config: string;
  ignore?: string | string[];
  cwd: string;
  src: string;
  out: string;
}

export interface UnifiedConfig extends Omit<CliParams, "ignore"> {
  ignore: RegExp[];
  platform: "win" | "linux";
  arch: "x86" | "x64";
  serverVersion: string;
  original: CliParams;
}
