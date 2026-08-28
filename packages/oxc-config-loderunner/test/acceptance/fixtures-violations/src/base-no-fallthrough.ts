export function withFallthrough(value: number): string {
  switch (value) {
    case 1:
      value += 1;
    case 2:
      return 'two';
    default:
      return 'other';
  }
}
