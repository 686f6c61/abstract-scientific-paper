import React from 'react';
import {
  TextField,
  Box,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ModelSelector from './ModelSelector';

const QueryInput = ({
  query,
  setQuery,
  handleSubmit,
  isSimpleQuery,
  selectedPdfs,
  model,
  setModel,
  isLoading,
  error
}) => {
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
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
        disabled={isLoading}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
        <ModelSelector 
          model={model} 
          setModel={setModel} 
          disabled={isLoading} 
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading || !query.trim()}
          sx={{ 
            py: 1, 
            px: 3,
            borderRadius: 2,
            textTransform: 'none'
          }}
          endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        >
          {isLoading ? 'Procesando...' : (isSimpleQuery ? 'Consultar' : 'Generar')}
        </Button>
      </Box>
    </Box>
  );
};

export default QueryInput;
