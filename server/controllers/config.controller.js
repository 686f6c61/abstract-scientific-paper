const fs = require('fs-extra');
const path = require('path');
const { OpenAI } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

// Ruta al archivo .env
const envFilePath = path.resolve(__dirname, '../../.env');

/**
 * Verificar el estado de configuración de las API keys
 */
exports.getApiKeysStatus = async (req, res) => {
  try {
    // Leer las variables de entorno actuales
    const openaiConfigured = !!process.env.OPENAI_API_KEY;
    const anthropicConfigured = !!process.env.ANTHROPIC_API_KEY;

    res.json({
      openaiConfigured,
      anthropicConfigured
    });
  } catch (error) {
    console.error('Error al obtener el estado de las API keys:', error);
    res.status(500).json({ error: 'Error al obtener el estado de las API keys' });
  }
};

/**
 * Validar API key de OpenAI
 */
exports.validateOpenaiKey = async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ valid: false, message: 'API key no proporcionada' });
    }

    // Intentar crear una instancia de OpenAI con la clave proporcionada
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Hacer una solicitud simple para verificar la clave
    const response = await openai.models.list();
    
    // Si llegamos aquí, la clave es válida
    res.json({ valid: true });
  } catch (error) {
    console.error('Error al validar la API key de OpenAI:', error);
    res.json({ valid: false, message: error.message });
  }
};

/**
 * Validar API key de Anthropic
 */
exports.validateAnthropicKey = async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ valid: false, message: 'API key no proporcionada' });
    }

    // Intentar crear una instancia de Anthropic con la clave proporcionada
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Hacer una solicitud simple para verificar la clave
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 10,
      messages: [
        { role: "user", content: "Hello" }
      ]
    });
    
    // Si llegamos aquí, la clave es válida
    res.json({ valid: true });
  } catch (error) {
    console.error('Error al validar la API key de Anthropic:', error);
    res.json({ valid: false, message: error.message });
  }
};

/**
 * Guardar API keys en el archivo .env
 */
exports.saveApiKeys = async (req, res) => {
  try {
    const { openaiKey, anthropicKey } = req.body;
    
    // Leer el contenido actual del archivo .env
    let envContent = '';
    if (fs.existsSync(envFilePath)) {
      envContent = await fs.readFile(envFilePath, 'utf8');
    }
    
    // Convertir el contenido en un objeto para facilitar la manipulación
    const envVars = {};
    
    // Procesar las líneas existentes
    if (envContent) {
      const lines = envContent.split('\n');
      for (const line of lines) {
        if (line.trim() && !line.startsWith('#')) {
          const [key, value] = line.split('=');
          if (key && value) {
            envVars[key.trim()] = value.trim();
          }
        }
      }
    }
    
    // Actualizar las API keys
    if (openaiKey) {
      envVars['OPENAI_API_KEY'] = openaiKey;
    }
    
    if (anthropicKey) {
      envVars['ANTHROPIC_API_KEY'] = anthropicKey;
    }
    
    // Convertir el objeto de nuevo a formato de texto .env
    let newEnvContent = '';
    for (const [key, value] of Object.entries(envVars)) {
      newEnvContent += `${key}=${value}\n`;
    }
    
    // Guardar el nuevo contenido en el archivo .env
    await fs.writeFile(envFilePath, newEnvContent);
    
    // Recargar las variables de entorno
    const myEnv = dotenv.config({ path: envFilePath });
    dotenvExpand.expand(myEnv);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error al guardar las API keys:', error);
    res.status(500).json({ error: 'Error al guardar las API keys' });
  }
};
