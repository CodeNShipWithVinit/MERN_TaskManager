import axios from 'axios';

/**
 * services/index.js
 *
 * Central module for all backend interactions.
 * Components and hooks import from here — never from the raw axios instance.
 *
 * Why a separate services layer?
 *   - Keeps components free of HTTP/URL concerns
 *   - Swapping the backend URL or library only touches this file
 *   - Easy to mock in tests
 */

// ── Axios instance ────────────────────────────────────────────────────────
// Vite proxies /api/* → http://localhost:5000 in dev (vite.config.js).
// In production set VITE_API_URL to the deployed backend base URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api'
});

// Normalise all error shapes into a plain Error with a readable message
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ?? err.message ?? 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ── Task service methods ───────────────────────────────────────────────────

/** Fetch all tasks.  Binary PDF data is stripped by the backend. */
export const getAllTasks = () =>
  api.get('/tasks').then((r) => r.data.data);

/** Fetch a single task by MongoDB _id. */
export const getTaskById = (id) =>
  api.get(`/tasks/${id}`).then((r) => r.data.data);

/**
 * Create a task.
 * @param {FormData} formData  Contains title, description, deadline and
 *                             an optional `linkedFile` PDF blob.
 *                             FormData is required so the binary file and
 *                             text fields share a single multipart request.
 */
export const createTask = (formData) =>
  api
    .post('/tasks', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data.data);

/**
 * Update an existing task.
 * @param {string}   id
 * @param {FormData} formData  Same shape as createTask.
 */
export const updateTask = (id, formData) =>
  api
    .put(`/tasks/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data.data);

/** Flip a task's status to DONE. */
export const markTaskAsDone = (id) =>
  api.patch(`/tasks/${id}/status`).then((r) => r.data.data);

/** Permanently delete a task. */
export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then((r) => r.data);

/**
 * Trigger a PDF download by opening the file endpoint in a new browser tab.
 * The backend sends Content-Disposition: attachment, so the browser saves
 * the file rather than trying to navigate.
 */
export const downloadTaskFile = (id) => {
  const base = import.meta.env.VITE_API_URL ?? '/api';
  window.open(`${base}/tasks/${id}/file`, '_blank');
};
