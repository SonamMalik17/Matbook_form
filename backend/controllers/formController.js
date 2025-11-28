import { FormService } from '../services/formService.js';

export const FormController = {
  getSchema: (_req, res) => {
    res.json({ success: true, schema: FormService.getSchema() });
  }
};
