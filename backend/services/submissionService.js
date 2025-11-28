import crypto from 'crypto';
import { formSchema } from '../models/formSchema.js';
import { SubmissionStore } from '../models/submissionStore.js';
import { ValidationService } from './validationService.js';

const sortSubmissions = (items, sortOrder) => {
  const direction = sortOrder === 'asc' ? 'asc' : 'desc';
  return [...items].sort((a, b) =>
    direction === 'asc'
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const SubmissionService = {
  createSubmission(payload = {}) {
    const errors = ValidationService.validateAgainstSchema(formSchema, payload);
    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    const submission = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      values: payload
    };

    SubmissionStore.add(submission);
    return { submission };
  },

  updateSubmission(id, payload = {}) {
    const errors = ValidationService.validateAgainstSchema(formSchema, payload);
    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    const updated = SubmissionStore.update(id, payload);
    if (!updated) return { notFound: true };
    return { submission: updated };
  },

  deleteSubmission(id) {
    const removed = SubmissionStore.remove(id);
    if (!removed) return { notFound: true };
    return { success: true };
  },

  listSubmissions({ page = 1, limit = 10, sortOrder = 'desc', search } = {}) {
    const normalizedPage = page < 1 ? 1 : page;
    const normalizedLimit = limit < 1 ? 10 : Math.min(limit, 100);
    const direction = sortOrder === 'asc' ? 'asc' : 'desc';

    const all = SubmissionStore.getAll();
    const filtered = search
      ? all.filter((item) => {
          const term = search.toLowerCase();
          return Object.values(item.values).some((value) => {
            if (typeof value === 'string') return value.toLowerCase().includes(term);
            if (Array.isArray(value)) return value.some((v) => String(v).toLowerCase().includes(term));
            return String(value ?? '').toLowerCase().includes(term);
          });
        })
      : all;

    const sorted = sortSubmissions(filtered, direction);
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / normalizedLimit));
    const start = (normalizedPage - 1) * normalizedLimit;
    const submissions = sorted.slice(start, start + normalizedLimit);

    return {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      totalPages,
      sortBy: 'createdAt',
      sortOrder: direction,
      submissions
    };
  }
};
