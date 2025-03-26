import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

/**
 * Función para formatear bytes a una unidad legible
 */
const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || isNaN(bytes)) return '0 B';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Componente que muestra la lista de PDFs disponibles y permite seleccionarlos
 */
const PdfList = ({ 
  pdfs, 
  selectedPdfs, 
  togglePdfSelection,
  getFilenameWithoutExtension
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
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'white', display: 'flex', alignItems: 'center' }}>
          <PictureAsPdfIcon sx={{ mr: 1, fontSize: '1.2rem' }} /> Artículos
        </Typography>
        <Box sx={{ bgcolor: 'background.paper', color: 'primary.main', borderRadius: 4, px: 1.5, py: 0.3, fontWeight: 'medium', fontSize: '0.875rem' }}>
          {pdfs.length} artículo{pdfs.length !== 1 ? 's' : ''}
        </Box>
      </Box>
      
      <Paper 
        elevation={1}
        sx={{ 
          maxHeight: 350, 
          overflow: 'auto', 
          p: 2, 
          mb: 3,
          borderRadius: 1,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <List dense disablePadding>
          {pdfs.map((pdf) => (
            <ListItem 
              key={pdf.id} 
              dense 
              button 
              onClick={() => togglePdfSelection(pdf.id)}
              sx={{
                borderRadius: 1,
                mb: 1,
                bgcolor: selectedPdfs.includes(pdf.id) ? 'action.selected' : 'background.default',
                border: '1px solid',
                borderColor: selectedPdfs.includes(pdf.id) ? 'primary.light' : 'divider',
                '&:hover': {
                  bgcolor: selectedPdfs.includes(pdf.id) ? 'action.selected' : 'action.hover',
                  borderColor: 'primary.light'
                },
                py: 1,
                transition: 'all 0.15s ease'
              }}
              secondaryAction={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ 
                    mr: 1, 
                    color: selectedPdfs.includes(pdf.id) ? 'primary.main' : 'text.secondary',
                    fontWeight: selectedPdfs.includes(pdf.id) ? 'medium' : 'regular'
                  }}>
                    {pdf.fileSize ? formatBytes(pdf.fileSize) : '0 B'}
                  </Typography>
                  <Checkbox
                    edge="end"
                    size="small"
                    checked={selectedPdfs.includes(pdf.id)}
                    color="primary"
                    onChange={() => togglePdfSelection(pdf.id)}
                  />
                </Box>
              }
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {selectedPdfs.includes(pdf.id) ? (
                  <CheckCircleIcon color="primary" sx={{ fontSize: 22 }} />
                ) : (
                  <PictureAsPdfIcon color="primary" sx={{ fontSize: 22, opacity: 0.7 }} />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={getFilenameWithoutExtension(pdf.filename)}
                primaryTypographyProps={{ 
                  variant: 'body1', 
                  noWrap: true,
                  sx: {
                    fontWeight: selectedPdfs.includes(pdf.id) ? 'bold' : 'medium',
                    color: selectedPdfs.includes(pdf.id) ? 'primary.main' : 'text.primary',
                    fontSize: '0.95rem'
                  }
                }}
                secondary={`Tamaño: ${formatBytes(pdf.size)}`}
                secondaryTypographyProps={{ 
                  variant: 'caption',
                  sx: {
                    color: selectedPdfs.includes(pdf.id) ? 'primary.dark' : 'text.secondary'
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
};

export default PdfList;
