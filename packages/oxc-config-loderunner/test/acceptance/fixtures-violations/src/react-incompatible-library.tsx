import { useReactTable } from '@tanstack/react-table';

type Props = { columns: unknown; data: unknown };

export function Component({ columns, data }: Props): JSX.Element {
  const table = useReactTable({ columns, data });
  return <div>{table.getRowModel().rows.length}</div>;
}
