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
  
  // Estados para procesamiento por lotes
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [batchSummaries, setBatchSummaries] = useState([]);
  const [selectedBatchSummaries, setSelectedBatchSummaries] = useState([]);
  
  // Estado para artículo de revisión
  const [reviewArticle, setReviewArticle] = useState(null);
  const [reviewArticleLoading, setReviewArticleLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);

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
  
  // Select or deselect all PDFs
  const selectAllPdfs = () => {
    // Si todos los PDFs ya están seleccionados, deseleccionar todos
    if (pdfs.length > 0 && pdfs.length === selectedPdfs.length) {
      setSelectedPdfs([]);
    } else {
      // Seleccionar todos los PDFs
      setSelectedPdfs(pdfs.map(pdf => pdf.id));
    }
  };
  
  // Generar un título legible para un PDF
  const getReadableTitle = (pdf) => {
    if (!pdf) return '';
    
    // Si el nombre del archivo tiene un nombre descriptivo (no solo un UUID), usarlo
    if (pdf.filename && !pdf.filename.match(/^PDF [a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)) {
      // Eliminar la extensión .pdf si existe
      return pdf.filename.replace(/\.pdf$/i, '');
    }
    
    // Si hay título de metadatos, usarlo
    if (pdf.metadata && pdf.metadata.title) {
      return pdf.metadata.title;
    }
    
    // Crear un título más amigable basado en la fecha de subida
    const uploadDate = pdf.createdAt ? new Date(pdf.createdAt) : new Date();
    const formattedDate = uploadDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return `Documento PDF (${formattedDate})`;
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
  const generateSummary = async (query, language = "Español", modelConfig = "gpt-4o-mini", modelParams = { temperature: 0.7, max_tokens: 4096, top_p: 1, frequency_penalty: 0, presence_penalty: 0 }, specificFileIds = null) => {
    // Actualizar el modelo actual para cálculos de coste
    setCurrentModel(modelConfig);
    
    // Usar los IDs de archivo específicos si se proporcionan, de lo contrario usar selectedPdfs
    const fileIdsToUse = specificFileIds || selectedPdfs;
    
    // Incrementar contador de PDFs procesados cuando hay PDFs seleccionados
    if (fileIdsToUse.length > 0) {
      setPdfsProcessed(prev => prev + fileIdsToUse.length);
    }
    try {
      setSummaryLoading(true);
      setError(null);
      
      // Si modelParams es un string (para compatibilidad con versiones anteriores), convertirlo a objeto
      const modelName = typeof modelParams === 'string' 
        ? modelParams 
        : modelParams.model || modelConfig;
      
      // Determinar qué API utilizar
      const isClaudeModel = modelName.includes('claude');
      
      let apiEndpoint = 'openai';
      if (isClaudeModel) {
        apiEndpoint = 'anthropic';
      }
        
      const response = await axios.post(`/api/${apiEndpoint}/summary`, {
        query,
        fileIds: fileIdsToUse.length > 0 ? fileIdsToUse : undefined,
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

    // Procesar PDFs en lote secuencialmente
  const processBatchSummaries = async (language = 'Español', model = 'gpt-4o-mini', modelParams = { temperature: 0.7, max_tokens: 4096, top_p: 1, frequency_penalty: 0, presence_penalty: 0 }) => {
    if (selectedPdfs.length === 0) {
      setError('Por favor, selecciona al menos un PDF para procesar');
      return;
    }

    try {
      setBatchProcessing(true);
      setBatchProgress({ current: 0, total: selectedPdfs.length });
      setBatchSummaries([]);
      setError(null);

      const summaries = [];

      // Procesar cada PDF secuencialmente
      for (let i = 0; i < selectedPdfs.length; i++) {
        const pdfId = selectedPdfs[i];
        setBatchProgress({ current: i + 1, total: selectedPdfs.length });
        
        // Encontrar información del PDF actual
        const currentPdf = pdfs.find(pdf => pdf.id === pdfId);
        
        try {
          // Generar resumen para este PDF específico
          const response = await generateSummary(
            'Genera un resumen estructurado del documento', 
            language, 
            model, 
            modelParams,
            [pdfId] // Enviamos solo el ID del PDF actual
          );
          
          summaries.push({
            id: pdfId,
            filename: currentPdf?.filename || `PDF ${pdfId}`,
            content: response.summary,
            timestamp: new Date().toISOString()
          });
          
          // Actualizar la lista de resúmenes después de cada procesamiento exitoso
          setBatchSummaries(prev => [...prev, {
            id: pdfId,
            filename: currentPdf?.filename || `PDF ${pdfId}`,
            content: response.summary,
            timestamp: new Date().toISOString()
          }]);
          
        } catch (err) {
          // Continuar con el siguiente PDF incluso si hay error
          console.error(`Error procesando PDF ${pdfId}:`, err);
          summaries.push({
            id: pdfId,
            filename: currentPdf?.filename || `PDF ${pdfId}`,
            content: `Error al procesar este PDF: ${err.message}`,
            error: true,
            timestamp: new Date().toISOString()
          });
          
          setBatchSummaries(prev => [...prev, {
            id: pdfId,
            filename: currentPdf?.filename || `PDF ${pdfId}`,
            content: `Error al procesar este PDF: ${err.message}`,
            error: true,
            timestamp: new Date().toISOString()
          }]);
        }
      }

      return summaries;
    } catch (err) {
      setError('Error en el procesamiento por lotes: ' + err.message);
      console.error('Error en procesamiento por lotes:', err);
    } finally {
      setBatchProcessing(false);
    }
  };

  // Generar un artículo de revisión a partir de los resúmenes seleccionados
  const generateReviewArticle = async (language = 'Español', model = 'gpt-4o-mini', modelParams = { temperature: 0.7, max_tokens: 4096, top_p: 1, frequency_penalty: 0, presence_penalty: 0 }, specificInstructions = '') => {
    if (selectedBatchSummaries.length === 0) {
      setError('Por favor, selecciona al menos un resumen para el artículo de revisión');
      return;
    }

    try {
      setReviewArticleLoading(true);
      setError(null);
      
      // Obtener los resúmenes seleccionados
      const selectedSummaries = batchSummaries.filter(summary => 
        selectedBatchSummaries.includes(summary.id)
      );
      
      if (selectedSummaries.length === 0) {
        throw new Error('No se encontraron los resúmenes seleccionados');
      }
      
      // Combinar todos los contenidos de los resúmenes
      const combinedContent = selectedSummaries.map(summary => {
        return `--- DOCUMENTO: ${summary.filename} ---\n\n${summary.content}\n\n`;
      }).join('\n');
      
      // Determinar la API a usar
      const isClaudeModel = model.includes('claude');
      const apiEndpoint = isClaudeModel ? 'anthropic' : 'openai';
      
      // Secciones del artículo de revisión
      const sections = [
        {
          title: "Abstract, título y referencias",
          prompt: "Genera un resumen académico (abstract), título científico adecuado y lista de referencias principales para un artículo de revisión basado en los siguientes documentos científicos. El título debe ser específico y describir con precisión el tema central de revisión. El abstract debe ser conciso (250 palabras máximo) y seguir estructura IMRAD. Las referencias deben estar en formato APA."
        },
        {
          title: "Introducción y antecedentes",
          prompt: "Redacta una introducción completa para un artículo de revisión científica basado en los siguientes documentos. Incluye: 1) Contextualización del tema, 2) Relevancia y justificación, 3) Estado actual del conocimiento, 4) Vacíos o controversias en la literatura, 5) Objetivos claros de la revisión. Usa un estilo académico formal con referencias en formato APA."
        },
        {
          title: "Metodología",
          prompt: "Describe detalladamente la metodología utilizada en esta revisión científica basada en los siguientes documentos. Incluye: 1) Estrategia de búsqueda bibliográfica, 2) Criterios de inclusión/exclusión, 3) Método de análisis y síntesis de la información, 4) Características de los estudios incluidos. Usa formato académico y escribe como si fuera la sección de metodología de un artículo de revisión sistemática."
        },
        {
          title: "Datos y resultados",
          prompt: "Sintetiza y presenta los principales resultados encontrados en estos documentos científicos para un artículo de revisión. Organiza los hallazgos de manera lógica por temas o categorías relevantes. Incluye datos cuantitativos cuando sea posible (estadísticas, tendencias, porcentajes). Presenta los resultados de manera objetiva sin interpretación. Utiliza tablas o estructuras organizadas para resumir hallazgos cuando sea apropiado. Cita apropiadamente en formato APA."
        },
        {
          title: "Discusión y conclusiones",
          prompt: "Desarrolla una discusión científica completa para un artículo de revisión basado en los documentos proporcionados. Incluye: 1) Interpretación crítica de los hallazgos principales, 2) Comparación con el conocimiento previo, 3) Implicaciones teóricas y prácticas, 4) Limitaciones de los estudios revisados, 5) Direcciones futuras de investigación, 6) Conclusiones generales que respondan a los objetivos de la revisión. Mantén un estilo académico riguroso con referencias APA."
        },
        {
          title: "Evaluación global",
          prompt: "Proporciona una evaluación crítica general sobre el conjunto de documentos revisados. Analiza: 1) Calidad metodológica general, 2) Fortalezas y debilidades de la evidencia colectiva, 3) Consistencia o contradicciones entre estudios, 4) Relevancia para la teoría y práctica actual, 5) Recomendaciones fundamentadas para investigadores y profesionales. Finaliza con una valoración integral del estado del conocimiento en este campo específico."
        }
      ];
      
      // Artículo completo
      let fullArticle = '';
      
      // Procesar cada sección secuencialmente
      for (const section of sections) {
        try {
          // Actualizar la sección actual que se está procesando
          setCurrentSection(section.title);
          // Preparar el prompt incluyendo las instrucciones específicas si existen
          let enhancedPrompt = section.prompt;
          if (specificInstructions && specificInstructions.length > 0) {
            enhancedPrompt = `${section.prompt}\n\nCONSIDERACIONES ESPECÍFICAS: ${specificInstructions}`;
          }
          
          const response = await axios.post(`/api/${apiEndpoint}/review-article-section`, {
            content: combinedContent,
            section: section.title,
            prompt: enhancedPrompt,
            language,
            model,
            ...(typeof modelParams !== 'string' && {
              temperature: modelParams.temperature,
              max_tokens: modelParams.max_tokens,
              top_p: modelParams.top_p,
              frequency_penalty: modelParams.frequency_penalty,
              presence_penalty: modelParams.presence_penalty
            })
          });
          
          // Agregar la sección al artículo completo
          fullArticle += `## ${section.title}\n\n${response.data.data.content}\n\n`;
          
          // Actualizar contador de tokens
          if (response.data.data.tokenUsage) {
            const { promptTokens, completionTokens } = response.data.data.tokenUsage;
            const newInputTokens = Number(promptTokens) || 0;
            const newOutputTokens = Number(completionTokens) || 0;
            
            setInputTokens(prev => prev + newInputTokens);
            setOutputTokens(prev => prev + newOutputTokens);
            
            const cost = calculateCost(model, newInputTokens, newOutputTokens);
            setTotalCostUSD(prev => prev + cost);
          }
        } catch (err) {
          console.error(`Error generando sección "${section.title}":`, err);
          fullArticle += `## ${section.title}\n\nError al generar esta sección: ${err.message}\n\n`;
        }
      }
      
      // Guardar el artículo de revisión completo
      setReviewArticle({
        content: fullArticle,
        timestamp: new Date().toISOString(),
        basedOn: selectedSummaries.map(s => s.filename),
        currentSection: null
      });
      setCurrentSection(null);
      
      return fullArticle;
    } catch (err) {
      setError('Error generando artículo de revisión: ' + err.message);
      console.error('Error generando artículo de revisión:', err);
    } finally {
      setReviewArticleLoading(false);
    }
  };
  
  // Limpiar el artículo de revisión
  const clearReviewArticle = () => {
    setReviewArticle(null);
  };
  
  // Alternar la selección de un resumen para el artículo de revisión
  const toggleBatchSummarySelection = (summaryId) => {
    setSelectedBatchSummaries(prev => {
      if (prev.includes(summaryId)) {
        return prev.filter(id => id !== summaryId);
      } else {
        return [...prev, summaryId];
      }
    });
  };
  
  // Limpiar los resúmenes por lotes
  const clearBatchSummaries = () => {
    setBatchSummaries([]);
    setSelectedBatchSummaries([]);
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
      // Estados y funciones de procesamiento por lotes
      batchProcessing,
      batchProgress,
      batchSummaries,
      selectedBatchSummaries,
      reviewArticle,
      reviewArticleLoading,
      // Funciones existentes
      fetchPdfs,
      uploadPdf,
      deletePdf,
      togglePdfSelection,
      selectAllPdfs,
      setSearchQuery,
      processQuery,
      generateSummary,
      vectorizePdf,
      clearSearchResults,
      clearSummary,
      setError,
      getReadableTitle,
      // Nuevas funciones
      processBatchSummaries,
      toggleBatchSummarySelection,
      clearBatchSummaries,
      generateReviewArticle,
      clearReviewArticle,
      currentSection
    }}>
      {children}
    </PdfContext.Provider>
  );
};
