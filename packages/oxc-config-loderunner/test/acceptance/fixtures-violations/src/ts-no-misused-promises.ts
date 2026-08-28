async function checkFlag(): Promise<boolean> {
  return true;
}

// checksVoidReturn is set to false for this config (see typescript.js), so
// the violation here relies on checksConditionals (default true): a
// Promise used directly as a boolean conditional is always truthy,
// regardless of what it resolves to.
export function run(): string {
  if (checkFlag()) {
    return 'flag is set';
  }
  return 'flag is not set';
}
