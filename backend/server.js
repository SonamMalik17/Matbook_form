import express from 'express';
import cors from 'cors';
import formRoutes from './routes/formRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import { SubmissionStore } from './models/submissionStore.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/form-schema', formRoutes);
app.use('/api/submissions', submissionRoutes);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ success: false, message: 'Unexpected server error' });
});

app.listen(PORT, () => {
  SubmissionStore.ensure();
  console.log(`Backend server running on http://localhost:${PORT}`);
});
