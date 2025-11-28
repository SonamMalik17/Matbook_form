import type { FormField } from '../types';

export const buildDefaultValues = (fields: FormField[]) =>
  fields.reduce<Record<string, unknown>>((acc, field) => {
    if (field.type === 'multi-select') {
      acc[field.id] = [];
    } else if (field.type === 'switch') {
      acc[field.id] = false;
    } else {
      acc[field.id] = '';
    }
    return acc;
  }, {});

const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0);

const validateText = (field: FormField, value: unknown) => {
  if (typeof value !== 'string') return 'Enter a valid text value.';
  const trimmed = value.trim();

  if (field.validations?.minLength && trimmed.length < field.validations.minLength) {
    return `Must be at least ${field.validations.minLength} characters.`;
  }

  if (field.validations?.maxLength && trimmed.length > field.validations.maxLength) {
    return `Must be at most ${field.validations.maxLength} characters.`;
  }

  if (field.validations?.regex) {
    const regex = new RegExp(field.validations.regex);
    if (!regex.test(trimmed)) {
      return 'Please match the required pattern.';
    }
  }

  return undefined;
};

const validateNumber = (field: FormField, value: unknown) => {
  if (value === '' || value === null) return undefined;
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return 'Enter a valid number.';

  if (field.validations?.min !== undefined && numeric < field.validations.min) {
    return `Must be at least ${field.validations.min}.`;
  }

  if (field.validations?.max !== undefined && numeric > field.validations.max) {
    return `Must be at most ${field.validations.max}.`;
  }

  return undefined;
};

const validateSelect = (field: FormField, value: unknown) => {
  if (!value) return undefined;
  if (typeof value !== 'string') return 'Choose a valid option.';
  const allowed = field.options?.some((opt) => opt.value === value);
  return allowed ? undefined : 'Choose a valid option.';
};

const validateMultiSelect = (field: FormField, value: unknown) => {
  const selections = Array.isArray(value) ? value : [];

  if (field.validations?.minSelected && selections.length < field.validations.minSelected) {
    return `Pick at least ${field.validations.minSelected} option(s).`;
  }

  if (field.validations?.maxSelected && selections.length > field.validations.maxSelected) {
    return `Pick at most ${field.validations.maxSelected} option(s).`;
  }

  return undefined;
};

const validateDate = (field: FormField, value: unknown) => {
  if (!value) return undefined;
  if (typeof value !== 'string') return 'Select a valid date.';
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return 'Select a valid date.';

  if (field.validations?.minDate) {
    const minDate = Date.parse(field.validations.minDate);
    if (!Number.isNaN(minDate) && parsed < minDate) {
      return `Date cannot be before ${field.validations.minDate}.`;
    }
  }

  return undefined;
};

export const validateFieldValue = (field: FormField, value: unknown) => {
  if (field.required && isEmpty(value)) {
    return 'This field is required.';
  }

  if (isEmpty(value)) return undefined;

  switch (field.type) {
    case 'text':
    case 'textarea':
      return validateText(field, value);
    case 'number':
      return validateNumber(field, value);
    case 'select':
      return validateSelect(field, value);
    case 'multi-select':
      return validateMultiSelect(field, value);
    case 'date':
      return validateDate(field, value);
    default:
      return undefined;
  }
};

export const validatorForField = (field: FormField) => ({
  onChange: ({ value }: { value: unknown }) => validateFieldValue(field, value),
  onBlur: ({ value }: { value: unknown }) => validateFieldValue(field, value)
});

export const normalizeValuesForSubmit = (
  fields: FormField[],
  raw: Record<string, unknown>
) => {
  const payload: Record<string, unknown> = {};

  fields.forEach((field) => {
    const value = raw[field.id];
    switch (field.type) {
      case 'number':
        payload[field.id] =
          value === '' || value === undefined || value === null ? null : Number(value);
        break;
      case 'multi-select':
        payload[field.id] = Array.isArray(value) ? value : [];
        break;
      case 'switch':
        payload[field.id] = Boolean(value);
        break;
      default:
        payload[field.id] = value ?? '';
        break;
    }
  });

  return payload;
};
