const Task = require('../models/task.model');

/**
 * Task Service
 *
 * Encapsulates all database interactions for the Task resource.
 * Controllers call these methods and never touch the model directly.
 *
 * Methods:
 *  getAllTasks()
 *  getTaskById(id)
 *  getTaskFile(id)
 *  createTask(taskData, file?)
 *  updateTask(id, taskData, file?)
 *  markAsDone(id)
 *  deleteTask(id)
 */

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Strip the binary Buffer from a task object so we don't send raw bytes
 * in list / detail responses.  Returns a plain JS object with a boolean
 * `hasFile` flag and only { filename, contentType } under linkedFile.
 */
const sanitizeTask = (task) => {
  const obj    = task.toJSON();
  const hasFile = !!(task.linkedFile && task.linkedFile.data);

  obj.hasFile    = hasFile;
  obj.linkedFile = hasFile
    ? { filename: task.linkedFile.filename, contentType: task.linkedFile.contentType }
    : null;

  // Remove the Mongoose virtual — the frontend recomputes display status
  // itself from status + deadline, so sending it from the backend causes
  // stale-value bugs (e.g. a task marked DONE still shows "In Progress").
  delete obj.displayStatus;   // ← already here

  return obj;
};

// ─── Service Methods ──────────────────────────────────────────────────────

/**
 * Retrieve all tasks sorted by most recently created.
 * Binary file data is stripped from the response.
 */
const getAllTasks = async () => {
  const tasks = await Task.find().sort({ createdOn: -1 });
  return tasks.map(sanitizeTask);
};

/**
 * Retrieve a single task by its MongoDB _id.
 * Throws a 404-style error if not found.
 */
const getTaskById = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    const err    = new Error('Task not found');
    err.status   = 404;
    throw err;
  }
  return sanitizeTask(task);
};

/**
 * Retrieve the raw file buffer + metadata for streaming a PDF download.
 * Throws if the task or its file does not exist.
 */
const getTaskFile = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    const err  = new Error('Task not found');
    err.status = 404;
    throw err;
  }
  if (!task.linkedFile || !task.linkedFile.data) {
    const err  = new Error('No file attached to this task');
    err.status = 404;
    throw err;
  }
  return {
    data:        task.linkedFile.data,
    contentType: task.linkedFile.contentType || 'application/pdf',
    filename:    task.linkedFile.filename    || 'file.pdf'
  };
};

/**
 * Create a new task.
 * @param {Object} taskData  - { title, description, deadline }
 * @param {Object} [file]    - Multer file object (optional PDF)
 */
const createTask = async (taskData, file) => {
  const { title, description, deadline } = taskData;

  const payload = {
    title,
    description,
    deadline:  new Date(deadline),
    status:    'TODO',
    createdOn: new Date()
  };

  if (file) {
    payload.linkedFile = {
      data:        file.buffer,
      contentType: file.mimetype,
      filename:    file.originalname
    };
  }

  const task = new Task(payload);
  const saved = await task.save();
  return sanitizeTask(saved);
};

/**
 * Update an existing task (partial update — only provided fields are changed).
 * A new PDF file, if provided, replaces the previous one.
 * @param {string} id
 * @param {Object} taskData  - { title?, description?, deadline?, status? }
 * @param {Object} [file]    - Multer file object (optional PDF)
 */
const updateTask = async (id, taskData, file) => {
  const task = await Task.findById(id);
  if (!task) {
    const err  = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  const { title, description, deadline, status } = taskData;

  if (title)                                      task.title       = title;
  if (description)                                task.description = description;
  if (deadline)                                   task.deadline    = new Date(deadline);
  if (status && ['TODO', 'DONE'].includes(status)) task.status     = status;

  if (file) {
    task.linkedFile = {
      data:        file.buffer,
      contentType: file.mimetype,
      filename:    file.originalname
    };
  }

  const updated = await task.save();
  return sanitizeTask(updated);
};

/**
 * Mark a task as DONE regardless of its current status.
 */
const markAsDone = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    const err  = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  task.status = 'DONE';
  const updated = await task.save();
  return sanitizeTask(updated);
};

/**
 * Permanently delete a task by its _id.
 */
const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    const err  = new Error('Task not found');
    err.status = 404;
    throw err;
  }
  return { message: 'Task deleted successfully' };
};

module.exports = {
  getAllTasks,
  getTaskById,
  getTaskFile,
  createTask,
  updateTask,
  markAsDone,
  deleteTask
};
