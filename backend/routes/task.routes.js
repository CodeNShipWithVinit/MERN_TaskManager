const express    = require('express');
const router     = express.Router();
const upload     = require('../middleware/upload');
const controller = require('../controllers/task.controller');

/**
 * Task Routes
 *
 * Route → Controller mapping
 * ─────────────────────────────────────────────────────────────────────────
 *  GET    /api/tasks              → controller.getAllTasks
 *  GET    /api/tasks/:id          → controller.getTaskById
 *  GET    /api/tasks/:id/file     → controller.downloadFile
 *  POST   /api/tasks              → controller.createTask   (+ Multer)
 *  PUT    /api/tasks/:id          → controller.updateTask   (+ Multer)
 *  PATCH  /api/tasks/:id/status   → controller.markAsDone
 *  DELETE /api/tasks/:id          → controller.deleteTask
 * ─────────────────────────────────────────────────────────────────────────
 *
 * File upload notes:
 *   - upload.single('linkedFile') is applied only to POST and PUT so Multer
 *     parses multipart/form-data and populates req.file.
 *   - All other routes expect plain JSON (or no body at all).
 */

// List all tasks
router.get('/',          controller.getAllTasks);

// Get a single task by id
router.get('/:id',       controller.getTaskById);

// Download the PDF attached to a task
// NOTE: this must be declared before /:id to prevent Express matching
// "file" as an :id parameter — but because the path is /:id/file it is
// unambiguous; Express will still route correctly.
router.get('/:id/file',  controller.downloadFile);

// Create a new task (multipart/form-data to support optional PDF upload)
router.post('/',         upload.single('linkedFile'), controller.createTask);

// Update an existing task (multipart/form-data, same reason as POST)
router.put('/:id',       upload.single('linkedFile'), controller.updateTask);

// Mark a task as DONE (status-only patch, no file involved)
router.patch('/:id/status', controller.markAsDone);

// Delete a task permanently
router.delete('/:id',    controller.deleteTask);

module.exports = router;
