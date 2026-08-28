export function greet(name: string): string {
  if (name) {
    return `Hello, ${name}`;
  }
  return 'Hello, stranger';
}
