import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteSubmission, fetchFormSchema, fetchSubmissions } from '../api/client';
import Spinner from '../components/Spinner';
import StatusBanner from '../components/StatusBanner';
import SubmissionsTable from '../components/SubmissionsTable';
import Modal from '../components/Modal';
import type { Submission } from '../types';
import { formatDate } from '../lib/time';
import SubmissionEditor from '../components/SubmissionEditor';

const formatValue = (value: unknown) => {
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
};

const SubmissionsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<Submission | null>(null);
  const [editing, setEditing] = useState<Submission | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(handle);
  }, [search]);

  const schemaQuery = useQuery({
    queryKey: ['formSchema'],
    queryFn: fetchFormSchema
  });

  const submissionsQuery = useQuery({
    queryKey: ['submissions', page, limit, sortOrder, debouncedSearch],
    queryFn: () =>
      fetchSubmissions({
        page,
        limit,
        sortBy: 'createdAt',
        sortOrder,
        q: debouncedSearch || undefined
      }),
    keepPreviousData: true
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSubmission(id),
    onSuccess: async () => {
      setActionError(null);
      await queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to delete submission.';
      setActionError(message);
    }
  });

  const totalPages = submissionsQuery.data?.totalPages ?? 1;
  const total = submissionsQuery.data?.total ?? 0;

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const detailFields = useMemo(() => schemaQuery.data?.fields ?? [], [schemaQuery.data]);

  if (submissionsQuery.isLoading) {
    return (
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Loading submissions...</p>
          <p className="text-xs text-slate-400">Server-side pagination with TanStack Query.</p>
        </div>
        <Spinner />
      </div>
    );
  }

  if (submissionsQuery.isError) {
    return (
      <div className="card space-y-4">
        <StatusBanner
          tone="error"
          message={
            submissionsQuery.error instanceof Error
              ? submissionsQuery.error.message
              : 'Failed to load submissions.'
          }
        />
        <button
          type="button"
          className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-400"
          onClick={() => submissionsQuery.refetch()}
          disabled={submissionsQuery.isFetching}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Submissions</p>
          <h2 className="text-2xl font-semibold text-white">Server-side table</h2>
          <p className="text-sm text-slate-400">
            {total} total submission{total === 1 ? '' : 's'} — sorted by created date ({sortOrder}
            ).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Search</label>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search text across submissions..."
              className="input w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Per page</label>
            <select
              className="rounded-lg border border-slate-700/70 bg-slate-900/70 px-2 py-1 text-sm text-slate-100"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              {[10, 20, 50].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!submissionsQuery.data) return;
              const { submissions } = submissionsQuery.data;
              const headers = ['id', 'createdAt', ...(schemaQuery.data?.fields ?? []).map((f) => f.id)];
              const rows = submissions.map((s) => [
                s.id,
                s.createdAt,
                ...(schemaQuery.data?.fields ?? []).map((f) => formatValue(s.values[f.id]))
              ]);
              const csv = [headers, ...rows]
                .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
                .join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'submissions.csv';
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            Export CSV
          </button>
        </div>
      </div>

      {actionError && <StatusBanner tone="error" message={actionError} />}

      {submissionsQuery.data && (
        <SubmissionsTable
          data={submissionsQuery.data.submissions}
          sortOrder={sortOrder}
          onToggleSort={() => {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            setPage(1);
          }}
          onView={(submission) => setSelected(submission)}
          onEdit={(submission) => setEditing(submission)}
          onDelete={(submission) => deleteMutation.mutate(submission.id)}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/70 bg-slate-900/60 px-4 py-3">
        <div className="flex items-center gap-4 text-sm text-slate-300">
          <span className="pill">Page {page} of {totalPages}</span>
          <span className="pill">Total: {total}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={page === 1 || submissionsQuery.isFetching}
            className="rounded-lg border border-slate-700/80 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={page >= totalPages || submissionsQuery.isFetching}
            className="rounded-lg border border-slate-700/80 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>

      {selected && (
        <Modal title={`Submission ${selected.id.slice(0, 8)}`} onClose={() => setSelected(null)}>
          <div className="space-y-3">
            {actionError && <StatusBanner tone="error" message={actionError} />}
            <div className="rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-200">
              <p className="font-semibold text-slate-50">Created</p>
              <p className="text-slate-400">{formatDate(selected.createdAt)}</p>
            </div>
            {detailFields.map((field) => (
              <div
                key={`${selected.id}-${field.id}`}
                className="rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"
              >
                <p className="font-semibold text-slate-50">{field.label}</p>
                <p className="text-slate-400">{formatValue(selected.values[field.id])}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {editing && schemaQuery.data && (
        <Modal title={`Edit ${editing.id.slice(0, 8)}`} onClose={() => setEditing(null)}>
          <SubmissionEditor
            submission={editing}
            schema={schemaQuery.data}
            onClose={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default SubmissionsPage;
