const { OpenAI } = require('openai');
const path = require('path');
const fs = require('fs-extra');
const { extractPdfText, chunkText } = require('../utils/pdf.utils');
const { getSummaryPrompt, getFileSpecificPrompt, getReviewArticleSectionPrompt } = require('../utils/prompts');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a specific section of a review article based on multiple PDF summaries
 */
exports.generateReviewArticleSection = async (req, res) => {
  try {
    const { content, section, prompt, language = "Español", model = "gpt-4o", temperature = 0.7, max_tokens = 8000, top_p = 1, frequency_penalty = 0, presence_penalty = 0 } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    if (!section || !prompt) {
      return res.status(400).json({ success: false, message: 'Section title and prompt are required' });
    }

    // Prepare the custom prompt for this section
    const customPrompt = getReviewArticleSectionPrompt(prompt, language, content);

    console.log(`Generating article section "${section}" with ${max_tokens} max tokens`);

    // Make the API call to OpenAI
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: customPrompt }],
      max_tokens: max_tokens,
      temperature: temperature,
      top_p: top_p,
      frequency_penalty: frequency_penalty,
      presence_penalty: presence_penalty
    });

    const generatedContent = response.choices[0].message.content;
    
    // Calculate token usage
    const promptTokens = response.usage.prompt_tokens;
    const completionTokens = response.usage.completion_tokens;
    const totalTokens = response.usage.total_tokens;

    return res.json({
      success: true,
      data: {
        content: generatedContent,
        section: section,
        tokenUsage: {
          promptTokens,
          completionTokens,
          totalTokens
        }
      }
    });
  } catch (error) {
    console.error('Error generating review article section:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating review article section',
      error: error.message
    });
  }
};

/**
 * Process a query against PDF documents
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

    // Create a completion with the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // Using GPT-4o-mini as specified
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
      temperature: 0.7,
      max_tokens: 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        response: completion.choices[0].message.content,
        sources: pdfFiles.map(file => ({
          id: file.id,
          title: file.title || file.originalName,
          originalName: file.originalName
        }))
      }
    });

  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Generate a structured summary of PDF documents
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
    // Obtener el nombre del modelo (string)
    const modelName = req.body.model || "gpt-4o-mini";
    
    // Crear el objeto de parámetros para OpenAI
    const modelParams = {
      model: modelName
    };
    
    // Agregar parámetros adicionales si están presentes en la solicitud
    if (req.body.temperature !== undefined) modelParams.temperature = req.body.temperature;
    if (req.body.max_tokens !== undefined) modelParams.max_tokens = req.body.max_tokens;
    if (req.body.top_p !== undefined) modelParams.top_p = req.body.top_p;
    if (req.body.frequency_penalty !== undefined) modelParams.frequency_penalty = req.body.frequency_penalty;
    if (req.body.presence_penalty !== undefined) modelParams.presence_penalty = req.body.presence_penalty;
    
    // Define max tokens based on model si no se especificó en los parámetros
    const maxTokensMap = {
      "gpt-4o": 8192,
      "gpt-4o-mini": 4096
    };
    
    // Si no hay max_tokens especificado, usar el valor predeterminado según el modelo
    if (modelParams.max_tokens === undefined) {
      modelParams.max_tokens = maxTokensMap[modelParams.model] || 4096;
    }
    
    // Establecer valores predeterminados para otros parámetros si no están definidos
    if (modelParams.temperature === undefined) modelParams.temperature = 0.7;
    if (modelParams.top_p === undefined) modelParams.top_p = 1;
    if (modelParams.frequency_penalty === undefined) modelParams.frequency_penalty = 0;
    if (modelParams.presence_penalty === undefined) modelParams.presence_penalty = 0;
    
    // Validar tipos de datos para evitar problemas con la API de OpenAI
    modelParams.temperature = Number(modelParams.temperature);
    modelParams.max_tokens = Number(modelParams.max_tokens);
    modelParams.top_p = Number(modelParams.top_p);
    modelParams.frequency_penalty = Number(modelParams.frequency_penalty);
    modelParams.presence_penalty = Number(modelParams.presence_penalty);
    
    // Create messages array
    const messages = [
      {
        role: "system",
        content: fullPrompt
      },
      {
        role: "user",
        content: `DOCUMENT CONTEXT:\n${context}\n\nQUERY: ${query}`
      }
    ];
    
    // Log para depuración y verificación de valores
    console.log("Parámetros para OpenAI:", JSON.stringify(modelParams, null, 2));
    
    // Create a completion with the OpenAI API con todos los parámetros configurables
    const completion = await openai.chat.completions.create({
      model: modelParams.model,
      messages: messages,
      temperature: modelParams.temperature,
      max_tokens: modelParams.max_tokens,
      top_p: modelParams.top_p,
      frequency_penalty: modelParams.frequency_penalty,
      presence_penalty: modelParams.presence_penalty
    });
    
    // Extract token usage
    const tokenUsage = {
      promptTokens: completion.usage.prompt_tokens,
      completionTokens: completion.usage.completion_tokens,
      totalTokens: completion.usage.total_tokens
    };

    res.status(200).json({
      success: true,
      data: {
        summary: completion.choices[0].message.content,
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
    console.error('Error generating summary:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Vectorize a PDF for more efficient searching
 */
exports.vectorizePdf = async (req, res) => {
  try {
    const { fileId } = req.body;
    
    if (!fileId) {
      return res.status(400).json({ success: false, message: 'File ID is required' });
    }
    
    const metadataPath = path.join(UPLOADS_DIR, fileId + '.json');
    const pdfPath = path.join(UPLOADS_DIR, fileId + '.pdf');
    const vectorStorePath = path.join(UPLOADS_DIR, fileId + '.vectors.json');
    
    // Check if the files exist
    if (!(await fs.pathExists(metadataPath)) || !(await fs.pathExists(pdfPath))) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    // Check if already vectorized
    if (await fs.pathExists(vectorStorePath)) {
      return res.status(200).json({ 
        success: true, 
        message: 'File already vectorized',
        fileId 
      });
    }
    
    // Extract text from PDF
    const pdfText = await extractPdfText(pdfPath);
    
    // Split text into chunks
    const chunks = chunkText(pdfText, 1000, 200);
    
    // Generate embeddings for each chunk
    const embeddings = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      try {
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk,
        });
        
        embeddings.push({
          index: i,
          text: chunk,
          embedding: embeddingResponse.data[0].embedding,
        });
      } catch (error) {
        console.error(`Error generating embedding for chunk ${i}:`, error);
      }
      
      // Add a small delay to avoid rate limiting
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    // Save the vectors
    await fs.writeJson(vectorStorePath, { chunks: embeddings });
    
    // Update metadata
    const metadata = await fs.readJson(metadataPath);
    metadata.vectorized = true;
    metadata.chunkCount = embeddings.length;
    metadata.lastVectorized = new Date().toISOString();
    await fs.writeJson(metadataPath, metadata);
    
    res.status(200).json({ 
      success: true, 
      message: 'File vectorized successfully',
      data: {
        fileId,
        chunkCount: embeddings.length
      }
    });
  } catch (error) {
    console.error('Error vectorizing PDF:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
