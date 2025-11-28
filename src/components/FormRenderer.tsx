import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { submitForm } from '../api/client';
import type { FormSchema } from '../types';
import { buildDefaultValues, normalizeValuesForSubmit, validatorForField } from '../lib/formUtils';
import FieldRenderer from './FieldRenderer';
import StatusBanner from './StatusBanner';

interface Props {
  schema: FormSchema;
}

const FormRenderer = ({ schema }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(
    null
  );

  const mutation = useMutation({
    mutationFn: submitForm
  });

  const form = useForm({
    defaultValues: useMemo(() => buildDefaultValues(schema.fields), [schema.fields]),
    onSubmit: async ({ value, formApi }) => {
      setStatus(null);
      const prepared = normalizeValuesForSubmit(schema.fields, value);
      try {
        await mutation.mutateAsync(prepared);
        setStatus({ tone: 'success', message: 'Submission saved. Redirecting to submissions...' });
        formApi.reset();
        await queryClient.invalidateQueries({ queryKey: ['submissions'] });
        navigate('/submissions');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Submission failed. Please try again.';
        setStatus({ tone: 'error', message });
      }
    }
  });

  return (
    <div className="card space-y-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          {schema.title || 'Dynamic Form'}
        </p>
        {schema.description && <p className="text-sm text-slate-300">{schema.description}</p>}
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
          <form.Field key={field.id} name={field.id} validators={validatorForField(field)}>
            {(fieldApi) => <FieldRenderer field={field} fieldApi={fieldApi} />}
          </form.Field>
        ))}

        <form.Subscribe selector={(state) => [state.isSubmitting]}>
          {([isSubmitting]) => (
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {isSubmitting || mutation.isPending ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-b-2 border-slate-900" />
                  Submitting...
                </>
              ) : (
                'Submit & review'
              )}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default FormRenderer;
