import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Componente que muestra el artículo de revisión generado
 */
const ReviewArticleDisplay = ({
  reviewArticle,
  reviewArticleLoading,
  currentSection
}) => {
  const downloadArticle = () => {
    const element = document.createElement('a');
    const file = new Blob([reviewArticle.content], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = 'review_article.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyArticle = () => {
    navigator.clipboard.writeText(reviewArticle.content)
      .then(() => alert('Artículo copiado al portapapeles'))
      .catch(err => console.error('Error al copiar: ', err));
  };

  if (reviewArticleLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 'medium' }}>
          Generando artículo de revisión...
        </Typography>
        {currentSection && (
          <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
            Sección actual: {currentSection}
          </Typography>
        )}
      </Box>
    );
  }

  if (!reviewArticle) {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        bgcolor: '#1976d2',
        color: 'white',
        p: 2,
        borderRadius: 2,
        boxShadow: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Artículo de Revisión Generado
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<ContentCopyIcon />} 
            onClick={copyArticle}
            sx={{ mr: 1, bgcolor: 'white', color: '#1976d2', '&:hover': { bgcolor: '#f0f7ff' } }}
          >
            Copiar
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<DownloadIcon />} 
            onClick={downloadArticle}
            sx={{ bgcolor: 'white', color: '#1976d2', '&:hover': { bgcolor: '#f0f7ff' } }}
          >
            Descargar
          </Button>
        </Box>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          bgcolor: '#FAFAFA',
          border: '1px solid #e0e0e0',
          maxHeight: '500px',
          overflow: 'auto'
        }}
      >
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
          {reviewArticle.content || 'No hay contenido disponible'}
        </ReactMarkdown>
      </Paper>
    </Box>
  );
};

export default ReviewArticleDisplay;
