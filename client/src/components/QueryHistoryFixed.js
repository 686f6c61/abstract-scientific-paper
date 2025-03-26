import React, { useState, useEffect } from 'react';
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
import JSZip from 'jszip';
import { usePdf } from '../contexts/PdfContext';

// Componente QueryHistory con implementación directa de almacenamiento local
const QueryHistoryFixed = ({ onSelectQuery }) => {
  // Estado local para el historial
  const [localHistory, setLocalHistory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  
  const { 
    processQuery,
    queryLoading 
  } = usePdf();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentQueryId, setCurrentQueryId] = useState(null);
  const [replyMode, setReplyMode] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Cargar el historial cuando el componente se monte
  useEffect(() => {
    loadHistory();
    console.log("Componente QueryHistoryFixed montado - cargando historial");
  }, []);
  
  // Función para cargar el historial desde localStorage
  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('queryHistory');
      console.log("Contenido en localStorage:", savedHistory);
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setLocalHistory(parsedHistory);
          console.log(`Cargados ${parsedHistory.length} elementos en el historial`);
        } else {
          console.error("El historial no es un array:", parsedHistory);
          // Inicializar con un array vacío si no es un array
          setLocalHistory([]);
          // Limpiar el localStorage para empezar de nuevo
          localStorage.removeItem('queryHistory');
        }
      } else {
        console.log("No se encontró historial en localStorage");
        setLocalHistory([]);
      }
    } catch (err) {
      console.error("Error al cargar el historial:", err);
      setLocalHistory([]);
      // Limpiar el localStorage para empezar de nuevo
      localStorage.removeItem('queryHistory');
    }
  };
  
  // Guardar el historial en localStorage
  const saveHistory = (history) => {
    try {
      localStorage.setItem('queryHistory', JSON.stringify(history));
      console.log(`Guardados ${history.length} elementos en el historial`);
    } catch (err) {
      console.error("Error al guardar el historial:", err);
    }
  };
  
  // Añadir un item al historial
  const addToHistory = (item) => {
    const updatedHistory = [item, ...localHistory];
    setLocalHistory(updatedHistory);
    saveHistory(updatedHistory);
  };
  
  // Eliminar un item del historial
  const deleteFromHistory = (id) => {
    const updatedHistory = localHistory.filter(item => item.id !== id);
    setLocalHistory(updatedHistory);
    saveHistory(updatedHistory);
    
    // También quitar de seleccionados si estaba seleccionado
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    }
  };
  
  // Limpiar todo el historial
  const clearHistory = () => {
    setLocalHistory([]);
    setSelectedItems([]);
    localStorage.removeItem('queryHistory');
  };
  
  // Toggle selección de un item
  const toggleSelection = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
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
    
    const parentQuery = localHistory.find(q => q.id === queryId);
    if (!parentQuery) return;
    
    try {
      setError(null);
      // Usar el mismo modelo que la consulta original
      const result = await processQuery(replyText, parentQuery.model || 'gpt-4o-mini', [], 8000, 0.7);
      
      // Crear un nuevo elemento para el historial
      const newQuery = {
        id: Date.now().toString(),
        query: replyText,
        response: result?.content || result?.response || '',
        sources: result?.sources || [],
        model: parentQuery.model || 'gpt-4o-mini',
        tokenUsage: result?.tokenUsage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        timestamp: new Date().toISOString(),
        parentId: queryId // Referencia a la consulta padre
      };
      
      // Añadir al historial local
      addToHistory(newQuery);
      
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
    deleteFromHistory(queryId);
    handleMenuClose();
    // Si estábamos en modo respuesta para esta consulta, salimos de él
    if (replyMode === queryId) {
      setReplyMode(null);
    }
  };

  // Exportar elementos seleccionados como archivo ZIP
  const handleExportSelectedAsZip = async () => {
    if (selectedItems.length === 0) {
      setError('Por favor, selecciona al menos un elemento para exportar');
      return;
    }
    
    try {
      // Crear un nuevo objeto ZIP
      const zip = new JSZip();
      
      // Filtrar los elementos seleccionados
      const selectedQueries = localHistory.filter(query => selectedItems.includes(query.id));
      console.log(`Exportando ${selectedQueries.length} consultas seleccionadas`);
      
      // Añadir cada consulta como un archivo de texto dentro del ZIP
      // Usamos un enfoque más detallado para depurar
      for (let i = 0; i < selectedQueries.length; i++) {
        const query = selectedQueries[i];
        
        // Asegurar que el ID sea único para cada archivo
        const fileName = `consulta_${i+1}_${new Date(query.timestamp).toISOString().slice(0, 10)}_${query.id.substring(0, 6)}.txt`;
        
        // Formatear el contenido
        let content = `CONSULTA: ${query.query}\n\n`;
        content += `RESPUESTA:\n${query.response}\n\n`;
        content += `TIPO: ${query.isStructuredSummary ? 'Resumen estructurado' : 'Consulta simple'}\n`;
        content += `MODELO: ${query.model || 'No especificado'}\n`;
        content += `FECHA: ${new Date(query.timestamp).toLocaleString()}\n`;
        
        // Añadir fuentes si existen
        if (query.sources && query.sources.length > 0) {
          content += `\nFUENTES:\n`;
          query.sources.forEach((source, index) => {
            // Comprobar que source.content existe y no es undefined
            const sourceContent = source.content || 'No hay contenido disponible';
            content += `\nFuente ${index + 1}:\n${sourceContent}\n`;
            
            // Añadir información del documento si está disponible
            if (source.document) {
              content += `Documento: ${source.document}\n`;
            }
          });
        }
        
        // Añadir el archivo al ZIP con depuración
        console.log(`Añadiendo archivo ${fileName} al ZIP`);
        zip.file(fileName, content);
      }
      
      // Verificar que el ZIP tenga los archivos esperados
      const files = Object.keys(zip.files);
      console.log(`El ZIP contiene ${files.length} archivos:`, files);
      
      // Generar el ZIP y descargarlo
      console.log('Generando archivo ZIP...');
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      
      // Crear elemento de descarga
      const element = document.createElement('a');
      element.href = url;
      element.download = `historial_consultas_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(element);
      console.log('Descargando ZIP...');
      element.click();
      document.body.removeChild(element);
      
      // Liberamos el objeto URL para evitar fugas de memoria
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      // Mensaje de éxito
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Error al crear el archivo ZIP:', err);
      setError(`Error al exportar las consultas seleccionadas: ${err.message}`);
    }
  };

  // Ordenar consultas con las más recientes primero
  const sortedHistory = [...localHistory].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  // Si no hay consultas guardadas, mostrar mensaje
  if (sortedHistory.length === 0) {
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
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }} 
            onClick={() => {
              // Crear un ejemplo para probar
              const exampleQuery = {
                id: Date.now().toString(),
                query: "Esta es una consulta de ejemplo",
                response: "Esta es una respuesta de ejemplo para mostrar cómo funciona el historial de consultas.",
                sources: [],
                model: "gpt-4o-mini",
                tokenUsage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
                timestamp: new Date().toISOString()
              };
              addToHistory(exampleQuery);
            }}
          >
            Crear consulta de ejemplo
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          Historial de consultas y resúmenes ({sortedHistory.length})
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {selectedItems.length > 0 && (
            <>
              <Chip 
                label={`${selectedItems.length} seleccionadas`}
                color="primary"
                size="small"
                sx={{ mr: 1 }}
              />
              <Tooltip title="Exportar seleccionadas como ZIP">
                <IconButton onClick={handleExportSelectedAsZip} size="small" sx={{ mr: 1 }}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Limpiar historial">
            <IconButton onClick={clearHistory} size="small">
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
            borderColor: selectedItems.includes(query.id) ? 'primary.main' : 'divider',
            borderRadius: '8px !important',
            '&:before': {
              display: 'none',
            },
            boxShadow: selectedItems.includes(query.id) ? 2 : 1
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              borderRadius: '8px',
              bgcolor: selectedItems.includes(query.id) ? 'primary.50' : 'background.paper',
              '&:hover': {
                bgcolor: selectedItems.includes(query.id) ? 'primary.100' : 'grey.50'
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
                  checked={selectedItems.includes(query.id)}
                  onChange={() => toggleSelection(query.id)}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ mr: 1 }}
                />
                <Typography 
                  sx={{ 
                    fontWeight: selectedItems.includes(query.id) ? 'bold' : 'regular',
                    color: selectedItems.includes(query.id) ? 'primary.main' : 'text.primary'
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
                    endIcon={queryLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                    onClick={() => handleSendReply(query.id)}
                    disabled={queryLoading || !replyText.trim()}
                  >
                    {queryLoading ? 'Enviando...' : 'Enviar pregunta'}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ReplyIcon />}
                  onClick={() => handleReplyMode(query.id)}
                  sx={{ mr: 1 }}
                >
                  Hacer pregunta de seguimiento
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RestoreIcon />}
                  onClick={() => onSelectQuery(query.query)}
                >
                  Reutilizar consulta
                </Button>
              </Box>
            )}
            
            {/* Información adicional como fuentes */}
            {query.sources && query.sources.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Fuentes:
                </Typography>
                <Box sx={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                  {query.sources.map((source, index) => (
                    <Box key={index} sx={{ p: 2, borderBottom: index < query.sources.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Fuente {index + 1}:
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {source.content}
                      </Typography>
                      {source.document && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                          Documento: {source.document}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
      
      {/* Menú contextual para opciones adicionales */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const query = localHistory.find(q => q.id === currentQueryId);
          if (query) handleCopy(query.response);
        }}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Copiar respuesta" />
        </MenuItem>
        <MenuItem onClick={() => {
          const query = localHistory.find(q => q.id === currentQueryId);
          if (query) handleDownload(query);
        }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Descargar" />
        </MenuItem>
        <MenuItem onClick={() => handleDelete(currentQueryId)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Eliminar" sx={{ color: 'error.main' }} />
        </MenuItem>
      </Menu>
      
      {/* Snackbar para confirmar copia */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        message={selectedItems.length > 0 ? `${selectedItems.length} consulta(s) exportada(s) correctamente en formato ZIP` : "Copiado al portapapeles"}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default QueryHistoryFixed;
