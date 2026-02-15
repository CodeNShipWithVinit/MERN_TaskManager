const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/task.routes');

const app = express();

// ─── Global Middleware ─────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/health', (_req, res) =>
  res.json({ status: 'OK', message: 'Task Manager API is running' })
);

// ─── Centralised Error Handler ─────────────────────────────────────────────
// Catches anything passed via next(err) from controllers
app.use((err, _req, res, _next) => {
  console.error(err.stack);

  // Multer: file too large
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large – max 10 MB allowed.' });
  }

  // Multer: wrong file type
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Service-layer 404s
  if (err.status === 404) {
    return res.status(404).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Database + Server Bootstrap ──────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';
const PORT        = process.env.PORT        || 5000;

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅  Connected to MongoDB');

    // Seed the sample task described in the problem statement (first run only)
    const Task = require('./models/task.model');
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.create({
        title:       'Study TypeScript',
        description: 'Read the documentation and make notes.',
        createdOn:   new Date('2024-08-16'),
        deadline:    new Date('2024-08-19'),
        status:      'TODO'
      });
      console.log('📌  Sample task seeded');
    }

    app.listen(PORT, () =>
      console.log(`🚀  Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });
