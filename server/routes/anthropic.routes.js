const express = require('express');
const router = express.Router();
const anthropicController = require('../controllers/anthropic.controller');

// Process query using Claude
router.post('/query', anthropicController.processQuery);

// Generate summary using Claude
router.post('/summary', anthropicController.generateSummary);

// Generate review article section using Claude
router.post('/review-article-section', anthropicController.generateReviewArticleSection);

module.exports = router;
