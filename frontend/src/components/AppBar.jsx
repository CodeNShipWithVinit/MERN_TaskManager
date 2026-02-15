import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Box
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

/**
 * AppBar  (components/AppBar.jsx)
 *
 * Top navigation bar.  Kept intentionally simple — branding only.
 * The "Add Task" call-to-action lives in TaskManager so that it has
 * direct access to the modal-open state without prop-drilling.
 */
export default function AppBar() {
  return (
    <MuiAppBar
      position="sticky"
      elevation={0}
      sx={{
        background:   'linear-gradient(135deg, #0D47A1 0%, #1565C0 60%, #1976D2 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
        {/* Brand mark */}
        <Box display="flex" alignItems="center" gap={1.2}>
          <AssignmentIcon sx={{ fontSize: 28, color: 'rgba(255,255,255,0.95)' }} />
          <Typography
            variant="h6"
            fontWeight={800}
            letterSpacing={0.3}
            sx={{ color: 'white', userSelect: 'none' }}
          >
            Task Manager
          </Typography>
        </Box>

        {/* Spacer */}
        <Box flex={1} />

        {/* Subtle tagline */}
        <Typography
          variant="caption"
          sx={{
            color:       'rgba(255,255,255,0.55)',
            letterSpacing: 0.5,
            display:     { xs: 'none', sm: 'block' }
          }}
        >
          MERN · MUI
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
}
