// Also covers plan Part 9 item 9: loderunner/no-chained-arrow firing
// correctly under `--type-aware`.
export const addChained = (a: number) => (b: number) => a + b;
