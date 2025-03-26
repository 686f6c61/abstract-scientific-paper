import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Slider,
  FormControlLabel,
  Checkbox,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';

const AdvancedOptions = ({
  maxTokens,
  setMaxTokens,
  useMaxTokens,
  setUseMaxTokens,
  temperature,
  setTemperature,
  topP,
  setTopP,
  frequencyPenalty,
  setFrequencyPenalty,
  presencePenalty,
  setPresencePenalty,
  language,
  setLanguage
}) => {
  return (
    <Accordion 
      elevation={2}
      sx={{ 
        borderRadius: '8px',
        my: 2,
        '&::before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ 
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <TuneIcon sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>Opciones Avanzadas</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Selector de idioma */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="language-select-label">Idioma de salida</InputLabel>
              <Select
                labelId="language-select-label"
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                label="Idioma de salida"
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

          {/* Control de temperatura */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" gutterBottom>
              Temperatura: {temperature}
            </Typography>
            <Slider
              value={temperature}
              onChange={(e, newValue) => setTemperature(newValue)}
              min={0}
              max={2}
              step={0.1}
              marks={[
                { value: 0, label: 'Preciso' },
                { value: 1, label: 'Balanceado' },
                { value: 2, label: 'Creativo' }
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>

          {/* Top P */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" gutterBottom>
              Top P: {topP}
            </Typography>
            <Slider
              value={topP}
              onChange={(e, newValue) => setTopP(newValue)}
              min={0}
              max={1}
              step={0.05}
              valueLabelDisplay="auto"
            />
          </Grid>

          {/* Max Tokens */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useMaxTokens}
                    onChange={(e) => setUseMaxTokens(e.target.checked)}
                  />
                }
                label="Usar máximo de tokens por defecto"
              />
            </Box>
            {!useMaxTokens && (
              <>
                <Typography variant="body2" gutterBottom>
                  Máximo de tokens: {maxTokens}
                </Typography>
                <Slider
                  value={maxTokens}
                  onChange={(e, newValue) => setMaxTokens(newValue)}
                  min={100}
                  max={16000}
                  step={100}
                  valueLabelDisplay="auto"
                />
              </>
            )}
          </Grid>

          {/* Frequency Penalty */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" gutterBottom>
              Penalización por frecuencia: {frequencyPenalty}
            </Typography>
            <Slider
              value={frequencyPenalty}
              onChange={(e, newValue) => setFrequencyPenalty(newValue)}
              min={0}
              max={2}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>

          {/* Presence Penalty */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" gutterBottom>
              Penalización por presencia: {presencePenalty}
            </Typography>
            <Slider
              value={presencePenalty}
              onChange={(e, newValue) => setPresencePenalty(newValue)}
              min={0}
              max={2}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default AdvancedOptions;
