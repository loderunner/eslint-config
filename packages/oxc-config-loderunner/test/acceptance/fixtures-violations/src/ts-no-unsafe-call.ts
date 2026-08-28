declare function getAny(): any;

export function callAny(): unknown {
  const value = getAny();
  return value();
}
