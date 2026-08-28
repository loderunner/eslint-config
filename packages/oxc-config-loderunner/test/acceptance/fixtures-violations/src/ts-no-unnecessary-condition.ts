export function alwaysTrue(): string {
  const flag: true = true;
  if (flag) {
    return 'yes';
  }
  return 'no';
}
