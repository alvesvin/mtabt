export interface CliParams {
  config: string;
  ignore?: string | string[];
  cwd: string;
  src: string;
  out: string;
}

export interface DevOptions {
  defaultResources: {
    admin?: true;
  };
}

export type ConfigFile = Partial<CliParams> & Partial<DevOptions>;

export interface UnifiedConfig extends Omit<CliParams, "ignore">, DevOptions {
  ignore: RegExp[];
  platform: "win" | "linux";
  arch: "x86" | "x64";
  serverVersion: string;
  _raw: CliParams;
}
