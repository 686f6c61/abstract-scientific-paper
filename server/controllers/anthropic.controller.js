const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');
const fs = require('fs-extra');
const { extractPdfText, chunkText } = require('../utils/pdf.utils');
const { getSummaryPrompt, getFileSpecificPrompt } = require('../utils/prompts');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Esta clave debe estar en el archivo .env
});

/**
 * Generate a structured summary of PDF documents using Claude
 */
exports.generateSummary = async (req, res) => {
  try {
    const { query, fileIds = [], language = "Español" } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    // Retrieve content from specified files or all files if none specified
    let context = '';
    let pdfFiles = [];

    if (fileIds && fileIds.length > 0) {
      // Get specific files
      const filePromises = fileIds.map(async (fileId) => {
        const metadataPath = path.join(UPLOADS_DIR, fileId + '.json');
        const pdfPath = path.join(UPLOADS_DIR, fileId + '.pdf');
        
        if (await fs.pathExists(metadataPath) && await fs.pathExists(pdfPath)) {
          const metadata = await fs.readJson(metadataPath);
          const pdfText = await extractPdfText(pdfPath);
          return {
            ...metadata,
            text: pdfText
          };
        }
        return null;
      });
      
      pdfFiles = (await Promise.all(filePromises)).filter(file => file !== null);
    } else {
      // Get all files
      const files = await fs.readdir(UPLOADS_DIR);
      const metadataFiles = files.filter(file => file.endsWith('.json'));
      
      const filePromises = metadataFiles.map(async (file) => {
        const fileId = path.basename(file, '.json');
        const metadataPath = path.join(UPLOADS_DIR, file);
        const pdfPath = path.join(UPLOADS_DIR, fileId + '.pdf');
        
        if (await fs.pathExists(pdfPath)) {
          const metadata = await fs.readJson(metadataPath);
          const pdfText = await extractPdfText(pdfPath);
          return {
            ...metadata,
            text: pdfText
          };
        }
        return null;
      });
      
      pdfFiles = (await Promise.all(filePromises)).filter(file => file !== null);
    }

    if (pdfFiles.length === 0) {
      return res.status(404).json({ success: false, message: 'No PDF files found' });
    }

    // Combine text from all files with document metadata
    const contextParts = pdfFiles.map(file => {
      return `DOCUMENT: ${file.originalName}\nCONTENT:\n${file.text}\n\n`;
    });
    context = contextParts.join('---\n');

    // Get the summary prompt
    const summaryPrompt = getSummaryPrompt(query, language);
    const fileSpecificPrompt = getFileSpecificPrompt(fileIds);
    const fullPrompt = summaryPrompt + fileSpecificPrompt;

    // Extraer parámetros del modelo y otros parámetros avanzados
    const modelName = req.body.model || "claude-3-7-sonnet-20250219";
    
    // Crear el objeto de parámetros para Anthropic
    const modelParams = {
      model: modelName
    };
    
    // Agregar parámetros adicionales si están presentes en la solicitud
    if (req.body.temperature !== undefined) modelParams.temperature = req.body.temperature;
    if (req.body.max_tokens !== undefined) modelParams.max_tokens = req.body.max_tokens;
    if (req.body.top_p !== undefined) modelParams.top_p = req.body.top_p;
    
    // Define max tokens based on model si no se especificó en los parámetros
    // Mapa de tokens máximos recomendados por modelo de Claude
    // Claude 3.7 Sonnet tiene una ventana de contexto de 200K tokens
    // Ajustamos los límites de respuesta de manera conservadora
    const maxTokensMap = {
      "claude-3-7-sonnet-20250219": 4096,   // Claude 3.7 Sonnet - 4K por defecto
      "claude-3-haiku-20240307": 2048,    // Si se añade Claude Haiku en el futuro
      "claude-3-opus-20240229": 4096      // Si se añade Claude Opus en el futuro
    };
    
    // Si no hay max_tokens especificado, usar el valor predeterminado según el modelo
    if (modelParams.max_tokens === undefined) {
      modelParams.max_tokens = maxTokensMap[modelParams.model] || 4096;
    }
    
    // Establecer valores predeterminados para otros parámetros si no están definidos
    if (modelParams.temperature === undefined) modelParams.temperature = 0.7;
    if (modelParams.top_p === undefined) modelParams.top_p = 1;
    
    // Validar tipos de datos
    modelParams.temperature = Number(modelParams.temperature);
    modelParams.max_tokens = Number(modelParams.max_tokens);
    modelParams.top_p = Number(modelParams.top_p);
    
    // Crear el sistema y mensajes del usuario
    const systemMessage = fullPrompt;
    const userMessage = `DOCUMENT CONTEXT:\n${context}\n\nQUERY: ${query}`;
    
    // Log para depuración y verificación de valores
    console.log("Parámetros para Anthropic:", JSON.stringify(modelParams, null, 2));
    
    // Llamada a la API de Anthropic (Claude)
    const response = await anthropic.messages.create({
      model: modelParams.model,
      system: systemMessage,
      messages: [
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: modelParams.temperature,
      max_tokens: modelParams.max_tokens,
      top_p: modelParams.top_p
    });
    
    // Extract token usage from the response
    const tokenUsage = {
      promptTokens: response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens
    };

    res.status(200).json({
      success: true,
      data: {
        summary: response.content[0].text,
        sources: pdfFiles.map(file => ({
          id: file.id,
          title: file.title || file.originalName,
          originalName: file.originalName
        })),
        tokenUsage: tokenUsage,
        model: modelParams.model
      }
    });

  } catch (error) {
    console.error('Error generating summary with Claude:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Process a query against PDF documents using Claude
 */
exports.processQuery = async (req, res) => {
  try {
    const { query, fileIds = [] } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    // Retrieve content from specified files or all files if none specified
    let context = '';
    let pdfFiles = [];

    if (fileIds && fileIds.length > 0) {
      // Get specific files
      const filePromises = fileIds.map(async (fileId) => {
        const metadataPath = path.join(UPLOADS_DIR, fileId + '.json');
        const pdfPath = path.join(UPLOADS_DIR, fileId + '.pdf');
        
        if (await fs.pathExists(metadataPath) && await fs.pathExists(pdfPath)) {
          const metadata = await fs.readJson(metadataPath);
          const pdfText = await extractPdfText(pdfPath);
          return {
            ...metadata,
            text: pdfText
          };
        }
        return null;
      });
      
      pdfFiles = (await Promise.all(filePromises)).filter(file => file !== null);
    } else {
      // Get all files
      const files = await fs.readdir(UPLOADS_DIR);
      const metadataFiles = files.filter(file => file.endsWith('.json'));
      
      const filePromises = metadataFiles.map(async (file) => {
        const fileId = path.basename(file, '.json');
        const metadataPath = path.join(UPLOADS_DIR, file);
        const pdfPath = path.join(UPLOADS_DIR, fileId + '.pdf');
        
        if (await fs.pathExists(pdfPath)) {
          const metadata = await fs.readJson(metadataPath);
          const pdfText = await extractPdfText(pdfPath);
          return {
            ...metadata,
            text: pdfText
          };
        }
        return null;
      });
      
      pdfFiles = (await Promise.all(filePromises)).filter(file => file !== null);
    }

    if (pdfFiles.length === 0) {
      return res.status(404).json({ success: false, message: 'No PDF files found' });
    }

    // Combine text from all files with document metadata
    const contextParts = pdfFiles.map(file => {
      return `DOCUMENT: ${file.originalName}\nCONTENT:\n${file.text}\n\n`;
    });
    context = contextParts.join('---\n');

    // Obtener los parámetros desde la solicitud
    const model = req.body.model || "claude-3-7-sonnet-20250219";
    const temperature = req.body.temperature !== undefined ? parseFloat(req.body.temperature) : 0.7;
    
    // Determinar el límite de tokens apropiado para el modelo
    const modelMaxTokens = {
      "claude-3-7-sonnet-20250219": 4096,   // Claude 3.7 Sonnet
      "claude-3-haiku-20240307": 2048,    // Si se añade Claude Haiku en el futuro
      "claude-3-opus-20240229": 4096      // Si se añade Claude Opus en el futuro
    };
    
    // Aplicar límites al valor de max_tokens para el modelo específico
    const modelLimit = modelMaxTokens[model] || 4096;
    const max_tokens = req.body.max_tokens !== undefined ? 
      Math.min(Math.max(parseInt(req.body.max_tokens), 1), modelLimit) : 
      1000;
    
    console.log(`Llamando a Claude API con modelo: ${model}, temperatura: ${temperature}, max_tokens: ${max_tokens}`);
    
    // Call Claude API
    const response = await anthropic.messages.create({
      model: model,
      system: "You are a helpful assistant specialized in extracting information from PDF documents. Answer based on the content provided in the document context. If the information is not found in the context, say so clearly.",
      messages: [
        {
          role: "user",
          content: `CONTEXT:\n${context}\n\nQUERY: ${query}`
        }
      ],
      temperature: temperature,
      max_tokens: max_tokens,
    });

    res.status(200).json({
      success: true,
      data: {
        response: response.content[0].text,
        sources: pdfFiles.map(file => ({
          id: file.id,
          title: file.title || file.originalName,
          originalName: file.originalName
        })),
        tokenUsage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens
        },
        model: "claude-3-7-sonnet-20250219"
      }
    });

  } catch (error) {
    console.error('Error processing query with Claude:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
