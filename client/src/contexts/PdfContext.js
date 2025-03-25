import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const PdfContext = createContext();

export const usePdf = () => useContext(PdfContext);

export const PdfContextProvider = ({ children }) => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPdfs, setSelectedPdfs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const [inputTokens, setInputTokens] = useState(0); // Contador de tokens de entrada
  const [outputTokens, setOutputTokens] = useState(0); // Contador de tokens de salida
  const [totalCostUSD, setTotalCostUSD] = useState(0); // Costo total en USD
  const [currentModel, setCurrentModel] = useState('gpt-4o-mini'); // Modelo actual por defecto
  const [pdfsProcessed, setPdfsProcessed] = useState(0); // Contador de PDFs procesados

  // Load PDFs when component mounts
  useEffect(() => {
    fetchPdfs();
  }, []);

  // Fetch all PDFs from the server
  const fetchPdfs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/pdf/list');
      setPdfs(response.data.data || []);
    } catch (err) {
      setError('Error loading PDFs: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching PDFs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Upload a PDF
  const uploadPdf = async (file) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('/api/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Add the new PDF to the list
      setPdfs(prev => [...prev, response.data.data]);
      return response.data.data;
    } catch (err) {
      setError('Error uploading PDF: ' + (err.response?.data?.message || err.message));
      console.error('Error uploading PDF:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a PDF
  const deletePdf = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/api/pdf/delete/${id}`);
      
      // Remove the PDF from the list
      setPdfs(prev => prev.filter(pdf => pdf.id !== id));
      
      // Remove from selected PDFs if it was selected
      setSelectedPdfs(prev => prev.filter(pdfId => pdfId !== id));
    } catch (err) {
      setError('Error deleting PDF: ' + (err.response?.data?.message || err.message));
      console.error('Error deleting PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle PDF selection
  const togglePdfSelection = (id) => {
    setSelectedPdfs(prev => {
      if (prev.includes(id)) {
        return prev.filter(pdfId => pdfId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Process a query using OpenAI
  // Función para calcular el costo basado en los tokens usados y el modelo
  const calculateCost = (model, inputTokens, outputTokens) => {
    // Precios en USD por millón de tokens
    const prices = {
      'gpt-4o': {
        input: 2.50 / 1000000,      // $2.50 por millón de tokens de entrada
        cachedInput: 1.25 / 1000000, // $1.25 por millón de tokens de entrada en caché
        output: 10.00 / 1000000     // $10.00 por millón de tokens de salida
      },
      'gpt-4o-mini': {
        input: 0.15 / 1000000,      // $0.15 por millón de tokens de entrada
        cachedInput: 0.075 / 1000000, // $0.075 por millón de tokens de entrada en caché
        output: 0.60 / 1000000      // $0.60 por millón de tokens de salida
      },
      'claude-3-7-sonnet-20250219': {
        input: 3.00 / 1000000,        // $3.00 por millón de tokens de entrada
        cachedInputWrite: 3.75 / 1000000, // $3.75 por millón de tokens de entrada en caché (escritura)
        cachedInputRead: 0.30 / 1000000,  // $0.30 por millón de tokens de entrada en caché (lectura)
        cachedInput: 0.30 / 1000000,   // $0.30 por millón de tokens en caché (usamos el precio de lectura por defecto)
        output: 15.00 / 1000000       // $15.00 por millón de tokens de salida
      },

    };

    // Usar el modelo por defecto si el proporcionado no está en la lista
    const modelPrices = prices[model] || prices['gpt-4o-mini'];
    
    // Para el cálculo, usamos el precio estándar de entrada (no caché)
    // En una implementación más avanzada, se podría determinar si fue caché de lectura o escritura
    const inputCost = inputTokens * modelPrices.input;
    const outputCost = outputTokens * modelPrices.output;
    
    return inputCost + outputCost;
  };

  const processQuery = async (query, model = 'gpt-4o-mini', selectedPdfIds = [], maxTokens = 4000, temperature = 0.7, apiEndpoint = 'openai') => {
    // Incrementar contador de PDFs procesados cuando hay PDFs seleccionados
    const pdfIdsToUse = selectedPdfIds.length > 0 ? selectedPdfIds : selectedPdfs;
    if (pdfIdsToUse.length > 0) {
      setPdfsProcessed(prev => prev + pdfIdsToUse.length);
    }
    
    // Actualizar el modelo actual para cálculos de coste
    setCurrentModel(model);
    
    // Determinar el endpoint correcto basado en el modelo
    const isClaudeModel = model.includes('claude');

    
    let actualEndpoint = 'openai';
    if (isClaudeModel) {
      actualEndpoint = 'anthropic';
    }
    
    console.log(`Procesando consulta con modelo: ${model} a través del endpoint: /api/${actualEndpoint}/query`);
    
    try {
      setQueryLoading(true);
      setError(null);
      
      const payload = {
        query,
        fileIds: pdfIdsToUse.length > 0 ? pdfIdsToUse : undefined,
        model: model,
        max_tokens: maxTokens,
        temperature: temperature
      };
      
      console.log('Enviando payload:', payload);
      
      const response = await axios.post(`/api/${actualEndpoint}/query`, payload);
      
      const responseData = response.data.data;
      // Actualizar contador de tokens si la respuesta incluye información de uso
      if (responseData.tokenUsage) {
        const { promptTokens, completionTokens, totalTokens } = responseData.tokenUsage;
        
        // Convertir a números y asegurar que no son NaN
        const newInputTokens = Number(promptTokens) || 0;
        const newOutputTokens = Number(completionTokens) || 0;
        
        // Actualizar los tokens de entrada y salida
        setInputTokens(prev => prev + newInputTokens);
        setOutputTokens(prev => prev + newOutputTokens);
        
        // Calcular costo basado en el modelo actual
        const cost = calculateCost(currentModel, newInputTokens, newOutputTokens);
        setTotalCostUSD(prev => prev + cost);
        
        console.log(`Tokens: ${newInputTokens} entrada, ${newOutputTokens} salida, ${totalTokens} total. Coste: $${cost.toFixed(6)}`);
      }
      
      setSearchResults(responseData);
      return responseData;
    } catch (err) {
      console.error('Error procesando consulta:', err.response || err);
      
      // Mensaje de error más informativo
      let errorMessage = 'Error al procesar la consulta';
      
      if (err.response) {
        // El servidor respondió con un código de estado que cae fuera del rango de 2xx
        errorMessage += `: ${err.response.status} ${err.response.statusText}`;
        if (err.response.data && err.response.data.message) {
          errorMessage += ` - ${err.response.data.message}`;
        }
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        errorMessage += ': No se recibió respuesta del servidor';
      } else {
        // Algo ocurrió al configurar la petición
        errorMessage += `: ${err.message}`;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setQueryLoading(false);
    }
  };

  // Generate a summary using OpenAI
  const generateSummary = async (query, language = "Español", modelConfig = "gpt-4o-mini", modelParams = { temperature: 0.7, max_tokens: 4096, top_p: 1, frequency_penalty: 0, presence_penalty: 0 }) => {
    // Actualizar el modelo actual para cálculos de coste
    setCurrentModel(modelConfig);
    
    // Incrementar contador de PDFs procesados cuando hay PDFs seleccionados
    if (selectedPdfs.length > 0) {
      setPdfsProcessed(prev => prev + selectedPdfs.length);
    }
    try {
      setSummaryLoading(true);
      setError(null);
      
      // Si modelParams es un string (para compatibilidad con versiones anteriores), convertirlo a objeto
      const modelName = typeof modelParams === 'string' 
        ? modelParams 
        : modelParams.model;
      
      // Determinar qué API utilizar
      const isClaudeModel = modelName.includes('claude');
  
      
      let apiEndpoint = 'openai';
      if (isClaudeModel) {
        apiEndpoint = 'anthropic';
      }
        
      const response = await axios.post(`/api/${apiEndpoint}/summary`, {
        query,
        fileIds: selectedPdfs.length > 0 ? selectedPdfs : undefined,
        language,
        model: modelName,
        // Añadir los parámetros avanzados separados del nombre del modelo
        ...(typeof modelParams !== 'string' && {
          temperature: modelParams.temperature,
          max_tokens: modelParams.max_tokens,
          top_p: modelParams.top_p,
          frequency_penalty: modelParams.frequency_penalty,
          presence_penalty: modelParams.presence_penalty
        })
      });
      
      const responseData = response.data.data;
      // Actualizar contador de tokens si la respuesta incluye información de uso
      if (responseData.tokenUsage) {
        const { promptTokens, completionTokens, totalTokens } = responseData.tokenUsage;
        
        // Convertir a números y asegurar que no son NaN
        const newInputTokens = Number(promptTokens) || 0;
        const newOutputTokens = Number(completionTokens) || 0;
        
        // Actualizar los tokens de entrada y salida
        setInputTokens(prev => prev + newInputTokens);
        setOutputTokens(prev => prev + newOutputTokens);
        
        // Calcular costo basado en el modelo actual
        const cost = calculateCost(currentModel, newInputTokens, newOutputTokens);
        setTotalCostUSD(prev => prev + cost);
        
        console.log(`Tokens: ${newInputTokens} entrada, ${newOutputTokens} salida, ${totalTokens} total. Coste: $${cost.toFixed(6)}`);
      }
      
      setSummary(responseData);
      return responseData;
    } catch (err) {
      setError('Error generating summary: ' + (err.response?.data?.message || err.message));
      console.error('Error generating summary:', err);
      throw err;
    } finally {
      setSummaryLoading(false);
    }
  };

  // Vectorize a PDF for better search
  const vectorizePdf = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/openai/vectorize', {
        fileId: id
      });
      
      // Update the PDF in the list
      setPdfs(prev => prev.map(pdf => 
        pdf.id === id ? { ...pdf, vectorized: true } : pdf
      ));
      
      return response.data.data;
    } catch (err) {
      setError('Error vectorizing PDF: ' + (err.response?.data?.message || err.message));
      console.error('Error vectorizing PDF:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear search results
  const clearSearchResults = () => {
    setSearchResults(null);
  };

  // Clear summary
  const clearSummary = () => {
    setSummary(null);
  };

  return (
    <PdfContext.Provider value={{
      pdfs,
      loading,
      error,
      selectedPdfs,
      searchQuery,
      searchResults,
      summary,
      summaryLoading,
      queryLoading,
      totalTokensUsed: inputTokens + outputTokens, // Calculado dinámicamente
      inputTokens,
      outputTokens,
      totalCostUSD,
      currentModel,
      pdfsProcessed,
      fetchPdfs,
      uploadPdf,
      deletePdf,
      togglePdfSelection,
      setSearchQuery,
      processQuery,
      generateSummary,
      vectorizePdf,
      clearSearchResults,
      clearSummary,
      setError
    }}>
      {children}
    </PdfContext.Provider>
  );
};
