const taskService = require('../services/task.service');

/**
 * Task Controller
 *
 * Sits between the HTTP layer (routes) and the business/data layer (service).
 * Responsibilities:
 *   - Parse & validate HTTP request data
 *   - Call the appropriate service method
 *   - Format and send the HTTP response
 *   - Forward unexpected errors to Express error-handling middleware
 *
 * Controller → Service mapping
 * ─────────────────────────────────────────────────────────────────────────
 *  getAllTasks()     → taskService.getAllTasks()
 *  getTaskById()     → taskService.getTaskById(id)
 *  downloadFile()    → taskService.getTaskFile(id)
 *  createTask()      → taskService.createTask(body, file?)
 *  updateTask()      → taskService.updateTask(id, body, file?)
 *  markAsDone()      → taskService.markAsDone(id)
 *  deleteTask()      → taskService.deleteTask(id)
 * ─────────────────────────────────────────────────────────────────────────
 */

// ─── GET /api/tasks ────────────────────────────────────────────────────────
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/tasks/:id ────────────────────────────────────────────────────
const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/tasks/:id/file  (PDF download) ──────────────────────────────
const downloadFile = async (req, res, next) => {
  try {
    const { data, contentType, filename } = await taskService.getTaskFile(req.params.id);

    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(data);
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/tasks ───────────────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { title, description, deadline } = req.body;

    // Basic presence validation — schema handles deeper rules
    if (!title || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'title, description and deadline are all required'
      });
    }

    // req.file is populated by Multer when a PDF is uploaded
    const task = await taskService.createTask(req.body, req.file);
    res.status(201).json({
      success: true,
      data:    task,
      message: 'Task created successfully'
    });
  } catch (err) {
    // Mongoose validation errors → 400
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(err);
  }
};

// ─── PUT /api/tasks/:id ────────────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.file);
    res.status(200).json({
      success: true,
      data:    task,
      message: 'Task updated successfully'
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(err);
  }
};

// ─── PATCH /api/tasks/:id/status ──────────────────────────────────────────
const markAsDone = async (req, res, next) => {
  try {
    const task = await taskService.markAsDone(req.params.id);
    res.status(200).json({
      success: true,
      data:    task,
      message: 'Task marked as done'
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/tasks/:id ─────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  downloadFile,
  createTask,
  updateTask,
  markAsDone,
  deleteTask
};
