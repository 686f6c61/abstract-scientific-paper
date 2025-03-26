import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ForumIcon from '@mui/icons-material/Forum';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { usePdf } from '../contexts/PdfContext';
import QueryHistoryFixed from './QueryHistoryFixed';
import ResultsDisplay from './ResultsDisplay';
import QueryInput from './QueryInput';
import AdvancedOptions from './AdvancedOptions';
import QueryExamples from './QueryExamples';

const QueryForm = ({ isSimpleQuery }) => {
  const { 
    processQuery, 
    generateSummary, 
    selectedPdfs,
    queryLoading,
    summaryLoading,
    queryHistory = [], // Proporcionar un array vacío por defecto
    searchResults
  } = usePdf();
  
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('Español');
  const [model, setModel] = useState('gpt-4o-mini');
  const [error, setError] = useState(null);
  const [queryExamplesOpen, setQueryExamplesOpen] = useState(false);
  const [resumeInfoOpen, setResumeInfoOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState('query'); // Inicializar en 'query' por defecto
  
  // Parámetros avanzados para los modelos
  const [maxTokens, setMaxTokens] = useState(8000); // Actualizado a 8000 para Claude 3.7 Sonnet
  const [useMaxTokens, setUseMaxTokens] = useState(true);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);

  // Verificar si hay consultas en el historial y actualizar viewMode si es necesario
  useEffect(() => {
    if (queryHistory && queryHistory.length > 0) {
      // Solo cambiar a historial automáticamente si hay consultas
      // y si es la primera carga
      if (viewMode === 'query' && !query) {
        setViewMode('history');
      }
    }
  }, [queryHistory, viewMode, query]);

  // Manejar la selección de una consulta anterior para reusarla
  const handleSelectQuery = (queryText) => {
    setQuery(queryText);
    setViewMode('query'); // Cambiamos a la vista de consulta para poder editarla
  };

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
        setQuery(''); // Limpiar el campo de consulta
        setViewMode('history'); // Cambiar a vista de historial después de consultar
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
    <Box sx={{ width: '100%' }}>
      {/* Pestañas para alternar entre Consulta e Historial */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={viewMode} 
          onChange={(e, newValue) => setViewMode(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<ChatIcon />} 
            iconPosition="start" 
            label="Nueva consulta" 
            value="query" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: viewMode === 'query' ? 'bold' : 'normal',
              py: 1.5
            }}
          />
          <Tab 
            icon={<ForumIcon />} 
            iconPosition="start" 
            label={`Historial ${queryHistory && queryHistory.length > 0 ? `(${queryHistory.length})` : ''}`} 
            value="history" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: viewMode === 'history' ? 'bold' : 'normal',
              py: 1.5
            }}
          />
        </Tabs>
      </Paper>
      
      {/* Vista de consulta */}
      {viewMode === 'query' ? (
        <>
          {/* Encabezado con título y botón de ayuda */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              {isSimpleQuery ? 'CONSULTA SOBRE ARTÍCULO' : 'GENERAR RESUMEN ESTRUCTURADO'}
            </Typography>
            
            <Tooltip title={isSimpleQuery ? "Ver ejemplos de consultas" : "Ver ejemplos de instrucciones para resúmenes"}>
              <IconButton 
                size="small" 
                color="primary" 
                onClick={() => isSimpleQuery ? setQueryExamplesOpen(true) : setResumeInfoOpen(true)}
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Mostrar errores */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Alerta de PDFs no seleccionados */}
          {selectedPdfs.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No has seleccionado ningún PDF. Se buscarán en todos los documentos disponibles.
            </Alert>
          )}
          
          {/* Formulario de consulta */}
          <QueryInput 
            query={query}
            setQuery={setQuery}
            handleSubmit={handleSubmit}
            isSimpleQuery={isSimpleQuery}
            selectedPdfs={selectedPdfs}
            model={model}
            setModel={setModel}
            isLoading={queryLoading || summaryLoading}
            error={error}
          />
          
          {/* Opciones avanzadas solo para resúmenes */}
          {!isSimpleQuery && (
            <AdvancedOptions 
              maxTokens={maxTokens}
              setMaxTokens={setMaxTokens}
              useMaxTokens={useMaxTokens}
              setUseMaxTokens={setUseMaxTokens}
              temperature={temperature}
              setTemperature={setTemperature}
              topP={topP}
              setTopP={setTopP}
              frequencyPenalty={frequencyPenalty}
              setFrequencyPenalty={setFrequencyPenalty}
              presencePenalty={presencePenalty}
              setPresencePenalty={setPresencePenalty}
              language={language}
              setLanguage={setLanguage}
            />
          )}
          
          {/* Mostrar resultados si estamos en la vista de consulta */}
          {isSimpleQuery && searchResults && (
            <Box sx={{ mt: 3 }}>
              <ResultsDisplay type="query" data={searchResults} />
            </Box>
          )}
        </>
      ) : (
        // Vista de historial con la implementación mejorada
        <QueryHistoryFixed onSelectQuery={handleSelectQuery} />
      )}

      {/* Modal de ejemplos de consultas */}
      <QueryExamples 
        open={queryExamplesOpen || resumeInfoOpen}
        onClose={() => {
          setQueryExamplesOpen(false);
          setResumeInfoOpen(false);
        }}
        onCopyExample={handleCopyExample}
        isSimpleQuery={isSimpleQuery}
      />

      {/* Snackbar para confirmar copia */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        message="Instrucción copiada al campo de texto"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default QueryForm;
