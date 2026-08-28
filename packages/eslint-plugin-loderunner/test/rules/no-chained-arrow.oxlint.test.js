import { RuleTester } from 'oxlint/plugins-dev';

import rule from '../../src/rules/no-chained-arrow.js';

import { invalid, valid } from './cases.js';

// Runs the same fixture cases as no-chained-arrow.test.js (ESLint's
// RuleTester) through oxlint's RuleTester, to prove that meta.schema,
// messageId/meta.messages, meta.hasSuggestions and
// context.report({ suggest: [{ fix }] }) behave identically under oxlint's
// plugin runtime. oxlint's RuleTester test-case shape (valid/invalid arrays,
// errors[].messageId, errors[].suggestions[].{messageId,output}) matches
// ESLint's closely enough that the shared fixtures need no adaptation.
new RuleTester().run('no-chained-arrow', rule, { valid, invalid });
