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
  serverVersion: "1.5.9";
  defaultResources: {
    admin?: true;
  };
}

export interface BuildOptions {
  plugins: (string | [string, PluginArgs])[];
  verbose: boolean;
  buildManifest: string;
}

export type ConfigFile = Partial<Omit<CliParams, "plugin" | "config">> & {
  devOptions?: Partial<DevOptions>;
} & {
  buildOptions?: Partial<BuildOptions>;
};

export interface UnifiedConfig
  extends Omit<CliParams, "ignore" | "plugin" | "config">,
    DevOptions,
    BuildOptions {
  ignore: RegExp[];
  platform: "win" | "linux";
  arch: "x86" | "x64";
  _raw: CliParams;
}
