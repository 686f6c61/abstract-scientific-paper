import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Checkbox, 
  Typography, 
  Tooltip, 
  Chip,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { usePdf } from '../contexts/PdfContext';

const PdfList = () => {
  const { pdfs, selectedPdfs, togglePdfSelection, deletePdf } = usePdf();

  if (pdfs.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        No hay PDFs cargados. Utiliza el botón "Subir PDF" para comenzar.
      </Typography>
    );
  }

  return (
    <List dense sx={{ mt: 2, maxHeight: '60vh', overflow: 'auto' }}>
      {pdfs.map((pdf) => {
        const labelId = `checkbox-list-label-${pdf.id}`;
        const isSelected = selectedPdfs.includes(pdf.id);

        return (
          <ListItem 
            key={pdf.id}
            sx={{ 
              mb: 1,
              borderRadius: 1,
              border: '1px solid',
              borderColor: isSelected ? 'primary.main' : 'grey.200',
              bgcolor: isSelected ? 'primary.light' : 'background.paper',
              '&:hover': {
                bgcolor: isSelected ? 'primary.light' : 'grey.50',
              },
            }}
          >
            <Checkbox
              edge="start"
              checked={isSelected}
              onChange={() => togglePdfSelection(pdf.id)}
              inputProps={{ 'aria-labelledby': labelId }}
              sx={{ color: isSelected ? 'white' : 'inherit' }}
            />
            <ListItemText
              id={labelId}
              primary={
                <Typography 
                  variant="body1" 
                  component="div" 
                  noWrap
                  sx={{ 
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? 'white' : 'text.primary',
                  }}
                >
                  {pdf.originalName}
                </Typography>
              }
              secondary={
                <Typography component="div" variant="body2">
                  <Box sx={{ mt: 0.5 }}>
                    <Chip 
                      label={`${pdf.pageCount} páginas`} 
                      size="small" 
                      sx={{ 
                        mr: 0.5, 
                        bgcolor: isSelected ? 'primary.dark' : 'grey.100',
                        color: isSelected ? 'white' : 'text.secondary',
                      }} 
                    />
                    {pdf.vectorized && (
                      <Chip 
                        label="Vectorizado" 
                        size="small" 
                        sx={{ 
                          bgcolor: isSelected ? 'success.dark' : 'success.light',
                          color: isSelected ? 'white' : 'text.secondary',
                        }} 
                      />
                    )}
                  </Box>
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="Información">
                <IconButton edge="end" aria-label="info" sx={{ mr: 1 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => deletePdf(pdf.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};

export default PdfList;
