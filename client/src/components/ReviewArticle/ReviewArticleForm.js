import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleIcon from '@mui/icons-material/Article';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { usePdf } from '../../contexts/PdfContext';

// Importamos todos los componentes
import {
  PdfList,
  SummaryList,
  SummaryDialog,
  AdvancedOptions,
  StepIndicator,
  ReviewArticleDisplay,
  AppHeader,
  ProgressDisplay
} from './components';

// Importamos las utilidades
import { 
  formatBytes, 
  getFilenameWithoutExtension, 
  getPrimaryButtonStyles,
  getCommonStyles
} from './utils';

/**
 * Componente principal para la generación de artículos de revisión
 */
const ReviewArticleForm = () => {
  const {
    pdfs,
    batchSummaries,
    batchProcessing,
    batchProgress,
    reviewArticle,
    reviewArticleLoading,
    selectedPdfs,
    selectedBatchSummaries,
    processBatchSummaries,
    clearReviewArticle,
    generateReviewArticle,
    togglePdfSelection,
    toggleBatchSummarySelection,
    currentSection
  } = usePdf();

  // Estados locales
  const [language, setLanguage] = useState('Español');
  const [model, setModel] = useState('gpt-4o-mini');
  const [step, setStep] = useState(1); // 1: Selección PDFs, 2: Resúmenes generados, 3: Artículo generado
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [modelInfoOpen, setModelInfoOpen] = useState(false);
  const [instructionsHelpOpen, setInstructionsHelpOpen] = useState(false);
  const [useMaxTokens, setUseMaxTokens] = useState(false);
  const [specificInstructions, setSpecificInstructions] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [modelParams, setModelParams] = useState({
    temperature: 0.7,
    top_p: 1.0,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 8192
  });

  // Estilos comunes
  const styles = getCommonStyles();

  // Manejadores de eventos
  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);

    if (selectedModel.includes('gpt-3.5')) {
      setModelParams(prev => ({ ...prev, max_tokens: 4096 }));
    } else {
      setModelParams(prev => ({ ...prev, max_tokens: 8192 }));
    }
  };
  
  const handleAdvancedOptionChange = (paramName) => (event) => {
    const value = parseFloat(event.target.value);
    setModelParams(prevParams => ({
      ...prevParams,
      [paramName]: value
    }));
  };

  const handleProcessBatch = async () => {
    if (selectedPdfs.length === 0) {
      return;
    }
    
    try {
      // Crear una copia de modelParams y ajustar max_tokens según la preferencia del usuario
      const params = { ...modelParams };
      if (!useMaxTokens) {
        // Si no se usa el máximo de tokens, enviamos el valor explícito
        params.max_tokens = modelParams.max_tokens;
      } else {
        // Si se usa el máximo de tokens, eliminamos el parámetro max_tokens para que la API use el máximo disponible
        delete params.max_tokens;
      }

      await processBatchSummaries(language, model, params);
      setStep(2); // Avanzar al paso de selección de resúmenes
    } catch (error) {
      console.error("Error procesando PDFs en lote:", error);
    }
  };

  const handleGenerateReviewArticle = async () => {
    if (selectedBatchSummaries.length === 0) {
      return;
    }
    
    try {
      // Crear una copia de modelParams y ajustar max_tokens según la preferencia del usuario
      const params = { ...modelParams };
      if (!useMaxTokens) {
        // Si no se usa el máximo de tokens, enviamos el valor explícito
        params.max_tokens = modelParams.max_tokens;
      } else {
        // Si se usa el máximo de tokens, eliminamos el parámetro max_tokens para que la API use el máximo disponible
        delete params.max_tokens;
      }

      // Incluir las instrucciones específicas si existen
      await generateReviewArticle(language, model, params, specificInstructions.trim());
      setStep(3); // Avanzar al paso final
    } catch (error) {
      console.error("Error generando artículo de revisión:", error);
    }
  };

  const handleOpenSummaryDialog = (summary) => {
    setSelectedSummary(summary);
    setSummaryDialogOpen(true);
  };

  const handleCloseSummaryDialog = () => {
    setSummaryDialogOpen(false);
  };

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const resetForm = () => {
    clearReviewArticle();
    setStep(1);
  };

  const handleCopyExample = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      setSpecificInstructions(text);
      setInstructionsHelpOpen(false);
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
      {/* Encabezado principal */}
      <AppHeader />

      {/* Campo para instrucciones específicas - aparece siempre, independiente del paso */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, mb: 3 }}>
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mr: 1 }}>Instrucciones específicas para el artículo</Typography>
            <Tooltip title="Ver ejemplos de instrucciones">
              <IconButton 
                size="small" 
                color="primary" 
                onClick={() => setInstructionsHelpOpen(true)}
                sx={{ p: 0.5 }}
              >
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <textarea 
          value={specificInstructions}
          onChange={(e) => setSpecificInstructions(e.target.value)}
          placeholder="Indique aquí sus instrucciones específicas para personalizar el artículo..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontFamily: 'inherit',
            fontSize: '1rem'
          }}
        />
      </Paper>

      {/* Indicadores de paso */}
      <StepIndicator currentStep={step} />

      {/* Contenido según el paso actual */}
      {step === 1 && (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, mb: 3 }}>
          {pdfs.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>No hay Artículos disponibles</AlertTitle>
              Sube algunos documentos PDF desde la sección principal para comenzar.
            </Alert>
          ) : (
            <>
              {/* Selector de idioma y modelo */}
              <Box sx={{ 
                mb: 2, 
                p: 1.5, 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="language-select-label">Idioma</InputLabel>
                      <Select
                        labelId="language-select-label"
                        id="language-select"
                        value={language}
                        label="Idioma"
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <MenuItem value="Español">Español</MenuItem>
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Français">Français</MenuItem>
                        <MenuItem value="Deutsch">Deutsch</MenuItem>
                        <MenuItem value="Italiano">Italiano</MenuItem>
                        <MenuItem value="Português">Português</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="model-select-label">Modelo</InputLabel>
                      <Select
                        labelId="model-select-label"
                        id="model-select"
                        value={model}
                        label="Modelo"
                        onChange={handleModelChange}
                      >
                        <MenuItem value="gpt-4o-mini">GPT-4o-mini (Rápido)</MenuItem>
                        <MenuItem value="gpt-4o">GPT-4o (Avanzado)</MenuItem>
                        <MenuItem value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="outlined"
                      size="medium"
                      startIcon={<HelpOutlineIcon />}
                      onClick={() => setModelInfoOpen(true)}
                      sx={{ 
                        height: '40px', 
                        width: '100%',
                        textTransform: 'none',
                        fontSize: '0.875rem', 
                        fontWeight: 500,
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
                  </Grid>
                </Grid>
              </Box>
              
              {/* Opciones avanzadas */}
              <AdvancedOptions 
                showAdvancedOptions={showAdvancedOptions}
                toggleAdvancedOptions={toggleAdvancedOptions}
                modelParams={modelParams}
                handleAdvancedOptionChange={handleAdvancedOptionChange}
                useMaxTokens={useMaxTokens}
                setUseMaxTokens={setUseMaxTokens}
              />

              {/* Lista de PDFs */}
              <PdfList 
                pdfs={pdfs}
                selectedPdfs={selectedPdfs}
                togglePdfSelection={togglePdfSelection}
                getFilenameWithoutExtension={getFilenameWithoutExtension}
              />

              {/* Barra de progreso */}
              <ProgressDisplay 
                batchProcessing={batchProcessing}
                batchProgress={batchProgress}
              />

              {/* Botón para procesar */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  disabled={selectedPdfs.length === 0 || batchProcessing}
                  onClick={handleProcessBatch}
                  sx={getPrimaryButtonStyles(selectedPdfs.length === 0 || batchProcessing)}
                >
                  {batchProcessing ? 'Procesando...' : 'Crear'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}

      {step === 2 && (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, mb: 3 }}>
          {batchSummaries.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>No hay resúmenes generados</AlertTitle>
              Procesa algunos documentos PDF primero.
            </Alert>
          ) : (
            <>
              {/* Lista de resúmenes */}
              <SummaryList 
                batchSummaries={batchSummaries}
                selectedBatchSummaries={selectedBatchSummaries}
                toggleBatchSummarySelection={toggleBatchSummarySelection}
                getFilenameWithoutExtension={getFilenameWithoutExtension}
                openSummaryDialog={handleOpenSummaryDialog}
              />
              


              {/* Botones de acción */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => setStep(1)}
                  sx={{ ...getPrimaryButtonStyles(), mr: 2 }}
                >
                  Volver a Selección de Artículos
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ArticleIcon />}
                  disabled={selectedBatchSummaries.length === 0 || reviewArticleLoading}
                  onClick={handleGenerateReviewArticle}
                  sx={getPrimaryButtonStyles(selectedBatchSummaries.length === 0 || reviewArticleLoading)}
                >
                  {reviewArticleLoading ? 'Generando...' : 'Generar Artículo de Revisión'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}

      {step === 3 && (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, mb: 3 }}>
          {/* Botones de acción */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => setStep(2)}
              sx={{ ...getPrimaryButtonStyles(), mr: 2 }}
            >
              Volver a Selección de Resúmenes
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={resetForm}
              sx={getPrimaryButtonStyles()}
            >
              Empezar de Nuevo
            </Button>
          </Box>

          {/* Muestra del artículo generado */}
          <ReviewArticleDisplay 
            reviewArticle={reviewArticle}
            reviewArticleLoading={reviewArticleLoading}
            currentSection={currentSection}
          />
        </Paper>
      )}

      {/* Diálogo de resumen */}
      <SummaryDialog 
        open={summaryDialogOpen}
        selectedSummary={selectedSummary}
        selectedBatchSummaries={selectedBatchSummaries}
        toggleBatchSummarySelection={toggleBatchSummarySelection}
        handleCloseSummaryDialog={handleCloseSummaryDialog}
      />

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
                  <Typography variant="caption" sx={{ ml: 1, backgroundColor: 'primary.main', color: 'white', px: 1, py: 0.25, borderRadius: '4px' }}>
                    Seleccionado
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Recomendado para:</strong> Uso general y generación rápida de artículos de revisión
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Ventajas:</strong> Más rápido y económico, manteniendo buena calidad
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Limitaciones:</strong> Menos capacidad para artículos muy complejos o técnicos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
                Ideal para la mayoría de las necesidades de generación de artículos de revisión. Ofrece un buen equilibrio entre velocidad y calidad.
              </Typography>
            </Box>
            
            {/* GPT-4o */}
            <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                GPT-4o
                {model === 'gpt-4o' && (
                  <Typography variant="caption" sx={{ ml: 1, backgroundColor: 'primary.main', color: 'white', px: 1, py: 0.25, borderRadius: '4px' }}>
                    Seleccionado
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Recomendado para:</strong> Artículos de revisión científica complejos y de alta calidad
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Ventajas:</strong> Mayor comprensión del contexto y razonamiento más avanzado
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Limitaciones:</strong> Generación más lenta, mayor consumo de recursos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
                La mejor opción para artículos científicos detallados que requieren análisis profundo y comprensión de conceptos complejos.
              </Typography>
            </Box>
            
            {/* Claude 3.7 Sonnet */}
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                Claude 3.7 Sonnet
                {model === 'claude-3-7-sonnet-20250219' && (
                  <Typography variant="caption" sx={{ ml: 1, backgroundColor: 'primary.main', color: 'white', px: 1, py: 0.25, borderRadius: '4px' }}>
                    Seleccionado
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Recomendado para:</strong> Artículos que requieren un enfoque alternativo o estilo diferente
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Ventajas:</strong> Respuestas bien estructuradas y coherentes, buen manejo de instrucciones específicas
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Limitaciones:</strong> Puede tener diferencias en el manejo de ciertos temas técnicos comparado con GPT-4
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
                Una excelente alternativa cuando se busca un enfoque distinto o para comparar con los resultados de GPT-4. Particularmente útil para artículos que requieren un tono más académico.
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Modal para ejemplos de instrucciones */}
      {instructionsHelpOpen && (
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
              <Typography variant="h6" color="primary.main">Ejemplos de instrucciones específicas</Typography>
              <IconButton onClick={() => setInstructionsHelpOpen(false)} edge="end" size="small">
                <Typography sx={{ fontSize: '1.5rem' }}>&times;</Typography>
              </IconButton>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              Las instrucciones específicas te permiten personalizar el artículo de revisión según tus necesidades.
              Puedes indicar el enfoque, estilo, estructura o cualquier otro aspecto que desees destacar.
            </Typography>
            
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f9ff', mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Ejemplo 1: Estructura para revisión científica
                </Typography>
                <Tooltip title="Copiar al portapapeles">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopyExample("Necesito un artículo estructurado como revisión científica con enfoque metódico. Utiliza un lenguaje académico formal y organiza el contenido en estas secciones: introducción con justificación de la revisión, metodología detallando criterios de búsqueda y selección, resultados principales agrupados por temáticas, discusión que contraste hallazgos, conclusiones con implicaciones prácticas, y recomendaciones para investigación futura. Incluye tablas comparativas de los estudios más relevantes.")}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.9rem' }}>
                "Necesito un artículo estructurado como revisión científica con enfoque metódico. Utiliza un lenguaje académico formal y organiza el contenido en estas secciones: introducción con justificación de la revisión, metodología detallando criterios de búsqueda y selección, resultados principales agrupados por temáticas, discusión que contraste hallazgos, conclusiones con implicaciones prácticas, y recomendaciones para investigación futura. Incluye tablas comparativas de los estudios más relevantes."
              </Box>
            </Box>
            
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f9ff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Ejemplo 2: Enfoque en tendencias emergentes
                </Typography>
                <Tooltip title="Copiar al portapapeles">
                  <IconButton 
                    size="small" 
                    onClick={() => handleCopyExample("Elabora un artículo de revisión enfocado en las tendencias emergentes y avances recientes de los últimos 5 años en este campo. Prioriza los estudios con mayor impacto y evidencia experimental sólida. Organiza la información cronológicamente para mostrar la evolución de los conceptos clave. Dedica una sección específica a las limitaciones metodológicas de los estudios actuales y destaca las áreas de consenso y controversia entre investigadores. Concluye con una perspectiva sobre las direcciones futuras más prometedoras.")}
                    sx={{ color: 'primary.main' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.9rem' }}>
                "Elabora un artículo de revisión enfocado en las tendencias emergentes y avances recientes de los últimos 5 años en este campo. Prioriza los estudios con mayor impacto y evidencia experimental sólida. Organiza la información cronológicamente para mostrar la evolución de los conceptos clave. Dedica una sección específica a las limitaciones metodológicas de los estudios actuales y destaca las áreas de consenso y controversia entre investigadores. Concluye con una perspectiva sobre las direcciones futuras más prometedoras."
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Snackbar para confirmar copia */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        message="Instrucciones copiadas al campo de texto"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default ReviewArticleForm;
