const express = require('express');
const router = express.Router();
const anthropicController = require('../controllers/anthropic.controller');

// Process query using Claude
router.post('/query', anthropicController.processQuery);

// Generate summary using Claude
router.post('/summary', anthropicController.generateSummary);

module.exports = router;
