import React from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon    from '@mui/icons-material/CheckCircle';
import TaskAltIcon        from '@mui/icons-material/TaskAlt';
import ErrorIcon          from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HelpOutlineIcon    from '@mui/icons-material/HelpOutline';

import { getDisplayStatus } from '../utils';

const CONFIG = {
  'In Progress': {
    icon: <HourglassEmptyIcon fontSize="small" />,
    sx: {
      bgcolor: '#FFF8E1', color: '#856404',
      border: '1px solid #FFD54F', fontWeight: 700
    }
  },
  Done: {
    icon: <TaskAltIcon fontSize="small" />,
    sx: {
      bgcolor: '#E3F2FD', color: '#0D47A1',
      border: '1px solid #42A5F5', fontWeight: 700
    }
  },
  Achieved: {
    icon: <CheckCircleIcon fontSize="small" />,
    sx: {
      bgcolor: '#E8F5E9', color: '#1B5E20',
      border: '1px solid #66BB6A', fontWeight: 700
    }
  },
  Failed: {
    icon: <ErrorIcon fontSize="small" />,
    sx: {
      bgcolor: '#FFEBEE', color: '#7F0000',
      border: '1px solid #EF5350', fontWeight: 700
    }
  }
};

const FALLBACK_CONFIG = {
  icon: <HelpOutlineIcon fontSize="small" />,
  sx: {
    bgcolor: '#F5F5F5', color: '#616161',
    border: '1px solid #BDBDBD', fontWeight: 700
  }
};

export default function StatusChip({ task }) {
  const label  = getDisplayStatus(task);
  const config = CONFIG[label];

  if (!config) {
    console.warn(
      '[StatusChip] unexpected label:', JSON.stringify(label),
      '— task:', JSON.stringify({ status: task?.status, deadline: task?.deadline })
    );
  }

  const { icon, sx } = config ?? FALLBACK_CONFIG;

  return (
    <Chip
      label={label ?? 'Unknown'}
      icon={icon}
      size="small"
      sx={{
        ...sx,
        fontSize: '0.72rem',
        height: 26,
        '& .MuiChip-icon': { color: 'inherit' }
      }}
    />
  );
}