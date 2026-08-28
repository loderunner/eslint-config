export function sumArray(values: number[]): number {
  let total = 0;
  for (const index in values) {
    total += values[Number(index)];
  }
  return total;
}
