const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');

// Obtener el estado de las API keys
router.get('/api-keys-status', configController.getApiKeysStatus);

// Validar API key de OpenAI
router.post('/validate-openai-key', configController.validateOpenaiKey);

// Validar API key de Anthropic
router.post('/validate-anthropic-key', configController.validateAnthropicKey);

// Guardar API keys
router.post('/save-api-keys', configController.saveApiKeys);

module.exports = router;
