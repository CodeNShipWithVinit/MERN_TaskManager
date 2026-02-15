import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Divider
} from '@mui/material';
import WarningAmberIcon  from '@mui/icons-material/WarningAmber';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

/**
 * DeleteConfirmDialog  (components/DeleteConfirmDialog.jsx)
 *
 * Props:
 *   open      boolean
 *   onClose   () => void
 *   onConfirm () => void   — called when the user confirms deletion
 *   taskTitle string       — shown in the message for clarity
 */
export default function DeleteConfirmDialog({ open, onClose, onConfirm, taskTitle }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 24px 64px rgba(0,0,0,0.14)' } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <WarningAmberIcon sx={{ color: '#ED6C02', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700}>Confirm Delete</Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 2.5, px: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Are you sure you want to delete{' '}
          <strong style={{ color: '#1565C0' }}>"{taskTitle}"</strong>?
        </Typography>
        <Typography variant="body2" color="error" mt={1.5} fontWeight={600}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1.5 }}>
        <Button
          onClick={onClose}
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
          onClick={onConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          sx={{
            borderRadius: 2, px: 3, fontWeight: 700,
            background: 'linear-gradient(135deg, #C62828, #D32F2F)',
            '&:hover':  { background: 'linear-gradient(135deg, #B71C1C, #C62828)' }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
