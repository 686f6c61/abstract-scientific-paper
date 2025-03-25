import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';

/**
 * Componente que muestra la lista de resúmenes disponibles
 */
const SummaryList = ({
  batchSummaries,
  selectedBatchSummaries,
  toggleBatchSummarySelection,
  getFilenameWithoutExtension,
  openSummaryDialog
}) => {
  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 1, 
        bgcolor: 'primary.main', 
        p: 1.5, 
        borderRadius: 1,
        boxShadow: 1
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center' }}>
          <DescriptionIcon sx={{ mr: 1 }} /> Resúmenes disponibles:
        </Typography>
        <Box sx={{ bgcolor: 'white', color: '#1976d2', borderRadius: 8, px: 2, py: 0.5, fontWeight: 'bold', fontSize: '1.1rem' }}>
          {batchSummaries.length} resumen{batchSummaries.length !== 1 ? 'es' : ''}
        </Box>
      </Box>
      
      <Paper 
        elevation={4}
        sx={{ 
          maxHeight: 350, 
          overflow: 'auto', 
          p: 2.5, 
          mb: 4,
          borderRadius: 2,
          bgcolor: 'white',
          border: '2px solid #1976d2'
        }}
      >
        <List dense disablePadding>
          {batchSummaries.map((summary) => (
            <ListItem
              key={summary.id}
              sx={{
                borderRadius: 2,
                mb: 1.5,
                bgcolor: selectedBatchSummaries.includes(summary.id) 
                  ? 'rgba(25, 118, 210, 0.2)' 
                  : summary.error 
                    ? 'rgba(211, 47, 47, 0.1)' 
                    : '#f8f8f8',
                border: '2px solid',
                borderColor: summary.error 
                  ? 'error.main' 
                  : selectedBatchSummaries.includes(summary.id) 
                    ? 'primary.main' 
                    : '#e0e0e0',
                py: 1,
                px: 2,
                '&:hover': {
                  bgcolor: summary.error 
                    ? 'rgba(211, 47, 47, 0.15)' 
                    : selectedBatchSummaries.includes(summary.id) 
                      ? 'rgba(25, 118, 210, 0.3)' 
                      : '#f0f0f0',
                  boxShadow: 1
                },
                boxShadow: selectedBatchSummaries.includes(summary.id) ? 2 : 0,
                transition: 'all 0.2s ease'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%', 
                overflow: 'hidden' 
              }}>
                <ListItemIcon sx={{ minWidth: 45 }}>
                  {selectedBatchSummaries.includes(summary.id) ? (
                    <CheckCircleIcon color="primary" sx={{ fontSize: 28 }} />
                  ) : (
                    <DescriptionIcon color="error" sx={{ fontSize: 28 }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={getFilenameWithoutExtension(summary.filename)}
                  secondary={
                    summary.error
                      ? 'Error al procesar este documento'
                      : `Procesado: ${new Date(summary.timestamp).toLocaleString()}`
                  }
                  primaryTypographyProps={{ 
                    variant: 'body1', 
                    noWrap: true, 
                    sx: { 
                      fontWeight: selectedBatchSummaries.includes(summary.id) ? 'bold' : 'medium',
                      color: selectedBatchSummaries.includes(summary.id) ? 'primary.main' : 'text.primary',
                      fontSize: '0.95rem' 
                    }
                  }}
                  secondaryTypographyProps={{ 
                    variant: 'caption', 
                    noWrap: true, 
                    sx: { 
                      color: selectedBatchSummaries.includes(summary.id) ? 'primary.dark' : 'text.secondary',
                      fontWeight: selectedBatchSummaries.includes(summary.id) ? 'medium' : 'regular' 
                    }
                  }}
                />
              </Box>
              <Tooltip title="Ver contenido">
                <IconButton 
                  edge="end" 
                  onClick={() => openSummaryDialog(summary)}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
};

export default SummaryList;
