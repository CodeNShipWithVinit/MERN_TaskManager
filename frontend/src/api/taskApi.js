import axios from 'axios';

/**
 * Axios instance
 * In dev, Vite proxies /api/* → http://localhost:5000
 * In prod, set VITE_API_URL to your deployed backend origin.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api'
});

// Normalise error messages so callers always get a plain string
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ?? err.message ?? 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const taskApi = {
  /** Fetch all tasks (binary PDF data stripped server-side) */
  getAllTasks: () =>
    api.get('/tasks').then((r) => r.data.data),

  /** Fetch a single task by id */
  getTask: (id) =>
    api.get(`/tasks/${id}`).then((r) => r.data.data),

  /**
   * Create a task.
   * formData must be a FormData instance so that the optional PDF
   * and text fields are sent as multipart/form-data.
   */
  createTask: (formData) =>
    api
      .post('/tasks', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data.data),

  /**
   * Update an existing task.
   * Same multipart approach as createTask.
   */
  updateTask: (id, formData) =>
    api
      .put(`/tasks/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data.data),

  /** Flip status to DONE */
  markAsDone: (id) =>
    api.patch(`/tasks/${id}/status`).then((r) => r.data.data),

  /** Delete a task permanently */
  deleteTask: (id) =>
    api.delete(`/tasks/${id}`).then((r) => r.data),

  /**
   * Trigger a PDF download.
   * Opens the file endpoint in a new tab — the browser handles the
   * Content-Disposition: attachment header sent by the backend.
   */
  downloadFile: (id) => {
    const base = import.meta.env.VITE_API_URL ?? '/api';
    window.open(`${base}/tasks/${id}/file`, '_blank');
  }
};
