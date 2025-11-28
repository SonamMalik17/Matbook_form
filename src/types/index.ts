export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multi-select'
  | 'date'
  | 'textarea'
  | 'switch';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldValidations {
  minLength?: number;
  maxLength?: number;
  regex?: string;
  min?: number;
  max?: number;
  minDate?: string;
  minSelected?: number;
  maxSelected?: number;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  validations?: FieldValidations;
}

export interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface Submission {
  id: string;
  createdAt: string;
  values: Record<string, unknown>;
}

export interface SubmissionsResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sortBy: string;
  sortOrder: string;
  submissions: Submission[];
}
