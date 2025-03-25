const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');
const { extractPdfText, chunkText } = require('../utils/pdf.utils');
const { getSummaryPrompt, getFileSpecificPrompt } = require('../utils/prompts');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Configuración para la API de Deepseek
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Generate a structured summary of PDF documents using Deepseek
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
      return res.status(400).json({ success: false, message: 'No PDF files found' });
    }

    // Generate context string with file content
    const contextParts = pdfFiles.map(file => {
      return `DOCUMENTO: ${file.originalName || 'Documento'}
CONTENIDO:
${file.text}`;
    });
    
    context = contextParts.join('\n---\n');
    
    // Prepare the prompt for generating the summary
    const summaryPrompt = getSummaryPrompt(language);
    
    // Add context and query to the prompt
    const fullPrompt = `${summaryPrompt}`;

    // Extraer parámetros del modelo y otros parámetros avanzados
    const modelName = req.body.model || "deepseek-chat";
    
    // Crear el objeto de parámetros para Deepseek
    const modelParams = {
      model: modelName
    };
    
    // Agregar parámetros opcionales si existen en el cuerpo de la solicitud
    if (req.body.temperature !== undefined) modelParams.temperature = req.body.temperature;
    if (req.body.max_tokens !== undefined) modelParams.max_tokens = req.body.max_tokens;
    if (req.body.top_p !== undefined) modelParams.top_p = req.body.top_p;
    
    // Define max tokens based on model si no se especificó en los parámetros
    // Mapa de tokens máximos recomendados por modelo de Deepseek
    const maxTokensMap = {
      "deepseek-chat": 4096       // Deepseek Chat (modelo principal)
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
    console.log("Parámetros para Deepseek:", JSON.stringify(modelParams, null, 2));
    
    // Llamada a la API de Deepseek
    const response = await axios.post(DEEPSEEK_API_URL, {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: modelParams.temperature,
      max_tokens: modelParams.max_tokens,
      top_p: modelParams.top_p
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Extract token usage from the response
    const tokenUsage = {
      promptTokens: response.data.usage.prompt_tokens,
      completionTokens: response.data.usage.completion_tokens,
      totalTokens: response.data.usage.total_tokens
    };

    res.status(200).json({
      success: true,
      data: {
        summary: response.data.choices[0].message.content,
        sources: pdfFiles.map(file => ({
          id: file.id,
          title: file.originalName,
          originalName: file.originalName
        })),
        tokenUsage,
        model: modelParams.model
      }
    });
  } catch (error) {
    console.error('Error generating summary with Deepseek:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating summary',
      error: error.response?.data?.error?.message || error.message
    });
  }
};

/**
 * Process a query against PDF documents using Deepseek
 */
exports.processQuery = async (req, res) => {
  try {
    const { query, fileIds } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }
    
    // Retrieve files
    let context = '';
    let pdfFiles = [];
    
    if (fileIds && fileIds.length > 0) {
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
      return res.status(400).json({ success: false, message: 'No file IDs provided' });
    }
    
    if (pdfFiles.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid PDF files found' });
    }
    
    // Generate context from files
    const contextParts = pdfFiles.map(file => {
      return `DOCUMENTO: ${file.originalName || 'Documento sin nombre'}
CONTENIDO:
${file.text}`;
    });
    context = contextParts.join('---\n');

    // Obtener los parámetros desde la solicitud
    const model = req.body.model || "deepseek-chat";
    const temperature = req.body.temperature !== undefined ? parseFloat(req.body.temperature) : 0.7;
    
    // Determinar el límite de tokens apropiado para el modelo
    const modelMaxTokens = {
      "deepseek-chat": 4096     // Deepseek Chat
    };
    
    // Aplicar límites al valor de max_tokens para el modelo específico
    const modelLimit = modelMaxTokens[model] || 4096;
    const max_tokens = req.body.max_tokens !== undefined ? 
      Math.min(Math.max(parseInt(req.body.max_tokens), 1), modelLimit) : 
      1000;
    
    console.log(`Llamando a Deepseek API con modelo: ${model}, temperatura: ${temperature}, max_tokens: ${max_tokens}`);
    
    // Call Deepseek API
    const response = await axios.post(DEEPSEEK_API_URL, {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant specialized in extracting information from PDF documents. Answer based on the content provided in the document context. If the information is not found in the context, say so clearly."
        },
        {
          role: "user",
          content: `CONTEXT:\n${context}\n\nQUERY: ${query}`
        }
      ],
      temperature: temperature,
      max_tokens: max_tokens,
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        response: response.data.choices[0].message.content,
        sources: pdfFiles.map(file => ({
          id: file.id,
          title: file.originalName,
          originalName: file.originalName
        })),
        tokenUsage: {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens
        },
        model: model
      }
    });
  } catch (error) {
    console.error('Error processing query with Deepseek:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing query',
      error: error.response?.data?.error?.message || error.message 
    });
  }
};
