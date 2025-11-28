import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import type { FormSchema, Submission } from '../types';
import { buildDefaultValues, normalizeValuesForSubmit, validatorForField } from '../lib/formUtils';
import FieldRenderer from './FieldRenderer';
import StatusBanner from './StatusBanner';
import { updateSubmission } from '../api/client';

interface Props {
  schema: FormSchema;
  submission: Submission;
  onClose: () => void;
}

const SubmissionEditor = ({ schema, submission, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(
    null
  );

  const mutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Record<string, unknown> }) =>
      updateSubmission(id, values)
  });

  const defaults = useMemo(() => {
    const base = buildDefaultValues(schema.fields);
    return { ...base, ...submission.values };
  }, [schema.fields, submission.values]);

  const form = useForm({
    defaultValues: defaults,
    onSubmit: async ({ value }) => {
      setStatus(null);
      const prepared = normalizeValuesForSubmit(schema.fields, value);
      try {
        await mutation.mutateAsync({ id: submission.id, values: prepared });
        setStatus({ tone: 'success', message: 'Submission updated.' });
        await queryClient.invalidateQueries({ queryKey: ['submissions'] });
        onClose();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Update failed.';
        setStatus({ tone: 'error', message });
      }
    }
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Edit submission</p>
        <h3 className="text-lg font-semibold text-white">#{submission.id.slice(0, 8)}</h3>
      </div>

      {status && <StatusBanner tone={status.tone} message={status.message} />}

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        {schema.fields.map((field) => (
          <form.Field key={`${submission.id}-${field.id}`} name={field.id} validators={validatorForField(field)}>
            {(fieldApi) => <FieldRenderer field={field} fieldApi={fieldApi} />}
          </form.Field>
        ))}

        <form.Subscribe selector={(state) => [state.isSubmitting]}>
          {([isSubmitting]) => (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {isSubmitting || mutation.isPending ? 'Saving...' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-28 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
              >
                Cancel
              </button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default SubmissionEditor;
