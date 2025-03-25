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
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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
  
  // Parámetros avanzados para OpenAI
  const [maxTokens, setMaxTokens] = useState(4000);
  const [useMaxTokens, setUseMaxTokens] = useState(true);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);

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
      
      <Typography variant="h6" gutterBottom>
        {isSimpleQuery ? 'CONSULTA SIMPLE' : 'GENERAR RESUMEN ESTRUCTURADO'}
      </Typography>
      
      <TextField
        fullWidth
        id="query"
        label={isSimpleQuery ? "Escribe tu pregunta" : "Describe qué tipo de resumen necesitas"}
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
      
      {!isSimpleQuery && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          El resumen estructurado incluirá título, contexto, metodología, resultados, referencias, variables empleadas y otros elementos relevantes. La generación puede tardar hasta dos minutos dependiendo del tamaño de los documentos y el modelo seleccionado de OpenAI.
        </Typography>
      )}
    </Box>
  );
};

export default QueryForm;
