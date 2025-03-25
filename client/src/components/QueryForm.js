import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { usePdf } from '../contexts/PdfContext';

const QueryForm = ({ isSimpleQuery }) => {
  const { 
    processQuery, 
    generateSummary, 
    selectedPdfs,
    queryLoading,
    summaryLoading
  } = usePdf();
  
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('Español');
  const [model, setModel] = useState('gpt-4o-mini');
  const [error, setError] = useState(null);
  const [modelInfoOpen, setModelInfoOpen] = useState(false);
  const [queryExamplesOpen, setQueryExamplesOpen] = useState(false);
  const [resumeInfoOpen, setResumeInfoOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Parámetros avanzados para los modelos
  const [maxTokens, setMaxTokens] = useState(8000); // Actualizado a 8000 para Claude 3.7 Sonnet
  const [useMaxTokens, setUseMaxTokens] = useState(true);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);

  const handleCopyExample = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      setQuery(text);
      setQueryExamplesOpen(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!query.trim()) {
      setError('Por favor ingresa una consulta');
      return;
    }
    
    // Determinar si estamos usando un modelo de Claude
    const isClaudeModel = model.includes('claude');
    const apiEndpoint = isClaudeModel ? 'anthropic' : 'openai';
    
    try {
      if (isSimpleQuery) {
        // Pasar el modelo, configuración y endpoint API
        await processQuery(query, model, selectedPdfs, maxTokens, temperature, apiEndpoint);
      } else {
        // Crear objeto con parámetros avanzados
        const modelParams = {
          model: model,
          temperature: temperature,
          top_p: topP,
          frequency_penalty: frequencyPenalty,
          presence_penalty: presencePenalty
        };
        
        // Solo añadir max_tokens si no se usa el máximo por defecto
        if (!useMaxTokens) {
          modelParams.max_tokens = maxTokens;
        }
        
        // Claude no usa frequency_penalty ni presence_penalty, pero no hay problema
        // ya que el backend ignorará los parámetros que no apliquen
        
        // Pasar modelo como parámetro separado
        await generateSummary(query, language, model, modelParams);
      }
    } catch (err) {
      setError('Error al procesar la consulta: ' + err.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {selectedPdfs.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No has seleccionado ningún PDF. Se buscarán en todos los documentos disponibles.
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6">
          {isSimpleQuery ? 'CONSULTA SOBRE ARTÍCULO' : 'GENERAR RESUMEN ESTRUCTURADO'}
        </Typography>
        
        <Tooltip title={isSimpleQuery ? "Ver ejemplos de consultas" : "Ver información del resumen estructurado"}>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => isSimpleQuery ? setQueryExamplesOpen(true) : setResumeInfoOpen(true)}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <TextField
        fullWidth
        id="query"
        label={isSimpleQuery ? "Escribe tu pregunta sobre los PDFs seleccionados" : "Describe qué tipo de resumen necesitas"}
        placeholder={isSimpleQuery 
          ? "Ej: ¿Cuáles son los principales hallazgos del estudio?" 
          : "Ej: Necesito un resumen detallado sobre la metodología y resultados del estudio"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 2 }}
        variant="outlined"
      />
      

      
      {!isSimpleQuery && (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, justifyContent: 'center', mt: 1 }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: '130px', flex: '0 0 auto' }}>
              <InputLabel id="language-select-label">Idioma</InputLabel>
              <Select
                labelId="language-select-label"
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                label="Idioma"
                MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
              >
                <MenuItem value="Español">Español</MenuItem>
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Français">Français</MenuItem>
                <MenuItem value="Deutsch">Deutsch</MenuItem>
                <MenuItem value="Italiano">Italiano</MenuItem>
                <MenuItem value="Português">Português</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" size="small" sx={{ minWidth: '170px', flex: '0 0 auto' }}>
              <InputLabel id="model-select-label">Modelo</InputLabel>
              <Select
                labelId="model-select-label"
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                label="Modelo"
              >
                <MenuItem value="gpt-4o-mini">GPT-4o-mini (Rápido)</MenuItem>
                <MenuItem value="gpt-4o">GPT-4o (Avanzado)</MenuItem>
                <MenuItem value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Button
                  onClick={() => document.getElementById('advanced-options-popup').style.display = document.getElementById('advanced-options-popup').style.display === 'none' ? 'block' : 'none'}
                  variant="outlined"
                  size="medium"
                  startIcon={<TuneIcon />}
                  sx={{ 
                    height: '40px', 
                    minWidth: '140px',
                    textTransform: 'none',
                    fontSize: '0.875rem', 
                    fontWeight: 500,
                    px: 2,
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  Opciones avanzadas
                </Button>
              </Box>
              
              <Button
                variant="outlined"
                size="medium"
                startIcon={<HelpOutlineIcon />}
                onClick={() => setModelInfoOpen(true)}
                sx={{ 
                  height: '40px', 
                  minWidth: '170px',
                  textTransform: 'none',
                  fontSize: '0.875rem', 
                  fontWeight: 500,
                  px: 2,
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    borderColor: 'primary.main'
                  }
                }}
              >
                ¿Qué modelo elegir?
              </Button>
              
              {/* Modal para información de modelos */}
              {modelInfoOpen && (
                <Box sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1300
                }}>
                  <Box sx={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    p: 3,
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflow: 'auto'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary.main">Modelos disponibles</Typography>
                      <IconButton onClick={() => setModelInfoOpen(false)} edge="end" size="small">
                        <Typography sx={{ fontSize: '1.5rem' }}>&times;</Typography>
                      </IconButton>
                    </Box>
                    
                    {/* GPT-4o-mini */}
                    <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        GPT-4o-mini
                        {model === 'gpt-4o-mini' && (
                          <Typography 
                            component="span" 
                            sx={{ 
                              ml: 1, 
                              px: 1, 
                              py: 0.3, 
                              backgroundColor: 'primary.main', 
                              color: 'white', 
                              borderRadius: '4px',
                              fontSize: '0.7rem'
                            }}
                          >
                            Seleccionado
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Un modelo más pequeño, rápido y económico pero con alta calidad para tareas generales.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Ventajas:</strong> Respuestas más rápidas, menor costo, excelente para resúmenes y consultas simples.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Desventajas:</strong> Menos capacidad para análisis muy profundos o complejos.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => window.open('https://platform.openai.com/docs/models/gpt-4o-mini', '_blank')}
                        sx={{ mt: 1 }}
                      >
                        Ver documentación oficial
                      </Button>
                    </Box>
                    
                    {/* GPT-4o */}
                    <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        GPT-4o
                        {model === 'gpt-4o' && (
                          <Typography 
                            component="span" 
                            sx={{ 
                              ml: 1, 
                              px: 1, 
                              py: 0.3, 
                              backgroundColor: 'primary.main', 
                              color: 'white', 
                              borderRadius: '4px',
                              fontSize: '0.7rem'
                            }}
                          >
                            Seleccionado
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        La versión más potente y versátil, con mayor capacidad para análisis profundos.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Ventajas:</strong> Mayor precisión, análisis más completos, mejor comprensión de contextos complejos, mayor creatividad.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Desventajas:</strong> Procesamiento más lento, mayor costo por token.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => window.open('https://platform.openai.com/docs/models/gpt-4o', '_blank')}
                        sx={{ mt: 1 }}
                      >
                        Ver documentación oficial
                      </Button>
                    </Box>

                    {/* Claude 3.7 Sonnet */}
                    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        Claude 3.7 Sonnet
                        {model === 'claude-3-7-sonnet-20250219' && (
                          <Typography 
                            component="span" 
                            sx={{ 
                              ml: 1, 
                              px: 1, 
                              py: 0.3, 
                              backgroundColor: 'primary.main', 
                              color: 'white', 
                              borderRadius: '4px',
                              fontSize: '0.7rem'
                            }}
                          >
                            Seleccionado
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        El modelo de Anthropic que destaca por su capacidad de razonamiento y análisis de documentos complejos.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Ventajas:</strong> Excelente comprensión contextual, capacidad para manejar instrucciones complejas, respuestas bien estructuradas y basadas en evidencia.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Desventajas:</strong> Mayor latencia en algunas respuestas, costo similar a modelos avanzados.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => window.open('https://docs.anthropic.com/claude/docs/models-overview', '_blank')}
                        sx={{ mt: 1 }}
                      >
                        Ver documentación oficial
                      </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                      <Button 
                        variant="contained" 
                        onClick={() => setModelInfoOpen(false)}
                      >
                        Cerrar
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
              
              <Box 
                id="advanced-options-popup"
                sx={{ 
                  display: 'none', 
                  position: 'absolute', 
                  top: '45px', 
                  right: 0, 
                  zIndex: 10, 
                  width: '450px',
                  maxWidth: 'calc(100vw - 40px)',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  p: 2
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="primary.main">Opciones avanzadas</Typography>
                  <Button 
                    size="small" 
                    onClick={() => document.getElementById('advanced-options-popup').style.display = 'none'}
                    sx={{ minWidth: '30px', p: 0.5 }}
                  >
                    ×
                  </Button>
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  {/* Control de tokens */}
                  <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={useMaxTokens}
                        onChange={(e) => setUseMaxTokens(e.target.checked)}
                        size="small"
                        sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    }
                    label={<Typography variant="body2">Usar máximo de tokens disponibles</Typography>}
                    sx={{ mb: 1 }}
                  />
                </Grid>
                
                {!useMaxTokens && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography id="tokens-slider" variant="body2" color="text.secondary">
                        Número máximo de tokens:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" color="primary.main">
                        {maxTokens}
                      </Typography>
                    </Box>
                    <Slider
                      disabled={useMaxTokens}
                      value={maxTokens}
                      onChange={(e, newValue) => setMaxTokens(newValue)}
                      min={100}
                      max={8000}
                      step={100}
                      valueLabelDisplay="auto"
                      aria-labelledby="tokens-slider"
                      size="small"
                      sx={{ color: 'primary.main' }}
                    />
                  </Grid>
                )}
                
                {/* Temperature */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography id="temperature-slider" variant="body2" color="text.secondary">
                      Temperature:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" color="primary.main">
                      {temperature}
                    </Typography>
                  </Box>
                  <Slider
                    value={temperature}
                    onChange={(e, newValue) => setTemperature(newValue)}
                    min={0}
                    max={2}
                    step={0.1}
                    valueLabelDisplay="auto"
                    aria-labelledby="temperature-slider"
                    size="small"
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                    Valores más altos = más creatividad, valores más bajos = más precisión
                  </Typography>
                </Grid>
                
                {/* Top P */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography id="top-p-slider" variant="body2" color="text.secondary">
                      Top P:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" color="primary.main">
                      {topP}
                    </Typography>
                  </Box>
                  <Slider
                    value={topP}
                    onChange={(e, newValue) => setTopP(newValue)}
                    min={0}
                    max={1}
                    step={0.05}
                    valueLabelDisplay="auto"
                    aria-labelledby="top-p-slider"
                    size="small"
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                    Controla la diversidad de palabras (1 = considerar todas las palabras)
                  </Typography>
                </Grid>
                
                {/* Frequency Penalty */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography id="frequency-penalty-slider" variant="body2" color="text.secondary">
                      Frequency Penalty:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" color="primary.main">
                      {frequencyPenalty}
                    </Typography>
                  </Box>
                  <Slider
                    value={frequencyPenalty}
                    onChange={(e, newValue) => setFrequencyPenalty(newValue)}
                    min={-2}
                    max={2}
                    step={0.1}
                    valueLabelDisplay="auto"
                    aria-labelledby="frequency-penalty-slider"
                    size="small"
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                    Reduce la repetición de palabras frecuentes
                  </Typography>
                </Grid>
                
                {/* Presence Penalty */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography id="presence-penalty-slider" variant="body2" color="text.secondary">
                      Presence Penalty:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" color="primary.main">
                      {presencePenalty}
                    </Typography>
                  </Box>
                  <Slider
                    value={presencePenalty}
                    onChange={(e, newValue) => setPresencePenalty(newValue)}
                    min={-2}
                    max={2}
                    step={0.1}
                    valueLabelDisplay="auto"
                    aria-labelledby="presence-penalty-slider"
                    size="small"
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                    Incentiva hablar de nuevos temas
                  </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </React.Fragment>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
        <Button
          type="submit"
          variant="contained"
          size="medium"
          sx={{ 
            px: 4, 
            py: 1, 
            borderRadius: 2,
            maxWidth: '300px',
            textTransform: 'none',
            boxShadow: 2
          }}
          startIcon={isSimpleQuery ? <SearchIcon /> : <SummarizeIcon />}
          disabled={queryLoading || summaryLoading}
        >
          {isSimpleQuery 
            ? 'Buscar' 
            : 'Generar Resumen'}
        </Button>
      </Box>
      
      {/* Modal para ejemplos de consultas */}
      {queryExamplesOpen && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1300
        }}>
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            p: 3,
            maxWidth: '650px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="primary.main">Ejemplos de consultas sobre artículos</Typography>
              <IconButton onClick={() => setQueryExamplesOpen(false)} edge="end" size="small">
                <Typography sx={{ fontSize: '1.5rem' }}>&times;</Typography>
              </IconButton>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              A continuación te mostramos algunos ejemplos de consultas que puedes realizar sobre los artículos PDF seleccionados.
              Haz clic en el botón de copia para utilizar directamente el ejemplo.
            </Typography>
            
            {/* Ejemplo 1 */}
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f9ff', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Análisis de variables e hipótesis
                </Typography>
                <Tooltip title="Copiar al portapapeles">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopyExample("Muéstrame las variables que usan los estudios agregados y dime los puntos en común de sus hipótesis.")}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.9rem' }}>
                "Muéstrame las variables que usan los estudios agregados y dime los puntos en común de sus hipótesis."
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
                    onClick={() => handleCopyExample("Compara las metodologías utilizadas en los estudios, identifica similitudes y diferencias, y evalúa cuál parece ser más rigurosa desde el punto de vista científico.")}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.9rem' }}>
                "Compara las metodologías utilizadas en los estudios, identifica similitudes y diferencias, y evalúa cuál parece ser más rigurosa desde el punto de vista científico."
              </Box>
            </Box>
            
            {/* Ejemplo 3 */}
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f9ff', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Análisis crítico de resultados
                </Typography>
                <Tooltip title="Copiar al portapapeles">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopyExample("Evalúa críticamente los resultados presentados en estos artículos. ¿Qué limitaciones metodológicas tienen? ¿Son consistentes entre sí o presentan contradicciones? ¿Qué factores podrían explicar las diferencias en sus conclusiones?")}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.9rem' }}>
                "Evalúa críticamente los resultados presentados en estos artículos. ¿Qué limitaciones metodológicas tienen? ¿Son consistentes entre sí o presentan contradicciones? ¿Qué factores podrían explicar las diferencias en sus conclusiones?"
              </Box>
            </Box>
            
            {/* Ejemplo 4 */}
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f9ff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Síntesis para futuras investigaciones
                </Typography>
                <Tooltip title="Copiar al portapapeles">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopyExample("Basándote en estos artículos, identifica las brechas de conocimiento más importantes en este campo y propón tres líneas de investigación prioritarias con sus respectivas preguntas de investigación y posibles diseños metodológicos.")}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.9rem' }}>
                "Basándote en estos artículos, identifica las brechas de conocimiento más importantes en este campo y propón tres líneas de investigación prioritarias con sus respectivas preguntas de investigación y posibles diseños metodológicos."
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      
      {/* Modal para información del resumen estructurado */}
      {resumeInfoOpen && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1300
        }}>
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            p: 3,
            maxWidth: '650px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="primary.main">Acerca del resumen estructurado</Typography>
              <IconButton onClick={() => setResumeInfoOpen(false)} edge="end" size="small">
                <Typography sx={{ fontSize: '1.5rem' }}>&times;</Typography>
              </IconButton>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              El generador de resúmenes estructurados analiza los artículos PDF seleccionados y crea un resumen académico completo
              que incluye las siguientes secciones:
            </Typography>
            
            {/* Secciones del resumen */}
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f8f9fa', mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Secciones incluidas en el resumen:</Typography>
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    <Typography variant="body2">Título</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    <Typography variant="body2">Contexto y objetivos</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    <Typography variant="body2">Metodología</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    <Typography variant="body2">Resultados y conclusiones</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    <Typography variant="body2">Referencias clave</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    <Typography variant="body2">Ideas clave</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    <Typography variant="body2">Clasificación del trabajo</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    <Typography variant="body2">Variables empleadas</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    <Typography variant="body2">Países del estudio</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    <Typography variant="body2">Marco teórico</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              Puedes personalizar el resumen añadiendo instrucciones específicas. Aquí hay algunos ejemplos:
            </Typography>
            
            {/* Ejemplo 1 */}
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f9ff', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Enfoque en metodología comparativa
                </Typography>
                <Tooltip title="Copiar al portapapeles">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopyExample("Necesito un resumen estructurado que se centre especialmente en la sección de metodología. Compara las metodologías empleadas en los diferentes estudios, evalúa sus fortalezas y debilidades, y destaca qué enfoques metodológicos parecen más prometedores para futuras investigaciones en este campo. Además de las secciones estándar, añade una tabla comparativa de las metodologías.")}
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
                    onClick={() => handleCopyExample("Genera un resumen estructurado con todas las secciones estándar, pero añade una sección adicional titulada 'ANÁLISIS CRÍTICO Y BRECHAS DE CONOCIMIENTO' donde identifiques claramente: 1) Las principales limitaciones metodológicas y teóricas de los estudios analizados, 2) Las contradicciones o inconsistencias entre los diferentes estudios, 3) Las preguntas de investigación que siguen sin respuesta, y 4) Las áreas específicas donde se necesita más investigación. Para cada brecha de conocimiento identificada, sugiere un posible enfoque metodológico para abordarla.")}
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
          </Box>
        </Box>
      )}
      
      {/* Snackbar para confirmar copia */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        message="Instrucción copiada al campo de texto"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      
      {!isSimpleQuery && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          El resumen estructurado incluirá título, contexto, metodología, resultados, referencias, variables empleadas y otros elementos relevantes. La generación puede tardar hasta dos minutos dependiendo del tamaño de los documentos y el modelo seleccionado de OpenAI.
        </Typography>
      )}
    </Box>
  );
};

export default QueryForm;
