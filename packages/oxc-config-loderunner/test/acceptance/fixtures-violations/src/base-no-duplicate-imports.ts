import { existsSync } from 'node:fs';
import { statSync } from 'node:fs';

export function inspect(path: string): boolean {
  return existsSync(path) ? statSync(path).isFile() : false;
}
