import { Router } from 'express';
import { SubmissionController } from '../controllers/submissionController.js';

const router = Router();

router.get('/', SubmissionController.list);
router.post('/', SubmissionController.create);
router.put('/:id', SubmissionController.update);
router.delete('/:id', SubmissionController.remove);

export default router;
