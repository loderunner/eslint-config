declare function getAny(): any;

export function assignAny(): string {
  const value: string = getAny();
  return value;
}
