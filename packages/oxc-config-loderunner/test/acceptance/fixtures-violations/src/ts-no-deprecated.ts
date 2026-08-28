/** @deprecated Use `newFn` instead. */
export function oldFn(): number {
  return 1;
}

export function callOldFn(): number {
  return oldFn();
}
