const pdfParse = require('pdf-parse');
const fs = require('fs-extra');

/**
 * Extract text from a PDF file
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<string>} - The extracted text
 */
exports.extractPdfText = async (pdfPath) => {
  try {
    const dataBuffer = await fs.readFile(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

/**
 * Split text into chunks for processing
 * @param {string} text - Text to chunk
 * @param {number} chunkSize - Maximum size of each chunk
 * @param {number} overlap - Overlap between chunks
 * @returns {string[]} - Array of text chunks
 */
exports.chunkText = (text, chunkSize = 1000, overlap = 200) => {
  const chunks = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    let endIndex = Math.min(startIndex + chunkSize, text.length);
    
    // Try to find a natural break point (newline or period followed by space)
    if (endIndex < text.length) {
      const naturalBreak = text.lastIndexOf('.\n', endIndex);
      const newlineBreak = text.lastIndexOf('\n', endIndex);
      const periodBreak = text.lastIndexOf('. ', endIndex);
      
      // Use the closest break point that's not too far back
      const minBreakPoint = startIndex + (chunkSize / 2);
      const breakCandidates = [naturalBreak, newlineBreak, periodBreak]
        .filter(bp => bp > minBreakPoint);
      
      if (breakCandidates.length > 0) {
        endIndex = Math.max(...breakCandidates) + 1;
      }
    }
    
    chunks.push(text.substring(startIndex, endIndex).trim());
    startIndex = endIndex - overlap;
  }
  
  return chunks;
};

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vecA - First vector
 * @param {number[]} vecB - Second vector
 * @returns {number} - Similarity score between 0 and 1
 */
exports.cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Format a size in bytes to a human-readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size string
 */
exports.formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};
