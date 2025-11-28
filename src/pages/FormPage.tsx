import { useQuery } from '@tanstack/react-query';
import FormRenderer from '../components/FormRenderer';
import Spinner from '../components/Spinner';
import StatusBanner from '../components/StatusBanner';
import { fetchFormSchema } from '../api/client';

const FormPage = () => {
  const { data: schema, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['formSchema'],
    queryFn: fetchFormSchema
  });

  if (isLoading) {
    return (
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Loading the form schema...</p>
          <p className="text-xs text-slate-400">This fetch uses TanStack Query.</p>
        </div>
        <Spinner />
      </div>
    );
  }

  if (isError || !schema) {
    return (
      <div className="card space-y-4">
        <StatusBanner
          tone="error"
          message={error instanceof Error ? error.message : 'Failed to load form schema.'}
        />
        <button
          type="button"
          className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-400"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Retry
        </button>
      </div>
    );
  }

  return <FormRenderer schema={schema} />;
};

export default FormPage;
