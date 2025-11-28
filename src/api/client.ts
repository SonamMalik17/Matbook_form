import type { FormSchema, SubmissionsResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

const buildUrl = (path: string) => `${API_BASE}${path}`;

const parseError = async (response: Response) => {
  try {
    const data = await response.json();
    if (data?.errors) {
      const firstError = Object.values<string>(data.errors)[0];
      return firstError || 'Request failed';
    }
    return data?.message || 'Request failed';
  } catch (error) {
    return 'Request failed';
  }
};

export const fetchFormSchema = async (): Promise<FormSchema> => {
  const response = await fetch(buildUrl('/api/form-schema'));
  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
  const data = await response.json();
  return data.schema as FormSchema;
};

export const submitForm = async (values: Record<string, unknown>) => {
  const response = await fetch(buildUrl('/api/submissions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  });

  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }

  return response.json() as Promise<{ success: boolean; id: string; createdAt: string }>;
};

export interface FetchSubmissionsParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  q?: string;
}

export const fetchSubmissions = async (
  params: FetchSubmissionsParams
): Promise<SubmissionsResponse> => {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    sortBy: params.sortBy,
    sortOrder: params.sortOrder
  });
  if (params.q) query.set('q', params.q);

  const response = await fetch(buildUrl(`/api/submissions?${query.toString()}`));
  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
  return response.json() as Promise<SubmissionsResponse>;
};

export const updateSubmission = async (
  id: string,
  values: Record<string, unknown>
): Promise<{ success: boolean; submission: any }> => {
  const response = await fetch(buildUrl(`/api/submissions/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values)
  });
  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
  return response.json();
};

export const deleteSubmission = async (id: string): Promise<{ success: boolean }> => {
  const response = await fetch(buildUrl(`/api/submissions/${id}`), { method: 'DELETE' });
  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
  return response.json();
};
