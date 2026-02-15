import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

import AppBar      from './components/AppBar';
import TaskManager from './components/TaskManager';

/**
 * Global MUI theme
 * Font: Nunito — friendly, rounded, modern
 */
const theme = createTheme({
  palette: {
    primary: {
      main:  '#1565C0',
      light: '#1976D2',
      dark:  '#0D47A1'
    },
    secondary: { main: '#F57C00' },
    background: { default: '#EEF2FF' }
  },
  typography: {
    fontFamily: '"Nunito", "Segoe UI", -apple-system, sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 }
      }
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } }
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: 'rgba(21, 101, 192, 0.08)' }
      }
    }
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* ① Navbar */}
      <AppBar />

      {/* ② Page body */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #EEF2FF 0%, #F0F7FF 50%, #EFF6FF 100%)',
          pt: 3,
          pb: 6
        }}
      >
        {/* ③ TaskManager owns all state and renders TaskTable + modals */}
        <TaskManager />
      </Box>
    </ThemeProvider>
  );
}
