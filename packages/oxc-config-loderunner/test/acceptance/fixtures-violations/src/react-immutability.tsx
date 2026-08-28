import { useState } from 'react';

export function MutatesState(): JSX.Element {
  const [state] = useState({ a: 0 });
  state.a = 1;
  return <div>{state.a}</div>;
}
