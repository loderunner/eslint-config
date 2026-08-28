import { useState } from 'react';

export function ConditionalHook({ flag }: { flag: boolean }): string {
  if (flag) {
    const [value] = useState('conditional');
    return value;
  }
  return 'no value';
}
