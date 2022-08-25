export interface CliParams {
  config: string;
  ignore?: string | string[];
  cwd: string;
  src: string;
  out: string;
}

export interface UnifiedConfig extends CliParams {
  ignore: string[];
}
