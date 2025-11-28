import { SubmissionService } from '../services/submissionService.js';

export const SubmissionController = {
  create: (req, res) => {
    const payload = req.body ?? {};
    const result = SubmissionService.createSubmission(payload);

    if (result.errors) {
      return res.status(400).json({ success: false, errors: result.errors });
    }

    return res.status(201).json({
      success: true,
      id: result.submission.id,
      createdAt: result.submission.createdAt
    });
  },

  list: (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    const search = typeof req.query.q === 'string' ? req.query.q : undefined;

    const data = SubmissionService.listSubmissions({ page, limit, sortOrder, search });
    res.json({ success: true, ...data });
  },

  update: (req, res) => {
    const payload = req.body ?? {};
    const id = req.params.id;
    const result = SubmissionService.updateSubmission(id, payload);

    if (result.errors) {
      return res.status(400).json({ success: false, errors: result.errors });
    }
    if (result.notFound) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    return res.json({ success: true, submission: result.submission });
  },

  remove: (req, res) => {
    const id = req.params.id;
    const result = SubmissionService.deleteSubmission(id);
    if (result.notFound) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    return res.json({ success: true });
  }
};
