import type { FieldApi } from '@tanstack/react-form';
import type { FormField } from '../types';

type FormValues = Record<string, unknown>;

interface Props {
  field: FormField;
  fieldApi: FieldApi<FormValues, any, any>;
}

const FieldRenderer = ({ field, fieldApi }: Props) => {
  const error = fieldApi.state.meta.errors?.[0];
  const value = fieldApi.state.value;

  const renderHelper = () => {
    if (error) {
      return <p className="text-xs font-semibold text-rose-300">{error}</p>;
    }

    const messages: string[] = [];
    if (field.validations?.minLength) messages.push(`≥${field.validations.minLength} chars`);
    if (field.validations?.maxLength) messages.push(`≤${field.validations.maxLength} chars`);
    if (field.validations?.min !== undefined) messages.push(`min ${field.validations.min}`);
    if (field.validations?.max !== undefined) messages.push(`max ${field.validations.max}`);
    if (field.validations?.minSelected) messages.push(`min ${field.validations.minSelected} picks`);
    if (field.validations?.maxSelected) messages.push(`max ${field.validations.maxSelected} picks`);
    if (field.validations?.minDate) messages.push(`from ${field.validations.minDate}`);

    return messages.length > 0 ? (
      <p className="text-xs text-slate-500">Rules: {messages.join(' · ')}</p>
    ) : (
      <p className="text-xs text-slate-500">You can leave this empty if it&apos;s optional.</p>
    );
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            id={field.id}
            className="input"
            placeholder={field.placeholder}
            value={(value as string) ?? ''}
            onChange={(e) => fieldApi.handleChange(e.target.value)}
            onBlur={fieldApi.handleBlur}
            type="text"
          />
        );
      case 'number':
        return (
          <input
            id={field.id}
            className="input"
            placeholder={field.placeholder}
            value={(value as string) ?? ''}
            onChange={(e) => fieldApi.handleChange(e.target.value)}
            onBlur={fieldApi.handleBlur}
            type="number"
          />
        );
      case 'textarea':
        return (
          <textarea
            id={field.id}
            className="input min-h-[110px]"
            placeholder={field.placeholder}
            value={(value as string) ?? ''}
            onChange={(e) => fieldApi.handleChange(e.target.value)}
            onBlur={fieldApi.handleBlur}
          />
        );
      case 'select':
        return (
          <select
            id={field.id}
            className="input"
            value={(value as string) ?? ''}
            onChange={(e) => fieldApi.handleChange(e.target.value)}
            onBlur={fieldApi.handleBlur}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'multi-select': {
        const selected = Array.isArray(value) ? (value as string[]) : [];
        return (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {field.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 rounded-lg border border-slate-800/60 bg-slate-900/60 px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...selected, option.value]
                      : selected.filter((item) => item !== option.value);
                    fieldApi.handleChange(next);
                  }}
                  onBlur={fieldApi.handleBlur}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-400"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      }
      case 'date':
        return (
          <input
            id={field.id}
            className="input"
            type="date"
            value={(value as string) ?? ''}
            onChange={(e) => fieldApi.handleChange(e.target.value)}
            onBlur={fieldApi.handleBlur}
          />
        );
      case 'switch':
        return (
          <button
            type="button"
            onClick={() => fieldApi.handleChange(!value)}
            onBlur={fieldApi.handleBlur}
            className={`flex w-fit items-center gap-3 rounded-full border px-3 py-2 transition ${
              value
                ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-100'
                : 'border-slate-700 bg-slate-900 text-slate-300'
            }`}
          >
            <span
              className={`h-5 w-10 rounded-full transition ${
                value ? 'bg-cyan-500/80' : 'bg-slate-600'
              }`}
            />
            <span className="text-sm font-semibold">{value ? 'Enabled' : 'Disabled'}</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="space-y-2 rounded-xl border p-4 shadow-sm"
      style={{ background: 'var(--panel)', borderColor: 'var(--border)', color: 'var(--ink)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={field.id} className="label">
          {field.label}
        </label>
        {field.required && (
          <span className="text-xs font-semibold uppercase tracking-wide text-rose-200/80">
            Required
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400">
        {field.placeholder || 'Provide a response for this field.'}
      </p>
      {renderInput()}
      {renderHelper()}
    </div>
  );
};

export default FieldRenderer;
