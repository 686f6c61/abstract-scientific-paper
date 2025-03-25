const express = require('express');
const deepseekController = require('../controllers/deepseek.controller');

const router = express.Router();

// Route for processing query with Deepseek
router.post('/query', deepseekController.processQuery);

// Route for generating summary with Deepseek
router.post('/summary', deepseekController.generateSummary);

module.exports = router;
