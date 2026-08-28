declare function getAny(): any;

function takesString(value: string): string {
  return value;
}

export function passAny(): string {
  return takesString(getAny());
}
