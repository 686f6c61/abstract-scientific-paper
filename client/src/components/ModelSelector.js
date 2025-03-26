import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const ModelSelector = ({ model, setModel, disabled }) => {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl variant="outlined" size="small" sx={{ minWidth: '200px' }}>
        <InputLabel id="model-select-label">Modelo</InputLabel>
        <Select
          labelId="model-select-label"
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          label="Modelo"
          disabled={disabled}
        >
          <MenuItem value="gpt-4o-mini">GPT-4o-mini (Rápido)</MenuItem>
          <MenuItem value="gpt-4o">GPT-4o (Avanzado)</MenuItem>
          <MenuItem value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet</MenuItem>
        </Select>
      </FormControl>
      
      <Button 
        variant="text" 
        size="small"
        startIcon={<HelpOutlineIcon />}
        onClick={() => setInfoOpen(true)}
      >
        ¿Qué modelo elegir?
      </Button>

      {/* Modal de información del modelo */}
      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Información sobre los modelos</DialogTitle>
        <DialogContent>
          {/* GPT-4o-mini */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">GPT-4o-mini (Rápido)</Typography>
            <Typography variant="body2">
              Modelo rápido y económico de OpenAI. Ideal para consultas simples y resumen de información.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* GPT-4o */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">GPT-4o (Avanzado)</Typography>
            <Typography variant="body2">
              Modelo avanzado de OpenAI con mayor capacidad de comprensión y generación de texto de alta calidad.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Claude 3.7 Sonnet */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">Claude 3.7 Sonnet</Typography>
            <Typography variant="body2">
              Modelo avanzado de Anthropic con excelente capacidad para comprensión contextual y generación de respuestas detalladas.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelSelector;
