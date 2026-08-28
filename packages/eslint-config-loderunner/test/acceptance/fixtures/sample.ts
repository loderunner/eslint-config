/**
 * Sample TypeScript file for acceptance testing.
 *
 * @param message - The message to log
 */
export function logMessage(message: string): void {
  process.stdout.write(`${message}\n`);
}

const value = 42;
logMessage(`The answer is ${value}`);
