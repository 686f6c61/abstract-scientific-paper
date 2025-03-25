import React from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

const LoadingState = ({ message = 'Procesando...', variant = 'inline' }) => {
  // Inline variant - used within components
  if (variant === 'inline') {
    return (
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          my: 2
        }}
      >
        <CircularProgress size={24} thickness={4} />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );
  }
  
  // Overlay variant - covers the entire parent container
  if (variant === 'overlay') {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          backdropFilter: 'blur(3px)'
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            maxWidth: '80%'
          }}
        >
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body1" color="text.primary">
            {message}
          </Typography>
        </Paper>
      </Box>
    );
  }
  
  // Fullscreen variant - covers the entire screen
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(5px)'
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          maxWidth: '80%'
        }}
      >
        <CircularProgress size={56} thickness={4} />
        <Typography variant="h6" color="text.primary">
          {message}
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoadingState;
