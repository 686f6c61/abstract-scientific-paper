import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Typography,
  TextField,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Snackbar,
  InputAdornment,
  Link
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';

const ApiKeysConfig = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [openaiKeyValid, setOpenaiKeyValid] = useState(null);
  const [anthropicKeyValid, setAnthropicKeyValid] = useState(null);
  const [openaiKeyLoading, setOpenaiKeyLoading] = useState(false);
  const [anthropicKeyLoading, setAnthropicKeyLoading] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    // Verificar si las claves ya están configuradas
    checkKeysStatus();
  }, []);

  const checkKeysStatus = async () => {
    try {
      const response = await axios.get('/api/config/api-keys-status');
      setOpenaiKeyValid(response.data.openaiConfigured);
      setAnthropicKeyValid(response.data.anthropicConfigured);
    } catch (error) {
      console.error('Error al verificar el estado de las claves API:', error);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const validateOpenAIKey = async () => {
    if (!openaiKey) return;
    
    setOpenaiKeyLoading(true);
    try {
      const response = await axios.post('/api/config/validate-openai-key', { apiKey: openaiKey });
      setOpenaiKeyValid(response.data.valid);
      
      if (response.data.valid) {
        showSnackbar('API Key de OpenAI verificada correctamente', 'success');
      } else {
        showSnackbar('API Key de OpenAI inválida', 'error');
      }
    } catch (error) {
      setOpenaiKeyValid(false);
      showSnackbar('Error al validar la API Key de OpenAI', 'error');
      console.error('Error al validar la API Key de OpenAI:', error);
    } finally {
      setOpenaiKeyLoading(false);
    }
  };

  const validateAnthropicKey = async () => {
    if (!anthropicKey) return;
    
    setAnthropicKeyLoading(true);
    try {
      const response = await axios.post('/api/config/validate-anthropic-key', { apiKey: anthropicKey });
      setAnthropicKeyValid(response.data.valid);
      
      if (response.data.valid) {
        showSnackbar('API Key de Claude verificada correctamente', 'success');
      } else {
        showSnackbar('API Key de Claude inválida', 'error');
      }
    } catch (error) {
      setAnthropicKeyValid(false);
      showSnackbar('Error al validar la API Key de Claude', 'error');
      console.error('Error al validar la API Key de Claude:', error);
    } finally {
      setAnthropicKeyLoading(false);
    }
  };

  const saveKeys = async () => {
    try {
      await axios.post('/api/config/save-api-keys', {
        openaiKey: openaiKey || null,
        anthropicKey: anthropicKey || null
      });
      
      showSnackbar('Configuración guardada correctamente', 'success');
      handleCloseDialog();
      checkKeysStatus();
    } catch (error) {
      showSnackbar('Error al guardar la configuración', 'error');
      console.error('Error al guardar las API Keys:', error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Button 
        color="inherit"
        onClick={handleOpenDialog}
        aria-label="Configuración de API Keys"
        sx={{ 
          minWidth: 'auto', 
          p: 1, 
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 
              openaiKeyValid === true && anthropicKeyValid === true ? 'success.main' :
              (openaiKeyValid === true || anthropicKeyValid === true) ? 'warning.main' :
              'error.main',
            top: '5px',
            right: '5px',
            border: '1px solid white'
          }
        }}
      >
        <KeyIcon />
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="api-keys-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="api-keys-dialog-title" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyIcon /> Configuración de API Keys
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, pb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Configura tus claves de API para los diferentes modelos de lenguaje utilizados en la aplicación.
          </Typography>
          
          <Alert severity="info" sx={{ my: 2 }}>
            Las API Keys se guardarán de forma segura en tu archivo .env local. No necesitarás configurarlas nuevamente después del reinicio de la aplicación.
          </Alert>

          <Box sx={{ my: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Importante:</strong> Para utilizar esta aplicación, necesitas al menos una API key válida de OpenAI o Anthropic.
            </Typography>
            
            <Box component="div" sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                • <strong>OpenAI API:</strong> Necesaria para usar los modelos GPT-4o y GPT-4o-mini.
              </Typography>
              <Box component="div" sx={{ mt: 0.5, ml: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>1. Crea una cuenta en OpenAI (platform.openai.com/signup)</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>2. Ve a API Keys (platform.openai.com/api-keys)</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>3. Haz clic en "Create new API key"</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>4. Copia la API key generada (comienza con "sk-")</Typography>
              </Box>
            </Box>
            
            <Box component="div" sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                • <strong>Anthropic API:</strong> Necesaria para usar el modelo Claude 3.7 Sonnet.
              </Typography>
              <Box component="div" sx={{ mt: 0.5, ml: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>1. Crea una cuenta en Anthropic (console.anthropic.com/signup)</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>2. Ve a API Keys (console.anthropic.com/account/keys)</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>3. Haz clic en "Create key"</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>4. Copia la API key generada (comienza con "sk-ant-")</Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <img src="https://openai.com/favicon.ico" alt="OpenAI Logo" style={{ width: 24, height: 24, marginRight: 8 }} />
                OpenAI (GPT-4o, GPT-4o-mini)
                {openaiKeyValid === true && <CheckCircleIcon color="success" sx={{ ml: 2 }} />}
                {openaiKeyValid === false && <ErrorIcon color="error" sx={{ ml: 2 }} />}
              </Typography>
              
              <TextField
                label="API Key de OpenAI"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                fullWidth
                variant="outlined"
                type={showOpenaiKey ? "text" : "password"}
                placeholder="sk-..."
                helperText="Obtén tu API Key en: platform.openai.com"
                FormHelperTextProps={{
                  component: 'div',
                  sx: { mt: 1 }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        edge="end"
                      >
                        {showOpenaiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained"
                onClick={validateOpenAIKey}
                disabled={!openaiKey || openaiKeyLoading}
                sx={{ mt: 1 }}
              >
                {openaiKeyLoading ? <CircularProgress size={24} /> : 'Verificar'}
              </Button>
            </Paper>
            
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <img src="https://claude.ai/favicon.ico" alt="Anthropic Logo" style={{ width: 24, height: 24, marginRight: 8 }} />
                Anthropic (Claude 3.7 Sonnet)
                {anthropicKeyValid === true && <CheckCircleIcon color="success" sx={{ ml: 2 }} />}
                {anthropicKeyValid === false && <ErrorIcon color="error" sx={{ ml: 2 }} />}
              </Typography>
              
              <TextField
                label="API Key de Claude"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                fullWidth
                variant="outlined"
                type={showAnthropicKey ? "text" : "password"}
                placeholder="sk-ant-..."
                helperText="Obtén tu API Key en: console.anthropic.com"
                FormHelperTextProps={{
                  component: 'div',
                  sx: { mt: 1 }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                        edge="end"
                      >
                        {showAnthropicKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained"
                onClick={validateAnthropicKey}
                disabled={!anthropicKey || anthropicKeyLoading}
                sx={{ mt: 1 }}
              >
                {anthropicKeyLoading ? <CircularProgress size={24} /> : 'Verificar'}
              </Button>
            </Paper>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={saveKeys} 
            color="primary" 
            variant="contained"
            disabled={Boolean((openaiKey && openaiKeyValid !== true) || (anthropicKey && anthropicKeyValid !== true))}
          >
            Guardar configuración
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ApiKeysConfig;
