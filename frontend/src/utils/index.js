/**
 * utils/index.js
 *
 * Pure helper functions with no side-effects.
 * Importing from here keeps components lean and makes logic easy to test.
 */

// ── Date formatting ────────────────────────────────────────────────────────

/**
 * Format an ISO date string for display in the task table.
 * e.g. "16 Aug 2024"
 * Returns "—" for falsy input so the table never shows "Invalid Date".
 *
 * @param {string|Date|null} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric'
  });
};

// ── Status logic ───────────────────────────────────────────────────────────

/**
 * Derive the human-readable display status from a task object.
 *
 * Business rules (from the problem statement):
 *   - TODO  before deadline  → "In Progress"
 *   - DONE  after  deadline  → "Achieved"
 *   - TODO  on/after deadline→ "Failed"
 *
 * @param {{ status: string, deadline: string|Date }} task
 * @returns {'In Progress'|'Achieved'|'Failed'}
 */
export const getDisplayStatus = (task) => {
  const now      = new Date();
  const deadline = new Date(task.deadline);

  if (task.status === 'DONE' && now > deadline)  return 'Achieved';
  if (task.status === 'DONE' && now <= deadline) return 'Done';
  if (task.status !== 'DONE' && now >= deadline) return 'Failed';
    return 'In Progress';
};

/**
 * Return true when a task is overdue (past deadline and not yet done).
 * Used to colour the deadline cell red in the table.
 *
 * @param {{ status: string, deadline: string|Date }} task
 * @returns {boolean}
 */
export const isOverdue = (task) =>
  task.status !== 'DONE' && new Date(task.deadline) < new Date();

// ── File validation ────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Validate a File object for PDF upload.
 * Returns null on success, or an error message string on failure.
 *
 * @param {File} file
 * @returns {string|null}
 */
export const validatePdfFile = (file) => {
  if (!file) return null;
  if (file.type !== 'application/pdf') return 'Only PDF files are allowed';
  if (file.size > MAX_FILE_SIZE)       return 'File must be under 10 MB';
  return null;
};

/**
 * Format a file size in bytes as a human-readable KB string.
 * e.g. 204800 → "200 KB"
 *
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) =>
  `${(bytes / 1024).toFixed(0)} KB`;
