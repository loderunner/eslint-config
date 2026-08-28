import type { FC } from 'react';

type SampleComponentProps = {
  title: string;
};

/**
 * Sample React component for acceptance testing.
 */
export const SampleComponent: FC<SampleComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
