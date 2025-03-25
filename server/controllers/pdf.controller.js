const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');
const { extractPdfText } = require('../utils/pdf.utils');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

/**
 * Upload a PDF file
 */
exports.uploadPdf = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const pdfFile = req.files.file;
    
    // Check if file is a PDF
    if (!pdfFile.mimetype.includes('pdf')) {
      return res.status(400).json({ success: false, message: 'File must be a PDF' });
    }

    // Create a unique ID for the file
    const fileId = uuidv4();
    const fileName = fileId + '.pdf';
    const filePath = path.join(UPLOADS_DIR, fileName);

    // Move the file to the uploads directory
    await pdfFile.mv(filePath);

    // Extract basic PDF info
    const pdfData = await fs.readFile(filePath);
    const { info, numpages } = await pdfParse(pdfData);

    // Create metadata for the file
    const metadata = {
      id: fileId,
      originalName: pdfFile.name,
      fileName,
      filePath,
      uploadDate: new Date().toISOString(),
      pageCount: numpages,
      fileSize: pdfFile.size,
      title: info.Title || pdfFile.name,
      author: info.Author || 'Unknown',
      vectorized: false,
    };

    // Save metadata
    const metadataPath = path.join(UPLOADS_DIR, fileId + '.json');
    await fs.writeJson(metadataPath, metadata);

    res.status(200).json({ 
      success: true, 
      message: 'File uploaded successfully', 
      data: metadata 
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * List all PDF files
 */
exports.listPdfs = async (req, res) => {
  try {
    // Ensure the uploads directory exists
    await fs.ensureDir(UPLOADS_DIR);
    
    // Get all JSON files in the uploads directory
    const files = await fs.readdir(UPLOADS_DIR);
    const metadataFiles = files.filter(file => file.endsWith('.json'));
    
    // Read all metadata files
    const metadataPromises = metadataFiles.map(async (file) => {
      try {
        const metadataPath = path.join(UPLOADS_DIR, file);
        return await fs.readJson(metadataPath);
      } catch (err) {
        console.error(`Error reading metadata file ${file}:`, err);
        return null;
      }
    });
    
    const allMetadata = await Promise.all(metadataPromises);
    const validMetadata = allMetadata.filter(metadata => metadata !== null);
    
    // Sort by upload date (newest first)
    validMetadata.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    
    res.status(200).json({ 
      success: true, 
      data: validMetadata 
    });
  } catch (error) {
    console.error('Error listing PDFs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a PDF file
 */
exports.deletePdf = async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      return res.status(400).json({ success: false, message: 'File ID is required' });
    }
    
    const pdfPath = path.join(UPLOADS_DIR, fileId + '.pdf');
    const metadataPath = path.join(UPLOADS_DIR, fileId + '.json');
    const vectorStorePath = path.join(UPLOADS_DIR, fileId + '.vectors.json');
    
    // Check if the files exist
    const metadataExists = await fs.pathExists(metadataPath);
    if (!metadataExists) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    // Delete all associated files
    await Promise.all([
      fs.remove(pdfPath),
      fs.remove(metadataPath),
      fs.pathExists(vectorStorePath).then(exists => exists ? fs.remove(vectorStorePath) : null)
    ]);
    
    res.status(200).json({ 
      success: true, 
      message: 'File deleted successfully',
      fileId 
    });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get information about a PDF file
 */
exports.getPdfInfo = async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      return res.status(400).json({ success: false, message: 'File ID is required' });
    }
    
    const metadataPath = path.join(UPLOADS_DIR, fileId + '.json');
    
    // Check if the file exists
    const metadataExists = await fs.pathExists(metadataPath);
    if (!metadataExists) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    // Read metadata
    const metadata = await fs.readJson(metadataPath);
    
    res.status(200).json({ 
      success: true, 
      data: metadata 
    });
  } catch (error) {
    console.error('Error getting PDF info:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
