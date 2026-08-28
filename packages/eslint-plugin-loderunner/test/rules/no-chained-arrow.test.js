import rule from '../../src/rules/no-chained-arrow.js';

import { invalid, valid } from './cases.js';
import ruleTester from './rule-tester.js';

ruleTester.run('no-chained-arrow', rule, { valid, invalid });
