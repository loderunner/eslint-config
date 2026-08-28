/**
 * Projects an `oxlintOnly` metadata map — `{ severity, justification }` per
 * rule, used by `shared/test/rule-map.test.js` to enforce a documented
 * reason for every oxc-only addition — down to the plain `{ ruleId: severity
 * }` shape a fragment's `rules` object needs.
 *
 * Deriving the applied severity from the same object the test reads keeps
 * the two in lockstep by construction: there is only one place to edit a
 * severity, so it can never drift from its own justification.
 *
 * @param oxlintOnly Metadata map exported by a fragment (see `base.js`,
 * `typescript.js`, `react.js`, `vitest.js` in this directory).
 * @returns Plain rule severities, ready to spread into an `OxlintConfig`'s
 * `rules`.
 */
export function applyOxlintOnly(oxlintOnly) {
  return Object.fromEntries(
    Object.entries(oxlintOnly).map(([ruleId, { severity }]) => [
      ruleId,
      severity,
    ]),
  );
}

export default applyOxlintOnly;
