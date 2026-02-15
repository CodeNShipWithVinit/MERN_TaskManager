import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, IconButton,
  Alert, CircularProgress, Divider
} from '@mui/material';
import CloseIcon   from '@mui/icons-material/Close';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SaveIcon    from '@mui/icons-material/Save';
import AddTaskIcon from '@mui/icons-material/AddTask';

import FileUpload from './FileUpload';

// ── Initial state constants ────────────────────────────────────────────────
const EMPTY_FORM   = { title: '', description: '', deadline: '' };
const EMPTY_ERRORS = { title: '',  description: '',  deadline: '' };

// ── Shared TextField style ─────────────────────────────────────────────────
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&:hover fieldset':       { borderColor: '#1976D2' },
    '&.Mui-focused fieldset': { borderColor: '#1565C0', borderWidth: 2 }
  }
};

/**
 * TaskModal  (components/TaskModal.jsx)
 *
 * Dual-mode modal for adding and editing tasks.
 * File upload is delegated to the <FileUpload /> component.
 * Utils (validatePdfFile etc.) are used via FileUpload, not here directly.
 *
 * Props:
 *   open      boolean
 *   onClose   () => void
 *   onSubmit  (FormData) => Promise<{success, error?}>
 *   editTask  Task | null   — switches to edit mode when provided
 */
export default function TaskModal({ open, onClose, onSubmit, editTask = null }) {

  const isEdit = !!editTask;

  const [form,       setForm]       = useState(EMPTY_FORM);
  const [errors,     setErrors]     = useState(EMPTY_ERRORS);
  const [file,       setFile]       = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError,   setApiError]   = useState('');

  // Populate / reset form each time the modal opens
  useEffect(() => {
    if (!open) return;

    if (isEdit && editTask) {
      setForm({
        title:       editTask.title       ?? '',
        description: editTask.description ?? '',
        deadline:    editTask.deadline
          ? new Date(editTask.deadline).toISOString().split('T')[0]
          : ''
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setFile(null);
    setErrors(EMPTY_ERRORS);
    setApiError('');
  }, [open, editTask, isEdit]);

  // ── Validation ─────────────────────────────────────────────────────────
  const validate = () => {
    const e = { title: '', description: '', deadline: '' };
    let ok = true;

    if (!form.title.trim()) {
      e.title = 'Title is required'; ok = false;
    } else if (form.title.length > 100) {
      e.title = 'Max 100 characters'; ok = false;
    }

    if (!form.description.trim()) {
      e.description = 'Description is required'; ok = false;
    } else if (form.description.length > 500) {
      e.description = 'Max 500 characters'; ok = false;
    }

    if (!form.deadline) {
      e.deadline = 'Deadline is required'; ok = false;
    }

    setErrors(e);
    return ok;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Submit: build FormData, call parent handler ────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');

    const fd = new FormData();
    fd.append('title',       form.title.trim());
    fd.append('description', form.description.trim());
    fd.append('deadline',    form.deadline);
    // 'linkedFile' must match the field name expected by Multer on the backend
    if (file) fd.append('linkedFile', file);

    try {
      const result = await onSubmit(fd);
      if (result?.success !== false) {
        onClose();
      } else {
        setApiError(result.error ?? 'Failed to save task');
      }
    } catch (err) {
      setApiError(err.message ?? 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, boxShadow: '0 24px 64px rgba(0,0,0,0.14)', overflow: 'hidden' }
      }}
    >
      {/* ── Title bar ── */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
          color: 'white', px: 3, py: 2.5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <TaskAltIcon sx={{ fontSize: 26 }} />
          <Typography variant="h6" fontWeight={700} letterSpacing={0.2}>
            {isEdit ? 'Edit Task' : 'Add New Task'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose} disabled={submitting}
          sx={{ color: 'rgba(255,255,255,0.75)',
            '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* ── Form body ── */}
      <DialogContent sx={{ px: 3, py: 3 }}>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
            {apiError}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2.5}>

          <TextField
            label="Task Title" name="title"
            value={form.title} onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title || `${form.title.length}/100`}
            fullWidth required disabled={submitting}
            placeholder="e.g., Study TypeScript"
            inputProps={{ maxLength: 100 }}
            sx={fieldSx}
          />

          <TextField
            label="Description" name="description"
            value={form.description} onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description || `${form.description.length}/500`}
            fullWidth required multiline rows={3}
            disabled={submitting}
            placeholder="Provide details about this task..."
            inputProps={{ maxLength: 500 }}
            sx={fieldSx}
          />

          <TextField
            label="Deadline" name="deadline"
            type="date"
            value={form.deadline} onChange={handleChange}
            error={!!errors.deadline} helperText={errors.deadline}
            fullWidth required disabled={submitting}
            InputLabelProps={{ shrink: true }}
            sx={fieldSx}
          />

          {/* ── FileUpload component ── */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1} fontWeight={500}>
              Linked PDF File&nbsp;
              <Typography component="span" variant="caption" color="text.disabled">
                (optional, max 10 MB)
              </Typography>
            </Typography>

            <FileUpload
              file={file}
              onChange={setFile}
              disabled={submitting}
              isEdit={isEdit}
              hasExisting={editTask?.hasFile ?? false}
              existingName={editTask?.linkedFile?.filename ?? 'Attached PDF'}
              onError={setApiError}
            />
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      {/* ── Actions ── */}
      <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
        <Button
          onClick={onClose} disabled={submitting}
          variant="outlined"
          sx={{
            borderRadius: 2, px: 3, fontWeight: 600,
            borderColor: '#9E9E9E', color: '#616161',
            '&:hover': { borderColor: '#616161', bgcolor: '#F5F5F5' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit} disabled={submitting}
          variant="contained"
          startIcon={
            submitting
              ? <CircularProgress size={15} color="inherit" />
              : isEdit ? <SaveIcon /> : <AddTaskIcon />
          }
          sx={{
            borderRadius: 2, px: 3, fontWeight: 700,
            background: 'linear-gradient(135deg, #1565C0, #1976D2)',
            boxShadow: '0 4px 12px rgba(21,101,192,0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0D47A1, #1565C0)',
              boxShadow: '0 6px 16px rgba(21,101,192,0.5)'
            }
          }}
        >
          {submitting
            ? (isEdit ? 'Updating…' : 'Creating…')
            : (isEdit ? 'Update Task' : 'Create Task')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}
