export const ensureArray = <T>(v?: T | T[] | null) => {
  const arr = Array.isArray(v) ? v : [v];
  return arr.filter(Boolean) as T[];
};
