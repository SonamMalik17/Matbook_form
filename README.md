# MatBook Dynamic Form Builder

Full-stack assignment that exposes a dynamic onboarding form schema from the backend and renders it on the frontend with TanStack Form, Query, and Table. Submissions are validated end-to-end, persisted to disk, and listed with server-side pagination and sorting.

## Milestones
- Frontend (Vite + React + Tailwind + TanStack Query/Form/Table): ✅
- Backend (Express REST API with validation, pagination, persistence): ✅

## Tech Stack
- Frontend: React 18, Vite, TypeScript, Tailwind CSS, @tanstack/react-query, @tanstack/react-form, @tanstack/react-table, react-router-dom.
- Backend: Node.js + Express, CORS, file-backed in-memory storage.

## Project Structure
```
.
├── backend/          # Express server and data storage
├── src/              # Frontend source (Vite + React)
├── index.html        # Vite entry
├── package.json      # Shared dependencies and scripts
└── tailwind.config.cjs
```

## Running the App
1) Install dependencies (already installed in this workspace):
```bash
npm install
```
2) Start the backend API (http://localhost:4000):
```bash
npm run dev:backend
```
3) In another terminal, start the frontend (http://localhost:5173):
```bash
npm run dev
```
Vite proxies `/api` calls to the backend in development.

## API Contract
- `GET /api/form-schema` → `{ success: true, schema }` (Employee Onboarding form with 8 field types and validation rules).
- `POST /api/submissions` → validates against schema, returns `201` with `{ success, id, createdAt }` or `400` with `{ success: false, errors }`.
- `GET /api/submissions?page&limit&sortBy&sortOrder` → server-side pagination/sorting on `createdAt`, returns `{ success, total, totalPages, submissions }`.
- Data persists to `backend/data/submissions.json`; schema enforces required, min/max length, regex, number ranges, date lower-bound, and min/max selections.

## Frontend Highlights
- Dynamic form rendering for text, number, select, multi-select, date, textarea, and switch fields.
- Inline validation from schema with TanStack Form; submit button disables with loading state.
- TanStack Query handles schema and submissions fetching with loading/error/empty states.
- Submissions table uses TanStack Table with server-driven pagination, sorting controls, page-size selector, and detail modal.
- Successful submission clears the form, invalidates submissions query, and navigates to the submissions view.

## Known Issues / Assumptions
- Built with React 18 for stability; React 19 features were not required for this implementation.
- Storage is file-backed in the repo (`backend/data/submissions.json`); clearing the file resets stored submissions.
- Live deployment links are not included in this local setup.
