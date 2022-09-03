export type PluginArgs = Record<string, unknown>;

export interface PluginContext {
  cwd: string;
  changes: string[];
  logger: {
    warn: (str: string) => void;
    log: (str: string) => void;
    error: (err: Error) => void;
  };
}

export type RunPlugin<Args = PluginArgs> = (
  ctx: PluginContext,
  args?: Partial<Args>
) => void;
