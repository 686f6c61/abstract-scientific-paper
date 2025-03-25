import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const PdfInfo = ({ pdf }) => {
  if (!pdf) {
    return (
      <Paper sx={{ p: 3, mb: 2, bgcolor: 'background.paper' }}>
        <Typography variant="body1" color="text.secondary" align="center">
          Selecciona un PDF para ver su información
        </Typography>
      </Paper>
    );
  }

  const formattedDate = new Date(pdf.uploadDate).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <InsertDriveFileIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="h3">
          {pdf.originalName}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip 
          label={`${pdf.pages || '?'} páginas`} 
          size="small" 
          color="primary" 
          variant="outlined"
          icon={<DescriptionIcon />}
        />
        <Chip 
          label={`${Math.round(pdf.size / 1024)} KB`} 
          size="small" 
          color="primary" 
          variant="outlined"
          icon={<DataUsageIcon />}
        />
        <Chip 
          label={pdf.isVectorized ? "Vectorizado" : "No vectorizado"} 
          size="small" 
          color={pdf.isVectorized ? "success" : "warning"} 
          variant="outlined"
          icon={pdf.isVectorized ? <CheckCircleIcon /> : <PendingIcon />}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <List dense>
        <ListItem>
          <ListItemIcon>
            <CalendarTodayIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Fecha de carga" 
            secondary={formattedDate} 
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <InsertDriveFileIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Nombre del archivo" 
            secondary={pdf.filename} 
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <DataUsageIcon color="primary" />
          </ListItemIcon>
          <Tooltip title="ID único del documento en el sistema">
            <ListItemText 
              primary="ID del documento" 
              secondary={pdf.id} 
            />
          </Tooltip>
        </ListItem>
      </List>

      {pdf.metadata && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Metadatos extraídos
          </Typography>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: 1,
            maxHeight: '200px',
            overflow: 'auto',
            fontSize: '0.85rem'
          }}>
            <pre>{JSON.stringify(pdf.metadata, null, 2)}</pre>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default PdfInfo;
