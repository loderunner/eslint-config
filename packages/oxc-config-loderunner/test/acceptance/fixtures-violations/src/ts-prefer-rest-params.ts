export function sumArguments(): number {
  let total = 0;
  for (let i = 0; i < arguments.length; i += 1) {
    total += Number(arguments[i]);
  }
  return total;
}
