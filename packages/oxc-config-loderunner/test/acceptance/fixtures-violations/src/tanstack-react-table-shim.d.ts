declare module '@tanstack/react-table' {
  export function useReactTable(options: unknown): {
    getRowModel: () => { rows: unknown[] };
  };
}
