export function withCaseDeclaration(value: number): number {
  switch (value) {
    case 1: {
      const doubled = value * 2;
      return doubled;
    }
    case 2:
      const tripled = value * 3;
      return tripled;
    default:
      return value;
  }
}
