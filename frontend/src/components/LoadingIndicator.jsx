import React from 'react';
import {
  Box,
  Paper,
  Skeleton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

/**
 * LoadingIndicator  (components/LoadingIndicator.jsx)
 *
 * Shown in place of the TaskTable while tasks are being fetched from the
 * backend.  Using a skeleton that mirrors the real table shape means the
 * page never feels "blank" — the user immediately understands what is
 * loading and roughly how much content to expect.
 *
 * This solves the poor-UX problem on slow connections (e.g. 3G throttling)
 * where without this the screen would be empty for several seconds.
 *
 * Props:
 *   rows  number  — how many skeleton rows to render (default 5)
 */
const COLUMNS = ['#', 'Title', 'Description', 'Created On', 'Deadline', 'Status', 'Actions'];

// Width hints per column so skeleton shapes feel realistic
const COL_WIDTHS = {
  '#':           28,
  Title:         140,
  Description:   200,
  'Created On':  90,
  Deadline:      90,
  Status:        80,
  Actions:       110
};

export default function LoadingIndicator({ rows = 5 }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow:     'hidden',
        border:       '1px solid rgba(21,101,192,0.1)',
        boxShadow:    '0 4px 24px rgba(0,0,0,0.06)'
      }}
    >
      {/* ── Animated header message ── */}
      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        px={3}
        py={1.8}
        sx={{
          borderBottom: '1px solid rgba(21,101,192,0.08)',
          bgcolor:      '#FAFBFF'
        }}
      >
        <Skeleton variant="circular" width={10} height={10} sx={{ bgcolor: '#BBDEFB', flexShrink: 0 }} />
        <Typography variant="caption" color="text.disabled" letterSpacing={0.4}>
          Fetching your tasks…
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          {/* ── Table head (real headers, not skeleton) ── */}
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)' }}>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    color:         'white',
                    fontWeight:    700,
                    fontSize:      '0.78rem',
                    letterSpacing: 0.6,
                    py: 2,
                    textTransform: 'uppercase',
                    whiteSpace:    'nowrap'
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* ── Skeleton rows ── */}
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <TableRow
                key={rowIdx}
                sx={{
                  bgcolor: rowIdx % 2 === 0 ? 'white' : '#FAFBFF',
                  '&:last-child td': { borderBottom: 0 }
                }}
              >
                {COLUMNS.map((col) => (
                  <TableCell key={col} sx={{ py: 2 }}>
                    {col === 'Status' ? (
                      /* Pill-shaped skeleton for status chip */
                      <Skeleton
                        variant="rounded"
                        width={72}
                        height={24}
                        sx={{ borderRadius: 99, bgcolor: '#E8EAF6' }}
                      />
                    ) : col === 'Actions' ? (
                      /* Row of circle skeletons for icon buttons */
                      <Box display="flex" gap={0.6}>
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton
                            key={i}
                            variant="circular"
                            width={30}
                            height={30}
                            sx={{ bgcolor: '#E8EAF6' }}
                          />
                        ))}
                      </Box>
                    ) : col === '#' ? (
                      <Skeleton
                        variant="circular"
                        width={28}
                        height={28}
                        sx={{ bgcolor: '#E8EAF6' }}
                      />
                    ) : (
                      <Skeleton
                        variant="text"
                        width={COL_WIDTHS[col]}
                        height={18}
                        sx={{ bgcolor: '#E8EAF6' }}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
