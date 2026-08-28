export function copySet(source: Set<number>): number[] {
  return [...source];
}

export function spreadPromise(promise: Promise<number>): unknown {
  return { ...promise };
}
