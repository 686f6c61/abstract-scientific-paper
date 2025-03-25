import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Diálogo que muestra el contenido detallado de un resumen
 */
const SummaryDialog = ({
  open,
  selectedSummary,
  selectedBatchSummaries,
  toggleBatchSummarySelection,
  handleCloseSummaryDialog
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={handleCloseSummaryDialog}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 10
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
      }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {selectedSummary?.filename ? `Resumen: ${selectedSummary.filename}` : 'Detalle del Resumen'}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseSummaryDialog}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        {selectedSummary?.error ? (
          <Box sx={{ p: 2 }}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 2,
              border: '1px solid #d32f2f',
              bgcolor: 'rgba(211, 47, 47, 0.08)'
            }}>
              <Typography color="error" variant="subtitle1" gutterBottom fontWeight="medium">
                Error al procesar el documento
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }} color="text.secondary">
                {selectedSummary.error}
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: '#FAFAFA' }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => (
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2 }} {...props} />
                  ),
                  h2: ({node, ...props}) => (
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark', mt: 2 }} {...props} />
                  ),
                  h3: ({node, ...props}) => (
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mt: 2 }} {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }} {...props} />
                  ),
                  a: ({node, ...props}) => (
                    <Box component="a" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }} {...props} />
                  ),
                  ul: ({node, ...props}) => (
                    <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}} {...props} />
                  ),
                  ol: ({node, ...props}) => (
                    <ol style={{paddingLeft: '1.5rem', marginBottom: '1rem'}} {...props} />
                  ),
                  li: ({node, ...props}) => (
                    <li style={{marginBottom: '0.25rem'}} {...props} />
                  ),
                  code: ({node, inline, ...props}) => (
                    inline
                      ? <code style={{backgroundColor: '#f5f5f5', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace', color: '#e53935'}} {...props} />
                      : <code style={{display: 'block', backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontFamily: 'monospace'}} {...props} />
                  ),
                }}
              >
                {selectedSummary?.content || selectedSummary?.summary || 'No hay contenido disponible'}
              </ReactMarkdown>
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0', justifyContent: 'space-between' }}>
        <Button onClick={handleCloseSummaryDialog} color="primary" variant="outlined" startIcon={<CloseIcon />}>
          Cerrar
        </Button>
        <Box>
          {selectedSummary && !selectedSummary.error && (
            <>
              <Button 
                onClick={() => {
                  if (selectedSummary) {
                    toggleBatchSummarySelection(selectedSummary.id);
                  }
                }} 
                color={selectedBatchSummaries.includes(selectedSummary.id) ? "error" : "success"}
                variant="contained"
                startIcon={selectedBatchSummaries.includes(selectedSummary.id) ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
                sx={{ mr: 1 }}
              >
                {selectedBatchSummaries.includes(selectedSummary.id) ? "Quitar" : "Incluir"}
              </Button>
              <Button 
                onClick={() => {
                  const contentToCopy = selectedSummary.content || selectedSummary.summary || '';
                  navigator.clipboard.writeText(contentToCopy)
                    .then(() => alert('Contenido copiado al portapapeles'))
                    .catch(err => console.error('Error al copiar: ', err));
                }} 
                color="primary" 
                variant="contained"
                startIcon={<ContentCopyIcon />}
              >
                Copiar
              </Button>
            </>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SummaryDialog;
