// `no-with` requires sloppy (non-strict, non-module) script mode - `with` is
// a SyntaxError in ES modules and classes, which is otherwise how every
// other fixture file in this tree is written. `.cjs` forces CommonJS/script
// mode regardless of the package's `"type": "module"`, which is the only
// way to legally exercise this rule (see the file-level comment on
// `base-eslint-recommended-superseded.js`).
function withStatement(target) {
  with (target) {
    return value;
  }
}

module.exports = { withStatement };
