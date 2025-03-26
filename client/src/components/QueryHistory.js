import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ReplyIcon from '@mui/icons-material/Reply';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import RestoreIcon from '@mui/icons-material/Restore';
import SummarizeIcon from '@mui/icons-material/Summarize';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePdf } from '../contexts/PdfContext';

const QueryHistory = ({ onSelectQuery }) => {
  const { 
    queryHistory, 
    deleteQueryFromHistory, 
    clearQueryHistory, 
    toggleQuerySelection, 
    selectedQueries,
    processQuery,
    queryLoading 
  } = usePdf();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentQueryId, setCurrentQueryId] = useState(null);
  const [replyMode, setReplyMode] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const handleMenuOpen = (event, queryId) => {
    setAnchorEl(event.currentTarget);
    setCurrentQueryId(queryId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentQueryId(null);
  };
  
  // Activar el modo de respuesta para una consulta
  const handleReplyMode = (queryId) => {
    setReplyMode(queryId);
    setReplyText('');
    handleMenuClose();
  };
  
  // Cancelar el modo de respuesta
  const handleCancelReply = () => {
    setReplyMode(null);
    setReplyText('');
  };
  
  // Enviar una respuesta/consulta anidada
  const handleSendReply = async (queryId) => {
    if (!replyText.trim()) {
      setError('Por favor, ingresa una consulta');
      return;
    }
    
    const parentQuery = queryHistory.find(q => q.id === queryId);
    if (!parentQuery) return;
    
    try {
      setError(null);
      // Usar el mismo modelo que la consulta original
      await processQuery(replyText, parentQuery.model, [], 8000, 0.7);
      setReplyMode(null);
      setReplyText('');
    } catch (err) {
      setError(`Error al procesar la consulta: ${err.message}`);
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    handleMenuClose();
  };
  
  const handleDownload = (query, format = 'md') => {
    const element = document.createElement('a');
    let content = `# Consulta: ${query.query}\n\n${query.response}`;
    if (query.sources && query.sources.length > 0) {
      content += '\n\n## Fuentes:\n';
      query.sources.forEach((source, index) => {
        content += `\n### Fuente ${index + 1}:\n${source.content}\n`;
      });
    }
    
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `consulta_${new Date(query.timestamp).toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    handleMenuClose();
  };

  const handleDelete = (queryId) => {
    deleteQueryFromHistory(queryId);
    handleMenuClose();
    // Si estábamos en modo respuesta para esta consulta, salimos de él
    if (replyMode === queryId) {
      setReplyMode(null);
    }
  };

  console.log('Estado del historial de consultas:', queryHistory);
  console.log('¿Tipo de queryHistory?:', typeof queryHistory, Array.isArray(queryHistory));
  console.log('¿Longitud del historial?:', queryHistory ? queryHistory.length : 'undefined');
  
  // Si no hay consultas guardadas, mostrar mensaje
  if (!queryHistory || queryHistory.length === 0 || !Array.isArray(queryHistory)) {
    return (
      <Paper sx={{ p: 3, mt: 3, borderRadius: 2, bgcolor: '#f9f9f9' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', py: 4 }}>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <QuestionAnswerIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5, mr: 1 }} />
            <SummarizeIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Historial de consultas y resúmenes vacío
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Cuando realices consultas, aparecerán aquí para que puedas revisarlas más tarde.
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Ordenar consultas con las más recientes primero
  const sortedHistory = [...queryHistory].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          Historial de consultas y resúmenes
        </Typography>
        <Box>
          {selectedQueries.length > 0 && (
            <Chip 
              label={`${selectedQueries.length} seleccionadas`}
              color="primary"
              size="small"
              sx={{ mr: 1 }}
            />
          )}
          <Tooltip title="Limpiar historial">
            <IconButton onClick={clearQueryHistory} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {sortedHistory.map((query) => (
        <Accordion
          key={query.id}
          sx={{ 
            mb: 2,
            border: '1px solid',
            borderColor: selectedQueries.includes(query.id) ? 'primary.main' : 'divider',
            borderRadius: '8px !important',
            '&:before': {
              display: 'none',
            },
            boxShadow: selectedQueries.includes(query.id) ? 2 : 1
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              borderRadius: '8px',
              bgcolor: selectedQueries.includes(query.id) ? 'primary.50' : 'background.paper',
              '&:hover': {
                bgcolor: selectedQueries.includes(query.id) ? 'primary.100' : 'grey.50'
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%',
              justifyContent: 'space-between',
              pr: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={selectedQueries.includes(query.id)}
                  onChange={() => toggleQuerySelection(query.id)}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ mr: 1 }}
                />
                <Typography 
                  sx={{ 
                    fontWeight: selectedQueries.includes(query.id) ? 'bold' : 'regular',
                    color: selectedQueries.includes(query.id) ? 'primary.main' : 'text.primary'
                  }}
                >
                  {query.query.length > 80 ? query.query.substring(0, 80) + '...' : query.query}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  size="small"
                  icon={query.isStructuredSummary ? <SummarizeIcon fontSize="small" /> : <QuestionAnswerIcon fontSize="small" />}
                  label={query.isStructuredSummary ? 'Resumen' : 'Consulta'}
                  color={query.isStructuredSummary ? 'secondary' : 'primary'}
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip
                  size="small"
                  label={new Date(query.timestamp).toLocaleString()}
                  sx={{ mr: 1, bgcolor: 'background.paper' }}
                />
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, query.id);
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              {query.isStructuredSummary ? (
                <>
                  <SummarizeIcon fontSize="small" sx={{ mr: 1 }} />
                  Instrucción para resumen:
                </>
              ) : (
                <>
                  <QuestionAnswerIcon fontSize="small" sx={{ mr: 1 }} />
                  Consulta:
                </>
              )}
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', mb: 2, borderRadius: 1 }}>
              <Typography>{query.query}</Typography>
            </Paper>
            
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              {query.isStructuredSummary ? 'Resumen estructurado:' : 'Respuesta:'}
            </Typography>
            <Paper elevation={0} sx={{ 
              p: 2, 
              bgcolor: query.isStructuredSummary ? '#f5f8ff' : '#f9f9f9', 
              borderRadius: 1, 
              mb: 2,
              border: query.isStructuredSummary ? '1px solid #e3f2fd' : 'none'
            }}>
              <Box sx={{ fontSize: '0.9rem' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {query.response}
                </ReactMarkdown>
              </Box>
            </Paper>
            
            {/* Sistema de preguntas anidadas/respuestas */}
            {replyMode === query.id ? (
              <Box sx={{ mt: 3, bgcolor: '#f0f7ff', p: 2, borderRadius: 2, border: '1px dashed #90caf9' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <ReplyIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Realizar pregunta de seguimiento
                  </Typography>
                  <IconButton size="small" onClick={handleCancelReply}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Escribe una pregunta relacionada con esta respuesta..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={queryLoading ? <CircularProgress size={16} /> : <SendIcon />}
                    onClick={() => handleSendReply(query.id)}
                    disabled={queryLoading || !replyText.trim()}
                  >
                    {queryLoading ? 'Enviando...' : 'Enviar pregunta'}
                  </Button>
                </Box>
              </Box>
            ) : null}
            
            {query.sources && query.sources.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                  Fuentes:
                </Typography>
                {query.sources.map((source, index) => (
                  <Accordion 
                    key={index}
                    disableGutters
                    elevation={0}
                    sx={{ 
                      border: '1px solid #e0e0e0',
                      mb: 1,
                      bgcolor: '#fbfbfb'
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArticleIcon fontSize="small" sx={{ mr: 1 }} />
                        Fuente {index + 1}: {source.filename}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                        {source.content}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Box sx={{ mb: 1 }}>
                <Chip
                  size="small"
                  label={`Modelo: ${query.model}`}
                  sx={{ mr: 1, bgcolor: 'background.paper' }}
                />
                {query.tokenUsage && (
                  <Chip
                    size="small"
                    label={`Tokens: ${query.tokenUsage.totalTokens || 0}`}
                    sx={{ mr: 1, bgcolor: 'background.paper' }}
                  />
                )}
              </Box>
              <Box>
                <Tooltip title="Realizar pregunta de seguimiento">
                  <IconButton 
                    size="small" 
                    onClick={() => handleReplyMode(query.id)}
                    color={replyMode === query.id ? "primary" : "default"}
                    sx={{ mr: 0.5 }}
                  >
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reutilizar consulta">
                  <IconButton size="small" onClick={() => onSelectQuery(query.query)}>
                    <FormatQuoteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copiar respuesta">
                  <IconButton size="small" onClick={() => handleCopy(query.response)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Descargar">
                  <IconButton size="small" onClick={() => handleDownload(query)}>
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleReplyMode(currentQueryId)}>
          <ListItemIcon>
            <ReplyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Pregunta de seguimiento</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          const query = queryHistory.find(q => q.id === currentQueryId);
          if (query) onSelectQuery(query.query);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <RestoreIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reutilizar consulta</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          const query = queryHistory.find(q => q.id === currentQueryId);
          if (query) handleCopy(query.response);
        }}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copiar respuesta</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          const query = queryHistory.find(q => q.id === currentQueryId);
          if (query) handleDownload(query, 'md');
        }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Descargar como Markdown</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          const query = queryHistory.find(q => q.id === currentQueryId);
          if (query) handleDownload(query, 'txt');
        }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Descargar como TXT</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDelete(currentQueryId)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Notificación de copiado exitoso */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="Copiado al portapapeles"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default QueryHistory;
