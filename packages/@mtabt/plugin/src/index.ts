export type PluginArgs = Record<string, unknown>;

export interface PluginContext {
  cwd: string;
  changes: string[];
}

export type RunPlugin<Args = PluginArgs> = (
  ctx: PluginContext,
  args?: Partial<Args>
) => void;
