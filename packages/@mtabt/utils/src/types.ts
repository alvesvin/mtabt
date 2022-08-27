import { PluginArgs } from "@mtabt/plugin";

export type { PluginArgs, PluginContext, RunPlugin } from "@mtabt/plugin";

export interface CliParams {
  config: string;
  ignore?: string | string[];
  cwd: string;
  src: string;
  out: string;
  plugin?: string[];
}

export interface DevOptions {
  plugins: (string | [string, PluginArgs])[];
  defaultResources: {
    admin?: true;
  };
}

export interface BuildOptions {
  plugins: (string | [string, PluginArgs])[];
  buildManifest: string;
}

export type ConfigFile = Partial<Omit<CliParams, "plugin">> &
  Partial<DevOptions> &
  Partial<BuildOptions>;

export interface UnifiedConfig
  extends Omit<CliParams, "ignore" | "plugin">,
    DevOptions,
    BuildOptions {
  ignore: RegExp[];
  platform: "win" | "linux";
  arch: "x86" | "x64";
  serverVersion: string;
  _raw: CliParams;
}
