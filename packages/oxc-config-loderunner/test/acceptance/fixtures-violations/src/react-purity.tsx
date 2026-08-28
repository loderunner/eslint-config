export function ImpureRender(): JSX.Element {
  const value = Math.random();
  return <span>{value}</span>;
}
