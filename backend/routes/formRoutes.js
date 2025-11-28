import { Router } from 'express';
import { FormController } from '../controllers/formController.js';

const router = Router();

router.get('/', FormController.getSchema);

export default router;
