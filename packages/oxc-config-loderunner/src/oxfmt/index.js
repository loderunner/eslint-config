/**
 * oxfmt config replacing `prettier.config.js`. Every option below differs
 * from oxfmt's own default (plan Part 4, oxfmt preset table); anything not
 * listed already matches oxfmt's default and is omitted deliberately —
 * `semi`, `tabWidth`, `trailingComma`, `arrowParens`, `bracketSpacing`,
 * `quoteProps`, `endOfLine`, `objectWrap`, `jsxSingleQuote`, `useTabs` and
 * `insertFinalNewline`.
 *
 * No `ignorePatterns`: oxfmt already reads `.prettierignore` and
 * `.gitignore`, and always ignores `node_modules`, VCS directories and lock
 * files.
 *
 * @type {import('oxfmt').OxfmtConfig}
 */
const oxfmtConfig = {
  printWidth: 80,
  singleQuote: true,
  // oxfmt defaults to `true`, and reordering is explicitly not
  // Prettier-compatible — a shared config must not silently reorder
  // package.json.
  sortPackageJson: false,
  // Replaces import-x/order. Only ignoreCase is set: order ("asc"),
  // newlinesBetween (true), groups and internalPattern already match
  // oxfmt's defaults, and named-specifier sorting (import-x/order's
  // `named: true`) has no oxfmt equivalent (statement-level only, see
  // oxc#20160) and is dropped.
  sortImports: { ignoreCase: false },
  overrides: [
    {
      files: ['**/*.md'],
      options: { proseWrap: 'always' },
    },
  ],
};

/**
 * Adds `sortTailwindcss` (same class-sorting algorithm as
 * `prettier-plugin-tailwindcss`) to the base config. Not enabled by default
 * because it needs a per-repo stylesheet path.
 *
 * @param options Destructured `stylesheet` — path to the project's Tailwind
 * CSS entry stylesheet, passed straight through to `sortTailwindcss`.
 * @returns The base oxfmt config with Tailwind class sorting enabled.
 */
export function withTailwind({ stylesheet }) {
  return {
    ...oxfmtConfig,
    sortTailwindcss: { stylesheet },
  };
}

export default oxfmtConfig;
