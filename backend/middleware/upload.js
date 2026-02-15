const multer = require('multer');

/**
 * File Upload Middleware  (Multer)
 *
 * Approach chosen: memoryStorage
 * ─────────────────────────────────────────────────────────────────────────
 * Multer supports two primary storage strategies:
 *
 *   diskStorage   — saves the file to the file system.
 *                   Good when you want to serve files from disk or process
 *                   large files, but adds file-system management overhead
 *                   and doesn't suit ephemeral/cloud deployments well.
 *
 *   memoryStorage — keeps the file in RAM as a Node.js Buffer (req.file.buffer).
 *                   Ideal here because we want to store the PDF as a binary
 *                   Blob directly inside MongoDB (linkedFile.data: Buffer),
 *                   so we never need to touch disk at all.
 *
 * File filter: only application/pdf is accepted.
 * Size limit:  10 MB per file.
 */

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);                                      // accept
  } else {
    cb(new Error('Only PDF files are allowed'), false);  // reject
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024   // 10 MB
  }
});

module.exports = upload;
