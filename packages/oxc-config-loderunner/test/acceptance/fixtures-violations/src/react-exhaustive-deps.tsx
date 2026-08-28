import { useEffect, useState } from 'react';

export function MissingDep({ id }: { id: number }): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(id);
  }, []);
  return value;
}
