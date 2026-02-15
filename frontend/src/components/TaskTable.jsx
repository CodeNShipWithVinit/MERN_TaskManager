import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  alpha
} from '@mui/material';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';
import EditIcon          from '@mui/icons-material/Edit';
import DeleteIcon        from '@mui/icons-material/Delete';
import PictureAsPdfIcon  from '@mui/icons-material/PictureAsPdf';
import InboxIcon         from '@mui/icons-material/Inbox';
import AddIcon           from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon    from '@mui/icons-material/AccessTime';

import StatusChip from './StatusChip';
// formatDate and isOverdue live in utils — imported here, not redefined
import { formatDate, isOverdue } from '../utils';

// ── Column headers ─────────────────────────────────────────────────────────
const COLUMNS = ['#', 'Title', 'Description', 'Created On', 'Deadline', 'Status', 'Actions'];

// ── Component ──────────────────────────────────────────────────────────────

/**
 * TaskTable  (components/TaskTable.jsx)
 *
 * Pure presentational component — all data and callbacks come from
 * TaskManager via props.
 *
 * Props:
 *   tasks        Task[]   — the list to render
 *   onMarkAsDone (task) => void
 *   onEdit       (task) => void
 *   onDelete     (task) => void
 *   onDownload   (task) => void
 *   onAddTask    ()     => void   — called from the empty-state CTA
 */
export default function TaskTable({ tasks, onMarkAsDone, onEdit, onDelete, onDownload, onAddTask }) {

  // ── Empty state ──────────────────────────────────────────────
  if (tasks.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border:       '1px solid rgba(21,101,192,0.1)',
          boxShadow:    '0 4px 24px rgba(0,0,0,0.06)'
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={14}
        >
          <Box
            sx={{
              width: 96, height: 96, borderRadius: '50%',
              bgcolor: '#EEF2FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 3
            }}
          >
            <InboxIcon sx={{ fontSize: 46, color: '#9FA8DA' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="text.secondary" mb={0.5}>
            No Tasks Found
          </Typography>
          <Typography variant="body2" color="text.disabled" mb={3} textAlign="center">
            You haven&apos;t created any tasks yet.<br />
            Click "Add Task" to get started!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddTask}
            sx={{
              borderRadius: 2.5, px: 4, py: 1.2,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1565C0, #1976D2)',
              boxShadow:  '0 4px 12px rgba(21,101,192,0.38)',
              '&:hover':  { background: 'linear-gradient(135deg, #0D47A1, #1565C0)' }
            }}
          >
            Add Your First Task
          </Button>
        </Box>
      </Paper>
    );
  }

  // ── Data table ───────────────────────────────────────────────
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
      <TableContainer>
        <Table>

          {/* ── Head ── */}
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)' }}>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    color:       'white',
                    fontWeight:  700,
                    fontSize:    '0.78rem',
                    letterSpacing: 0.6,
                    py: 2,
                    textTransform: 'uppercase',
                    whiteSpace:  'nowrap'
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* ── Body ── */}
          <TableBody>
            {tasks.map((task, idx) => (
              <TableRow
                key={task._id}
                sx={{
                  bgcolor: idx % 2 === 0 ? 'white' : '#FAFBFF',
                  '&:hover': {
                    bgcolor: alpha('#1565C0', 0.04),
                    transition: 'background-color 0.18s ease'
                  },
                  '&:last-child td': { borderBottom: 0 }
                }}
              >

                {/* # */}
                <TableCell sx={{ py: 2, width: 52 }}>
                  <Box
                    sx={{
                      width: 28, height: 28, borderRadius: '50%',
                      bgcolor: '#EEF2FF', color: '#1565C0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.72rem', fontWeight: 700
                    }}
                  >
                    {idx + 1}
                  </Box>
                </TableCell>

                {/* Title */}
                <TableCell sx={{ py: 2, minWidth: 160 }}>
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {task.title}
                  </Typography>
                  {task.hasFile && (
                    <Chip
                      icon={<PictureAsPdfIcon sx={{ fontSize: '0.72rem !important' }} />}
                      label="PDF"
                      size="small"
                      sx={{
                        mt: 0.5, height: 20, fontSize: '0.64rem',
                        bgcolor: '#FFEBEE', color: '#C62828',
                        '& .MuiChip-icon': { color: '#C62828', ml: 0.5 }
                      }}
                    />
                  )}
                </TableCell>

                {/* Description */}
                <TableCell sx={{ py: 2, maxWidth: 240 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {task.description}
                  </Typography>
                </TableCell>

                {/* Created On */}
                <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTimeIcon sx={{ fontSize: 13, color: '#BDBDBD' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(task.createdOn)}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Deadline */}
                <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CalendarTodayIcon sx={{ fontSize: 13, color: isOverdue(task) ? '#D32F2F' : '#BDBDBD' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color:      isOverdue(task) ? '#D32F2F' : 'text.secondary',
                        fontWeight: isOverdue(task) ? 700 : 400
                      }}
                    >
                      {formatDate(task.deadline)}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Status */}
                <TableCell sx={{ py: 2 }}>
                  <StatusChip task={task} />
                </TableCell>

                {/* Actions */}
                <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
                  <Stack direction="row" spacing={0.5}>

                    {/* Mark as Done — only for TODO tasks */}
                    {task.status === 'TODO' && (
                      <Tooltip title="Mark as Done" arrow>
                        <IconButton
                          size="small"
                          onClick={() => onMarkAsDone(task)}
                          sx={{
                            color: '#2E7D32', bgcolor: '#E8F5E9',
                            width: 32, height: 32,
                            '&:hover': { bgcolor: '#C8E6C9' }
                          }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Download PDF */}
                    {task.hasFile && (
                      <Tooltip title="Download PDF" arrow>
                        <IconButton
                          size="small"
                          onClick={() => onDownload(task)}
                          sx={{
                            color: '#C62828', bgcolor: '#FFEBEE',
                            width: 32, height: 32,
                            '&:hover': { bgcolor: '#FFCDD2' }
                          }}
                        >
                          <PictureAsPdfIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Edit */}
                    <Tooltip title="Edit Task" arrow>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(task)}
                        sx={{
                          color: '#1565C0', bgcolor: '#E3F2FD',
                          width: 32, height: 32,
                          '&:hover': { bgcolor: '#BBDEFB' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* Delete */}
                    <Tooltip title="Delete Task" arrow>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(task)}
                        sx={{
                          color: '#D32F2F', bgcolor: '#FFEBEE',
                          width: 32, height: 32,
                          '&:hover': { bgcolor: '#FFCDD2' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row count footer */}
      <Box
        px={2.5} py={1.2}
        sx={{ borderTop: '1px solid rgba(21,101,192,0.07)', bgcolor: '#FAFBFF' }}
      >
        <Typography variant="caption" color="text.disabled">
          Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </Typography>
      </Box>
    </Paper>
  );
}
