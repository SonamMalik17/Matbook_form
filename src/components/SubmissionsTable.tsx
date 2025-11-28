import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import type { Submission } from '../types';
import { formatDate } from '../lib/time';

interface Props {
  data: Submission[];
  sortOrder: 'asc' | 'desc';
  onToggleSort: () => void;
  onView: (submission: Submission) => void;
  onEdit: (submission: Submission) => void;
  onDelete: (submission: Submission) => void;
}

const columnHelper = createColumnHelper<Submission>();

const SubmissionsTable = ({ data, sortOrder, onToggleSort, onView, onEdit, onDelete }: Props) => {
  const columns = [
    columnHelper.accessor('id', {
      header: () => <span className="text-left text-xs uppercase text-slate-500">Submission ID</span>,
      cell: (info) => (
        <span className="font-semibold text-slate-100">{info.getValue().slice(0, 8)}</span>
      )
    }),
    columnHelper.accessor('createdAt', {
      header: () => (
        <button
          type="button"
          onClick={onToggleSort}
          className="flex items-center gap-2 text-left text-xs uppercase text-slate-500"
        >
          Created
          <span className="text-[10px] text-cyan-200">{sortOrder === 'asc' ? '↑' : '↓'}</span>
        </button>
      ),
      cell: (info) => (
        <span className="text-sm text-slate-200">{formatDate(info.getValue() as string)}</span>
      )
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="text-xs uppercase text-slate-500">Actions</span>,
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onView(row.original)}
            className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:border-cyan-300 hover:text-white"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onEdit(row.original)}
            className="rounded-full border border-blue-400/60 px-3 py-1 text-xs font-semibold text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/10"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(row.original)}
            className="rounded-full border border-rose-500/60 px-3 py-1 text-xs font-semibold text-rose-100 transition hover:border-rose-400 hover:bg-rose-500/10"
          >
            Delete
          </button>
        </div>
      )
    })
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/80">
      <table className="w-full border-separate border-spacing-0">
        <thead className="bg-slate-900/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left align-middle">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-800/60">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4 align-top">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="p-6 text-center text-sm text-slate-400">
          No submissions yet. Complete the form to create the first record.
        </div>
      )}
    </div>
  );
};

export default SubmissionsTable;
