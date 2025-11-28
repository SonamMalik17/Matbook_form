import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');
const submissionsFile = path.join(dataDir, 'submissions.json');

const ensureStorage = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(submissionsFile)) {
    fs.writeFileSync(submissionsFile, '[]', 'utf-8');
  }
};

const loadFromDisk = () => {
  try {
    ensureStorage();
    const raw = fs.readFileSync(submissionsFile, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load submissions from disk', error);
    return [];
  }
};

const persistToDisk = (items) => {
  try {
    ensureStorage();
    fs.writeFileSync(submissionsFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to persist submissions', error);
  }
};

let cache = loadFromDisk();

export const SubmissionStore = {
  ensure: ensureStorage,
  getAll: () => cache,
  add(submission) {
    cache = [submission, ...cache];
    persistToDisk(cache);
    return submission;
  },
  update(id, values) {
    const index = cache.findIndex((item) => item.id === id);
    if (index === -1) return null;
    cache[index] = { ...cache[index], values };
    persistToDisk(cache);
    return cache[index];
  },
  remove(id) {
    const exists = cache.some((item) => item.id === id);
    if (!exists) return false;
    cache = cache.filter((item) => item.id !== id);
    persistToDisk(cache);
    return true;
  }
};
