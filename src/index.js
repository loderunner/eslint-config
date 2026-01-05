import { base } from './base.js';
import { typescript } from './typescript.js';
import { importOrder } from './import.js';
import { react } from './react.js';
import { vitest } from './vitest.js';
import { jsdocConfig } from './jsdoc.js';
import { formatting } from './formatting.js';

export const configs = {
  base,
  typescript,
  importOrder,
  react,
  vitest,
  jsdoc: jsdocConfig,
  formatting,
};
