const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf.controller');

// Routes for PDF operations
router.post('/upload', pdfController.uploadPdf);
router.get('/list', pdfController.listPdfs);
router.delete('/delete/:id', pdfController.deletePdf);
router.get('/info/:id', pdfController.getPdfInfo);

module.exports = router;
