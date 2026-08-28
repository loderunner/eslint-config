import { EventEmitter } from 'node:events';

export function describeEmitter(emitter: EventEmitter): string {
  return `emitter: ${typeof emitter}`;
}
