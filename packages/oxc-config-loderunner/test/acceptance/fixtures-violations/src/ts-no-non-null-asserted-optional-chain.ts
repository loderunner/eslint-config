interface Nested {
  child?: { value: number };
}

export function readValue(nested: Nested): number {
  return nested.child?.value!;
}
