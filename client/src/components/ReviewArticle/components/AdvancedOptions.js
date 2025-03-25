import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Chip,
  Grid,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Slider,
  Stack,
  Divider,
  Button
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';

/**
 * Componente que muestra las opciones avanzadas para la configuración del modelo
 */
const AdvancedOptions = ({
  showAdvancedOptions,
  toggleAdvancedOptions,
  modelParams,
  handleAdvancedOptionChange,
  useMaxTokens,
  setUseMaxTokens
}) => {
  // Manejadores para los sliders
  const handleSliderChange = (paramName) => (event, newValue) => {
    handleAdvancedOptionChange(paramName)({ target: { value: newValue } });
  };

  return (
    <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        onClick={toggleAdvancedOptions}
        variant="outlined"
        startIcon={<SettingsIcon />}
        sx={{
          mb: 2,
          px: 3,
          py: 0.8,
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: showAdvancedOptions ? 1 : 0,
          backgroundColor: showAdvancedOptions ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
            boxShadow: 1
          }
        }}
      >
        Opciones avanzadas del modelo
      </Button>

      {showAdvancedOptions && (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            mb: 2,
            width: '85%',
            maxWidth: '800px',
            mx: 'auto',
            position: 'relative'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={useMaxTokens} 
                  onChange={(e) => setUseMaxTokens(e.target.checked)} 
                  size="small"
                  color="primary"
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 22 } }}
                />
              } 
              label={
                <Typography variant="body2" fontWeight="medium" color="text.primary">
                  Usar máximo de tokens disponibles
                </Typography>
              }
            />
          </Box>
          
          <Typography variant="subtitle2" color="primary" sx={{ textAlign: 'center', mb: 2, fontWeight: 600 }}>
            Parámetros de generación
          </Typography>

          <Grid container spacing={4} sx={{ px: { xs: 0, sm: 3 } }}>
            {/* Temperatura */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2, mx: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Temperature:</Typography>
                  <Typography variant="body2" color="primary.main" fontWeight="medium">{modelParams.temperature}</Typography>
                </Box>
                <Slider
                  value={modelParams.temperature}
                  onChange={handleSliderChange('temperature')}
                  step={0.1}
                  min={0}
                  max={1}
                  valueLabelDisplay="auto"
                  size="small"
                />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, textAlign: 'center' }}>
                  Valores más altos = más creatividad, valores más bajos = más precisión
                </Typography>
              </Box>
            </Grid>
            
            {/* Top P */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2, mx: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Top P:</Typography>
                  <Typography variant="body2" color="primary.main" fontWeight="medium">{modelParams.top_p}</Typography>
                </Box>
                <Slider
                  value={modelParams.top_p}
                  onChange={handleSliderChange('top_p')}
                  step={0.1}
                  min={0}
                  max={1}
                  valueLabelDisplay="auto"
                  size="small"
                />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, textAlign: 'center' }}>
                  Controla la diversidad de palabras (1 = considerar todas las palabras)
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Frequency Penalty */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2, mx: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Frequency Penalty:</Typography>
                  <Typography variant="body2" color="primary.main" fontWeight="medium">{modelParams.frequency_penalty}</Typography>
                </Box>
                <Slider
                  value={modelParams.frequency_penalty}
                  onChange={handleSliderChange('frequency_penalty')}
                  step={0.1}
                  min={0}
                  max={2}
                  valueLabelDisplay="auto"
                  size="small"
                />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, textAlign: 'center' }}>
                  Reduce la repetición de palabras frecuentes
                </Typography>
              </Box>
            </Grid>
            
            {/* Presence Penalty */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2, mx: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Presence Penalty:</Typography>
                  <Typography variant="body2" color="primary.main" fontWeight="medium">{modelParams.presence_penalty}</Typography>
                </Box>
                <Slider
                  value={modelParams.presence_penalty}
                  onChange={handleSliderChange('presence_penalty')}
                  step={0.1}
                  min={0}
                  max={2}
                  valueLabelDisplay="auto"
                  size="small"
                />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, textAlign: 'center' }}>
                  Incentiva hablar de nuevos temas
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default AdvancedOptions;
