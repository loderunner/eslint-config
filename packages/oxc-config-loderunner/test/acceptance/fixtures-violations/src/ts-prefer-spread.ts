function sum(a: number, b: number, c: number): number {
  return a + b + c;
}

export function callWithApply(): number {
  const args: [number, number, number] = [1, 2, 3];
  return sum.apply(null, args);
}
