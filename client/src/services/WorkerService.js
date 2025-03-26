// Servicio para gestionar los Web Workers y su comunicación

import { v4 as uuidv4 } from 'uuid';
import * as dbService from '../utils/db';

// Tipos de procesos disponibles
export const PROCESS_TYPES = {
  ARTICLE_INTELLIGENCE: 'article_intelligence',
  STRUCTURED_SUMMARY: 'structured_summary',
  REVIEW_ARTICLE: 'review_article',
  BATCH_SUMMARY: 'batch_summary'
};

// Mapa para almacenar las referencias a los workers activos
const activeWorkers = new Map();

/**
 * Crear un nuevo proceso con Worker
 * @param {string} processType - Tipo de proceso a ejecutar
 * @param {string} action - Acción a realizar por el worker
 * @param {Object} payload - Datos para el proceso
 * @param {Object} callbacks - Funciones de callback para eventos del worker
 * @returns {string} ID del proceso creado
 */
export const createProcess = async (processType, action, payload, callbacks = {}) => {
  try {
    // Generar un ID único para el proceso
    const processId = uuidv4();
    
    // Guardar información del proceso en IndexedDB
    const processData = {
      id: processId,
      type: processType,
      status: 'pending',
      action,
      payload,
      timestamp: Date.now(),
      lastUpdated: Date.now()
    };
    
    await dbService.saveProcess(processData);
    
    // Crear un nuevo worker
    const worker = new Worker(new URL('../workers/api.worker.js', import.meta.url));
    
    // Guardar referencia al worker
    activeWorkers.set(processId, worker);
    
    // Configurar el manejador de mensajes para este worker
    worker.onmessage = async (event) => {
      const { type, processId: receivedProcessId, status, result, error, message } = event.data;
      
      if (receivedProcessId !== processId) return;
      
      // Actualizar el estado del proceso en IndexedDB
      await dbService.updateProcess(processId, { 
        status, 
        lastUpdated: Date.now(),
        ...(message && { message }),
        ...(error && { error }),
        ...(result && { result })
      });
      
      // Ejecutar callbacks según el tipo de mensaje
      switch (type) {
        case 'STATUS_UPDATE':
          if (callbacks.onStatusUpdate) callbacks.onStatusUpdate(status, message);
          break;
          
        case 'RESULT':
          if (callbacks.onComplete) callbacks.onComplete(result);
          terminateWorker(processId);
          break;
          
        case 'ERROR':
          if (callbacks.onError) callbacks.onError(error);
          terminateWorker(processId);
          break;
          
        default:
          console.warn(`Tipo de mensaje desconocido: ${type}`);
      }
    };
    
    // Manejar errores del worker
    worker.onerror = async (error) => {
      await dbService.updateProcess(processId, { 
        status: 'error', 
        error: error.message,
        lastUpdated: Date.now()
      });
      
      if (callbacks.onError) callbacks.onError(error.message);
      terminateWorker(processId);
    };
    
    // Iniciar el proceso enviando la acción al worker
    worker.postMessage({ action, payload, processId });
    
    // Actualizar el estado a 'running'
    await dbService.updateProcess(processId, { status: 'running' });
    
    return processId;
  } catch (error) {
    console.error('Error al crear proceso con worker:', error);
    if (callbacks.onError) callbacks.onError(error.message);
    throw error;
  }
};

/**
 * Terminar un worker específico
 * @param {string} processId - ID del proceso a terminar
 */
export const terminateWorker = async (processId) => {
  const worker = activeWorkers.get(processId);
  
  if (worker) {
    worker.postMessage({ action: 'TERMINATE' });
    worker.terminate();
    activeWorkers.delete(processId);
    
    // Actualizar el estado en la base de datos
    try {
      const process = await dbService.getById(dbService.DB.STORES.PROCESSES, processId);
      if (process && (process.status === 'running' || process.status === 'pending')) {
        await dbService.updateProcess(processId, { status: 'terminated' });
      }
    } catch (error) {
      console.error(`Error al actualizar estado del proceso ${processId}:`, error);
    }
  }
};

/**
 * Terminar todos los workers activos
 */
export const terminateAllWorkers = async () => {
  for (const processId of activeWorkers.keys()) {
    await terminateWorker(processId);
  }
};

/**
 * Recuperar procesos activos al cargar la aplicación
 * @param {Function} setupCallback - Función para configurar cada proceso recuperado
 */
export const recoverActiveProcesses = async (setupCallback) => {
  try {
    const activeProcesses = await dbService.getActiveProcesses();
    
    if (activeProcesses.length === 0) {
      return [];
    }
    
    // Para cada proceso activo, configurar un nuevo worker
    for (const process of activeProcesses) {
      // Si hay una función de callback, usarla para configurar el proceso
      if (setupCallback) {
        await setupCallback(process);
      }
    }
    
    return activeProcesses;
  } catch (error) {
    console.error('Error al recuperar procesos activos:', error);
    return [];
  }
};

/**
 * Obtener el estado actual de un proceso
 * @param {string} processId - ID del proceso
 * @returns {Promise<Object>} Estado del proceso
 */
export const getProcessStatus = async (processId) => {
  return await dbService.getById(dbService.DB.STORES.PROCESSES, processId);
};

// Crear funciones específicas para cada tipo de proceso
export const createArticleIntelligenceProcess = (query, model, selectedPdfIds, maxTokens, temperature, callbacks) => {
  const payload = {
    query,
    fileIds: selectedPdfIds,
    model,
    max_tokens: maxTokens,
    temperature
  };
  
  return createProcess(
    PROCESS_TYPES.ARTICLE_INTELLIGENCE,
    'PROCESS_QUERY',
    payload,
    callbacks
  );
};

export const createStructuredSummaryProcess = (query, language, model, modelParams, fileIds, callbacks) => {
  const payload = {
    query,
    fileIds,
    language,
    model,
    ...modelParams
  };
  
  return createProcess(
    PROCESS_TYPES.STRUCTURED_SUMMARY,
    'GENERATE_SUMMARY',
    payload,
    callbacks
  );
};

export const createReviewArticleProcess = (summaryIds, specificInstructions, language, model, modelParams, callbacks) => {
  const payload = {
    summaryIds,
    specificInstructions,
    language,
    model,
    ...modelParams
  };
  
  return createProcess(
    PROCESS_TYPES.REVIEW_ARTICLE,
    'GENERATE_REVIEW_ARTICLE',
    payload,
    callbacks
  );
};

export const createBatchSummaryProcess = (fileIds, language, model, modelParams, callbacks) => {
  const payload = {
    fileIds,
    language,
    model,
    ...modelParams
  };
  
  return createProcess(
    PROCESS_TYPES.BATCH_SUMMARY,
    'PROCESS_BATCH_SUMMARIES',
    payload,
    callbacks
  );
};
