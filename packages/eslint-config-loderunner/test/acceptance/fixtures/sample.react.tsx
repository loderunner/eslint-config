import type { FC } from 'react';

/**
 * Props for SampleComponent.
 */
type SampleComponentProps = {
  /** The title to display. */
  title: string;
};

/**
 * Sample React component for acceptance testing.
 */
export const SampleComponent: FC<SampleComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
