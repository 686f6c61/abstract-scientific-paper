import React from 'react';
import {
  Box,
  Typography,
  LinearProgress
} from '@mui/material';

/**
 * Componente que muestra el progreso del procesamiento por lotes
 */
const ProgressDisplay = ({ batchProcessing, batchProgress }) => {
  if (!batchProcessing) return null;
  
  const progress = (batchProgress.current / batchProgress.total) * 100;
  
  return (
    <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          Procesando PDF {batchProgress.current} de {batchProgress.total}
        </Typography>
        <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
          {Math.round(progress)}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 8, 
          borderRadius: 5,
          bgcolor: 'rgba(0, 0, 0, 0.05)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            bgcolor: 'primary.main'
          }
        }} 
      />
    </Box>
  );
};

export default ProgressDisplay;
