// react/jsx-sort-props has no oxlint equivalent (shared/rule-map.js marks
// it `oxlint: null`, "no oxlint equivalent (404)" - plan Part 5 item 1).
// This fixture exists for the parity test (Part 9 item 8): it demonstrates
// a real ESLint-only finding, so the test's "except ruleMap: null" exclusion
// path is genuinely exercised rather than vacuously true.
type Props = { onClick: () => void; id: string };

export function UnsortedProps({ onClick, id }: Props): JSX.Element {
  return <button onClick={onClick} id={id} />;
}
