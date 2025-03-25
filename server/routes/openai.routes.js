const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openai.controller');

// Routes for OpenAI operations
router.post('/query', openaiController.processQuery);
router.post('/summary', openaiController.generateSummary);
router.post('/vectorize', openaiController.vectorizePdf);

module.exports = router;
