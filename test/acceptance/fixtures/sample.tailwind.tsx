import type { FC } from 'react';

/**
 * Props for SampleTailwindComponent.
 */
type SampleTailwindComponentProps = {
  /** The title to display. */
  title: string;
};

/**
 * Sample Tailwind CSS component for acceptance testing.
 */
export const SampleTailwindComponent: FC<SampleTailwindComponentProps> = ({
  title,
}) => {
  return (
    <div className="md:flex-row hover:bg-blue-600 flex items-center bg-blue-500 p-4 text-white flex-col">
      {title}
    </div>
  );
};
