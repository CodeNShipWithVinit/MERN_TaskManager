import React from 'react';
import { Box, Button, Typography, Chip, IconButton } from '@mui/material';
import UploadFileIcon   from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon       from '@mui/icons-material/Delete';

import { validatePdfFile, formatFileSize } from '../utils';

/**
 * FileUpload  (components/FileUpload.jsx)
 *
 * A self-contained PDF upload widget extracted from TaskModal.
 * Handles its own file-type / size validation, then surfaces the
 * validated File (or null) to the parent via `onChange`.
 *
 * Props:
 *   file          File|null      — currently selected file (controlled)
 *   onChange      (File|null) => void
 *   disabled      boolean
 *   isEdit        boolean        — true when editing an existing task
 *   hasExisting   boolean        — task already has a PDF attached
 *   existingName  string         — filename of the existing PDF
 *   onError       (msg) => void  — called when validation fails
 */
export default function FileUpload({
  file,
  onChange,
  disabled     = false,
  isEdit       = false,
  hasExisting  = false,
  existingName = 'Attached PDF',
  onError
}) {

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const err = validatePdfFile(selected);
    if (err) {
      onError?.(err);
      return;
    }

    onChange(selected);
  };

  const handleRemove = () => onChange(null);

  // ── File selected: show preview chip ────────────────────────────────
  if (file) {
    return (
      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        p={1.5}
        sx={{
          bgcolor:      '#E3F2FD',
          borderRadius: 2,
          border:       '1px solid #90CAF9'
        }}
      >
        <PictureAsPdfIcon color="error" />

        <Typography variant="body2" flex={1} noWrap fontWeight={500}>
          {file.name}
        </Typography>

        <Chip
          label={formatFileSize(file.size)}
          size="small"
          sx={{ bgcolor: '#BBDEFB', fontSize: '0.68rem' }}
        />

        <IconButton
          size="small"
          onClick={handleRemove}
          disabled={disabled}
          sx={{ color: '#d32f2f' }}
          aria-label="Remove selected file"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  // ── No file selected: show upload button ────────────────────────────
  const inputId = 'pdf-upload-input';

  return (
    <Box>
      <input
        accept="application/pdf"
        id={inputId}
        type="file"
        style={{ display: 'none' }}
        onChange={handleChange}
        disabled={disabled}
        // Reset value so the same file can be re-selected after removal
        onClick={(e) => { e.target.value = ''; }}
      />
      <label htmlFor={inputId}>
        <Button
          component="span"
          variant="outlined"
          startIcon={<UploadFileIcon />}
          disabled={disabled}
          fullWidth
          sx={{
            borderRadius: 2,
            borderStyle:  'dashed',
            borderColor:  '#90CAF9',
            color:        '#1976D2',
            py:           1.5,
            '&:hover': {
              borderColor: '#1565C0',
              bgcolor:     '#E3F2FD',
              borderStyle: 'dashed'
            }
          }}
        >
          {isEdit && hasExisting ? 'Replace PDF File' : 'Upload PDF File'}
        </Button>
      </label>

      {/* Hint when editing and an existing file is already attached */}
      {isEdit && hasExisting && (
        <Typography
          variant="caption"
          color="text.secondary"
          mt={0.5}
          display="block"
        >
          📎 Current: {existingName} — leave empty to keep it
        </Typography>
      )}
    </Box>
  );
}
