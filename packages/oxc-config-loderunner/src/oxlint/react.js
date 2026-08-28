import { applyOxlintOnly } from './apply-oxlint-only.js';

/**
 * Rules present only on the oxc side of `react`. `eslint-config-loderunner`'s
 * own `react/rules.js` contributes only `react/jsx-sort-props`, which the
 * rule map marks `null` (no oxlint equivalent — see plan Part 5) and so has
 * no entry here or in `rules` below. Everything this fragment ships instead
 * restates severities that `eslint-plugin-react`, `eslint-plugin-react-hooks`
 * and oxlint's bundled React Compiler rules apply through *their own*
 * recommended configs on the ESLint side, none of which route through
 * `shared/rule-map.js` (plan Part 4 and Part 6).
 *
 * @type {Record<string, { severity: string | [string, ...unknown[]], justification: string }>}
 */
export const oxlintOnly = {
  'react/rules-of-hooks': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); restates eslint-plugin-react-hooks recommended, where this rule is error.',
  },
  'react/exhaustive-deps': {
    severity: 'warn',
    justification:
      'correctness in oxlint, on by default at error; demoted to warn for parity with eslint-plugin-react-hooks recommended, which sets this rule to warn (plan Part 6).',
  },
  'react/display-name': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); restates eslint-plugin-react recommended, where this rule is error.',
  },
  'react/jsx-no-comment-textnodes': {
    severity: 'error',
    justification:
      'suspicious in oxlint (off by default); restates eslint-plugin-react recommended, where this rule is error.',
  },
  'react/jsx-no-target-blank': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); restates eslint-plugin-react recommended, where this rule is error.',
  },
  'react/no-unescaped-entities': {
    severity: 'error',
    justification:
      'pedantic in oxlint (off by default); restates eslint-plugin-react recommended, where this rule is error.',
  },
  'react/no-unknown-property': {
    severity: 'error',
    justification:
      'restriction in oxlint (off by default); restates eslint-plugin-react recommended, where this rule is error.',
  },
  'react/purity': {
    severity: 'warn',
    justification:
      'React Compiler rule, correctness in oxlint (added 1.79.0, on by default at error); demoted to warn for a gentler adoption path (plan Part 6).',
  },
  'react/immutability': {
    severity: 'warn',
    justification:
      'React Compiler rule, correctness in oxlint, on by default at error; demoted to warn for a gentler adoption path (plan Part 6).',
  },
  'react/set-state-in-render': {
    severity: 'warn',
    justification:
      'React Compiler rule, correctness in oxlint, on by default at error; demoted to warn for a gentler adoption path (plan Part 6).',
  },
  'react/preserve-manual-memoization': {
    severity: 'warn',
    justification:
      'React Compiler rule, correctness in oxlint, on by default at error; demoted to warn for a gentler adoption path (plan Part 6).',
  },
  'react/incompatible-library': {
    severity: 'warn',
    justification:
      'React Compiler rule, correctness in oxlint, on by default at error; demoted to warn for a gentler adoption path (plan Part 6).',
  },
};

/**
 * oxlint fragment mirroring `eslint-config-loderunner/react`. Deliberately
 * omits `react/react-in-jsx-scope` (suspicious in oxlint, already off by
 * default — restating `"off"` would be a no-op) and `react/prop-types` (no
 * oxlint rule exists — 404), both dropped as no-ops in the ESLint source
 * (plan Part 4).
 *
 * Declares `plugins: ['react']` explicitly: `react` is not in oxlint's
 * default plugin set, unlike `eslint`/`typescript`/`unicorn`/`oxc`.
 *
 * @type {import('oxlint').OxlintConfig}
 */
export const react = {
  plugins: ['react'],
  rules: {
    ...applyOxlintOnly(oxlintOnly),
  },
};

export default react;
