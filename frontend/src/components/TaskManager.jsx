import React from 'react';
import {
  Container, Box, Typography, Button,
  Divider, Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { useTask }        from '../hooks/useTask';
import { useTaskManager } from '../hooks/useTaskManager';

import LoadingIndicator    from './LoadingIndicator';
import TaskTable           from './TaskTable';
import TaskModal           from './TaskModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

/**
 * TaskManager  (components/TaskManager.jsx)
 *
 * Orchestration layer — owns no logic of its own.
 *
 * Data-fetch state  → useTask
 * Mutation logic    → useTaskManager
 * Display           → TaskTable / TaskModal / DeleteConfirmDialog / LoadingIndicator
 *
 * This component is intentionally thin: it wires the two hooks together
 * and renders the layout.  All business logic lives in the hooks.
 */
export default function TaskManager() {

  // ── Fetch hook: tasks list + loading/error state ──────────────────────
  const {
    tasks, setTasks,
    loading, error, setError
  } = useTask();

  // ── Manager hook: mutations + modal state ─────────────────────────────
  const {
    addOpen, editState, delState, successMsg,
    openAdd,  closeAdd,
    openEdit, closeEdit,
    openDelete, closeDelete,
    handleCreate, handleUpdate,
    handleMarkAsDone, handleConfirmDelete,
    handleDownload
  } = useTaskManager({ setTasks, setError });

  // ── Derived stats ─────────────────────────────────────────────────────
  const total   = tasks.length;
  const done    = tasks.filter((t) => t.status === 'DONE').length;
  const pending = tasks.filter((t) => t.status === 'TODO').length;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>

      {/* ── Hero header ── */}
      <Box
        mb={4} p={4}
        sx={{
          background:   'linear-gradient(135deg, #1565C0 0%, #1976D2 55%, #1E88E5 100%)',
          borderRadius: 4,
          boxShadow:    '0 8px 32px rgba(21,101,192,0.28)',
          color:        'white',
          position:     'relative',
          overflow:     'hidden',
          '&::before': {
            content: '""', position: 'absolute',
            top: -60, right: -60, width: 200, height: 200,
            borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)'
          },
          '&::after': {
            content: '""', position: 'absolute',
            bottom: -40, left: '30%', width: 150, height: 150,
            borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)'
          }
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} letterSpacing={-0.5} mb={0.5}>
              My Tasks
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.82 }}>
              Organize, track and accomplish your tasks efficiently
            </Typography>
          </Box>

          <Box display="flex" gap={3} alignItems="center">
            {[['Total', total], ['Done', done], ['Pending', pending]].map(
              ([label, count], i, arr) => (
                <React.Fragment key={label}>
                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight={800}>{count}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.78 }}>{label}</Typography>
                  </Box>
                  {i < arr.length - 1 && (
                    <Divider orientation="vertical" flexItem
                      sx={{ bgcolor: 'rgba(255,255,255,0.28)' }} />
                  )}
                </React.Fragment>
              )
            )}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAdd}
              sx={{
                ml: 1, bgcolor: 'white', color: '#1565C0',
                fontWeight: 700, px: 3, py: 1.2,
                borderRadius: 2.5, fontSize: '0.95rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                '&:hover': { bgcolor: '#E3F2FD', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }
              }}
            >
              Add Task
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── Error banner ── */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ── LoadingIndicator (skeleton) or TaskTable ── */}
      {loading ? (
        <LoadingIndicator rows={5} />
      ) : (
        <TaskTable
          tasks={tasks}
          onMarkAsDone={handleMarkAsDone}
          onEdit={openEdit}
          onDelete={openDelete}
          onDownload={handleDownload}
          onAddTask={openAdd}
        />
      )}

      {/* ── Add Modal ── */}
      <TaskModal
        open={addOpen}
        onClose={closeAdd}
        onSubmit={handleCreate}
      />

      {/* ── Edit Modal ── */}
      <TaskModal
        open={editState.open}
        onClose={closeEdit}
        onSubmit={handleUpdate}
        editTask={editState.task}
      />

      {/* ── Delete Confirmation ── */}
      <DeleteConfirmDialog
        open={delState.open}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
        taskTitle={delState.task?.title ?? ''}
      />

      {/* ── Success toast ── */}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled"
          sx={{ borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
          {successMsg}
        </Alert>
      </Snackbar>

    </Container>
  );
}
