import { useState } from 'react';

export function SetStateDuringRender(): JSX.Element {
  const [value, setValue] = useState(0);
  setValue(1);
  return <span>{value}</span>;
}
