declare function getAny(): any;

export function accessAny(): unknown {
  const value = getAny();
  return value.someProperty;
}
