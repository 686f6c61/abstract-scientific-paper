import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const QueryExamples = ({ open, onClose, onCopyExample, isSimpleQuery }) => {
  const handleCopy = (text) => {
    onCopyExample(text);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        {isSimpleQuery ? 'Ejemplos de consultas' : 'Ejemplos de instrucciones para resúmenes'}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            {isSimpleQuery 
              ? 'Aquí tienes algunos ejemplos de consultas que puedes usar como referencia.'
              : 'Aquí tienes algunos ejemplos de instrucciones para generar resúmenes estructurados.'}
          </Typography>
        </Box>

        {isSimpleQuery ? (
          /* Ejemplos para consultas simples */
          <>
            {/* Ejemplo 1 */}
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f9ff', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Hallazgos principales
                </Typography>
                <Tooltip title="Copiar al portapapeles">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopy("¿Cuáles son los hallazgos o resultados principales descritos en estos estudios?")}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.9rem' }}>
                "¿Cuáles son los hallazgos o resultados principales descritos en estos estudios?"
              </Box>
            </Box>

            {/* Ejemplo 2 */}
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f9ff', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Comparación de metodologías
                </Typography>
                <Tooltip title="Copiar al portapapeles">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopy("Compara las metodologías utilizadas en los diferentes estudios. ¿Qué enfoques parecen más rigurosos y por qué?")}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.9rem' }}>
                "Compara las metodologías utilizadas en los diferentes estudios. ¿Qué enfoques parecen más rigurosos y por qué?"
              </Box>
            </Box>

            {/* Ejemplo 3 */}
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f9ff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Limitaciones y brechas
                </Typography>
                <Tooltip title="Copiar al portapapeles">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopy("¿Cuáles son las principales limitaciones mencionadas en los estudios y qué brechas de conocimiento se identifican para futuras investigaciones?")}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.9rem' }}>
                "¿Cuáles son las principales limitaciones mencionadas en los estudios y qué brechas de conocimiento se identifican para futuras investigaciones?"
              </Box>
            </Box>
          </>
        ) : (
          /* Ejemplos para resúmenes estructurados */
          <>
            {/* Ejemplo 1 */}
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f9ff', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Comparativa de metodologías
                </Typography>
                <Tooltip title="Copiar al portapapeles">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopy("Necesito un resumen estructurado que se centre especialmente en la sección de metodología. Compara las metodologías empleadas en los diferentes estudios, evalúa sus fortalezas y debilidades, y destaca qué enfoques metodológicos parecen más prometedores para futuras investigaciones en este campo. Además de las secciones estándar, añade una tabla comparativa de las metodologías.")}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.9rem' }}>
                "Necesito un resumen estructurado que se centre especialmente en la sección de metodología. Compara las metodologías empleadas en los diferentes estudios, evalúa sus fortalezas y debilidades, y destaca qué enfoques metodológicos parecen más prometedores para futuras investigaciones en este campo. Además de las secciones estándar, añade una tabla comparativa de las metodologías."
              </Box>
            </Box>
            
            {/* Ejemplo 2 */}
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f9ff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Análisis crítico con lagunas de investigación
                </Typography>
                <Tooltip title="Copiar al portapapeles">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopy("Genera un resumen estructurado con todas las secciones estándar, pero añade una sección adicional titulada 'ANÁLISIS CRÍTICO Y BRECHAS DE CONOCIMIENTO' donde identifiques claramente: 1) Las principales limitaciones metodológicas y teóricas de los estudios analizados, 2) Las contradicciones o inconsistencias entre los diferentes estudios, 3) Las preguntas de investigación que siguen sin respuesta, y 4) Las áreas específicas donde se necesita más investigación. Para cada brecha de conocimiento identificada, sugiere un posible enfoque metodológico para abordarla.")}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.9rem' }}>
                "Genera un resumen estructurado con todas las secciones estándar, pero añade una sección adicional titulada 'ANÁLISIS CRÍTICO Y BRECHAS DE CONOCIMIENTO' donde identifiques claramente: 1) Las principales limitaciones metodológicas y teóricas de los estudios analizados, 2) Las contradicciones o inconsistencias entre los diferentes estudios, 3) Las preguntas de investigación que siguen sin respuesta, y 4) Las áreas específicas donde se necesita más investigación. Para cada brecha de conocimiento identificada, sugiere un posible enfoque metodológico para abordarla."
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QueryExamples;
