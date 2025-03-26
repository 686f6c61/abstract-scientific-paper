import React, { createContext, useState, useContext, useEffect } from 'react';
import * as WorkerService from '../services/WorkerService';
import * as dbService from '../utils/db';

// Crear contexto para los procesos en segundo plano
const ProcessContext = createContext();

export const useProcess = () => useContext(ProcessContext);

export const ProcessProvider = ({ children }) => {
  // Estados para monitorear procesos
  const [activeProcesses, setActiveProcesses] = useState([]);
  const [processNotifications, setProcessNotifications] = useState([]);
  const [processCounts, setProcessCounts] = useState({
    article_intelligence: 0,
    structured_summary: 0,
    review_article: 0,
    batch_summary: 0
  });
  const [isRecovering, setIsRecovering] = useState(true);

  // Efecto de inicialización - recupera procesos existentes
  useEffect(() => {
    const init = async () => {
      setIsRecovering(true);
      try {
        // Recuperar procesos activos de IndexedDB
        const savedProcesses = await WorkerService.recoverActiveProcesses(setupRecoveredProcess);
        setActiveProcesses(savedProcesses);
        
        // Actualizar contadores de procesos
        updateProcessCounts(savedProcesses);
        
        // Crear notificaciones para procesos recuperados
        if (savedProcesses.length > 0) {
          const notifications = savedProcesses.map(process => ({
            id: process.id,
            type: 'info',
            message: `Proceso recuperado: ${getProcessTypeName(process.type)}`,
            timestamp: Date.now()
          }));
          
          setProcessNotifications(notifications);
        }
      } catch (error) {
        console.error('Error al inicializar ProcessContext:', error);
      } finally {
        setIsRecovering(false);
      }
    };
    
    init();
    
    // Limpiar al desmontar - terminar todos los workers
    return () => {
      WorkerService.terminateAllWorkers();
    };
  }, []);

  // Función para configurar un proceso recuperado
  const setupRecoveredProcess = async (process) => {
    // Solo configuramos procesos en ejecución
    if (process.status !== 'running' && process.status !== 'pending') {
      return;
    }
    
    // Configurar callbacks específicos según el tipo de proceso
    const callbacks = {
      onStatusUpdate: (status, message) => {
        updateProcessStatus(process.id, status, message);
      },
      onComplete: (result) => {
        handleProcessCompletion(process.id, process.type, result);
      },
      onError: (error) => {
        handleProcessError(process.id, error);
      }
    };
    
    // Reiniciar el proceso con el worker
    try {
      await WorkerService.createProcess(
        process.type,
        process.action,
        process.payload,
        callbacks
      );
    } catch (error) {
      console.error(`Error al reanudar proceso ${process.id}:`, error);
    }
  };

  // Actualizar contadores de procesos
  const updateProcessCounts = (processes) => {
    const counts = {
      article_intelligence: 0,
      structured_summary: 0,
      review_article: 0,
      batch_summary: 0
    };
    
    for (const process of processes) {
      if (process.status === 'running' || process.status === 'pending') {
        counts[process.type] = (counts[process.type] || 0) + 1;
      }
    }
    
    setProcessCounts(counts);
  };

  // Obtener nombre legible del tipo de proceso
  const getProcessTypeName = (processType) => {
    const typeNames = {
      article_intelligence: 'Inteligencia sobre artículo',
      structured_summary: 'Resumen estructurado',
      review_article: 'Artículo de revisión científica',
      batch_summary: 'Procesamiento por lotes'
    };
    
    return typeNames[processType] || processType;
  };

  // Actualizar el estado de un proceso
  const updateProcessStatus = async (processId, status, message) => {
    try {
      // Actualizar en IndexedDB
      await dbService.updateProcess(processId, { status, message });
      
      // Actualizar estado local
      setActiveProcesses(prev => {
        const updated = prev.map(p => 
          p.id === processId ? { ...p, status, message, lastUpdated: Date.now() } : p
        );
        updateProcessCounts(updated);
        return updated;
      });
    } catch (error) {
      console.error(`Error al actualizar estado del proceso ${processId}:`, error);
    }
  };

  // Manejar la finalización exitosa de un proceso
  const handleProcessCompletion = async (processId, processType, result) => {
    try {
      // Actualizar en IndexedDB
      await dbService.updateProcess(processId, { 
        status: 'completed', 
        result, 
        completedAt: Date.now() 
      });
      
      // Actualizar procesos activos - eliminar el completado
      setActiveProcesses(prev => {
        const updated = prev.filter(p => p.id !== processId);
        updateProcessCounts(updated);
        return updated;
      });
      
      // Crear notificación de finalización
      addNotification({
        id: `${processId}-complete`,
        type: 'success',
        message: `Proceso completado: ${getProcessTypeName(processType)}`,
        processId
      });
      
      // Guardar el resultado en la tienda correspondiente según el tipo
      await saveProcessResult(processId, processType, result);
      
      // Actualizar automáticamente la interfaz de usuario con el resultado
      // Esto permite que los resultados se muestren inmediatamente cuando el proceso termina
      if (window.setPdfContext) {
        // Verificar si el resultado tiene la estructura completa esperada
        if (!result || typeof result !== 'object') {
          console.warn('Resultado en formato incorrecto:', result);
          return; // No actualizar con datos incorrectos
        }

        if (processType === WorkerService.PROCESS_TYPES.STRUCTURED_SUMMARY) {
          console.log('Actualizando automáticamente el resumen estructurado');

          // Obtenemos la estructura completa del resultado
          console.log('Resultado original:', JSON.stringify(result).substring(0, 200) + '...');
          
          // En la API de OpenAI, el contenido del resumen está en result.data.summary
          // Verificamos todas las posibles ubicaciones del contenido
          let actualSummaryContent = '';
          if (result.data && typeof result.data.summary === 'string') {
            actualSummaryContent = result.data.summary;
          } else if (typeof result.summary === 'string') {
            actualSummaryContent = result.summary;
          } else if (result.data && result.data.content) {
            actualSummaryContent = result.data.content;
          } else if (result.content) {
            actualSummaryContent = result.content;
          } else if (result.data && result.data.data && result.data.data.summary) {
            actualSummaryContent = result.data.data.summary;
          } else {
            // Si no podemos encontrar el contenido de texto del resumen en un lugar esperado,
            // registramos un error pero enviamos lo que tengamos para ayudar con la depuración
            console.error('No se pudo encontrar el contenido del resumen en:', result);
            actualSummaryContent = 'Error al cargar el resumen. Consulte la consola para más detalles.';
          }
          
          // Convertir al formato esperado por ResultsDisplay
          const formattedResult = {
            summary: actualSummaryContent,  // Ahora usamos el contenido extraído
            sources: result.data?.sources || result.sources || [],
            tokenUsage: result.data?.tokenUsage || result.tokenUsage || {
              promptTokens: 0,
              completionTokens: 0,
              totalTokens: 0
            },
            model: result.data?.model || result.model || ''
          };
          
          console.log('Formato final del resumen:', 
            `{summary: string de longitud ${formattedResult.summary.length}, sources: Array(${formattedResult.sources?.length || 0})}`);
          
          window.setPdfContext(prev => ({
            ...prev,
            summary: formattedResult
          }));
        } else if (processType === WorkerService.PROCESS_TYPES.ARTICLE_INTELLIGENCE) {
          console.log('Actualizando automáticamente los resultados de búsqueda');
          window.setPdfContext(prev => ({
            ...prev,
            searchResults: result
          }));
        } else if (processType === WorkerService.PROCESS_TYPES.REVIEW_ARTICLE) {
          console.log('Actualizando automáticamente el artículo de revisión');
          window.setPdfContext(prev => ({
            ...prev,
            reviewArticle: result
          }));
        }
      }
    } catch (error) {
      console.error(`Error al completar proceso ${processId}:`, error);
    }
  };

  // Manejar errores en el proceso
  const handleProcessError = async (processId, error) => {
    try {
      // Actualizar en IndexedDB
      await dbService.updateProcess(processId, { 
        status: 'error', 
        error, 
        completedAt: Date.now() 
      });
      
      // Actualizar procesos activos
      setActiveProcesses(prev => {
        const processInfo = prev.find(p => p.id === processId);
        const processType = processInfo ? processInfo.type : 'unknown';
        
        const updated = prev.filter(p => p.id !== processId);
        updateProcessCounts(updated);
        
        // Crear notificación de error
        addNotification({
          id: `${processId}-error`,
          type: 'error',
          message: `Error en ${getProcessTypeName(processType)}: ${error}`,
          processId
        });
        
        return updated;
      });
    } catch (err) {
      console.error(`Error al manejar error del proceso ${processId}:`, err);
    }
  };

  // Guardar resultado en la tienda correspondiente
  const saveProcessResult = async (processId, processType, result) => {
    try {
      let storeName;
      
      switch (processType) {
        case WorkerService.PROCESS_TYPES.ARTICLE_INTELLIGENCE:
          storeName = dbService.DB.STORES.ARTICLE_INTELLIGENCE;
          break;
        case WorkerService.PROCESS_TYPES.STRUCTURED_SUMMARY:
          storeName = dbService.DB.STORES.STRUCTURED_SUMMARY;
          break;
        case WorkerService.PROCESS_TYPES.REVIEW_ARTICLE:
          storeName = dbService.DB.STORES.REVIEW_ARTICLE;
          break;
        case WorkerService.PROCESS_TYPES.BATCH_SUMMARY:
          // Para batch, guardamos cada resumen individualmente
          if (result && Array.isArray(result.summaries)) {
            const savePromises = result.summaries.map(summary => 
              dbService.saveToStore(dbService.DB.STORES.STRUCTURED_SUMMARY, {
                ...summary,
                id: summary.id || `batch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                fromBatch: true,
                batchId: processId
              })
            );
            await Promise.all(savePromises);
          }
          return;
        default:
          console.warn(`Tipo de proceso desconocido: ${processType}`);
          return;
      }
      
      // Guardar en la tienda correspondiente
      await dbService.saveToStore(storeName, {
        ...result,
        id: processId,
        processId,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error(`Error al guardar resultado del proceso ${processId}:`, error);
    }
  };

  // Añadir notificación
  const addNotification = (notification) => {
    setProcessNotifications(prev => [
      ...prev,
      {
        ...notification,
        timestamp: Date.now()
      }
    ]);
    
    // Eliminar notificación después de 10 segundos
    setTimeout(() => {
      setProcessNotifications(prev => 
        prev.filter(n => n.id !== notification.id)
      );
    }, 10000);
  };

  // Iniciar un nuevo proceso de inteligencia sobre artículo
  const startArticleIntelligenceProcess = async (query, model, selectedPdfIds, maxTokens, temperature) => {
    try {
      const processId = await WorkerService.createArticleIntelligenceProcess(
        query, 
        model, 
        selectedPdfIds, 
        maxTokens, 
        temperature,
        {
          onStatusUpdate: (status, message) => {
            updateProcessStatus(processId, status, message);
          },
          onComplete: (result) => {
            handleProcessCompletion(processId, WorkerService.PROCESS_TYPES.ARTICLE_INTELLIGENCE, result);
          },
          onError: (error) => {
            handleProcessError(processId, error);
          }
        }
      );
      
      // Obtener información del proceso
      const processInfo = await dbService.getById(dbService.DB.STORES.PROCESSES, processId);
      
      // Actualizar lista de procesos activos
      setActiveProcesses(prev => {
        const updated = [...prev, processInfo];
        updateProcessCounts(updated);
        return updated;
      });
      
      // Crear notificación
      addNotification({
        id: `${processId}-start`,
        type: 'info',
        message: 'Iniciando proceso: Inteligencia sobre artículo',
        processId
      });
      
      return processId;
    } catch (error) {
      console.error('Error al iniciar proceso de inteligencia sobre artículo:', error);
      throw error;
    }
  };

  // Iniciar un nuevo proceso de resumen estructurado
  const startStructuredSummaryProcess = async (query, language, model, modelParams, fileIds) => {
    try {
      const processId = await WorkerService.createStructuredSummaryProcess(
        query,
        language,
        model,
        modelParams,
        fileIds,
        {
          onStatusUpdate: (status, message) => {
            updateProcessStatus(processId, status, message);
          },
          onComplete: (result) => {
            handleProcessCompletion(processId, WorkerService.PROCESS_TYPES.STRUCTURED_SUMMARY, result);
          },
          onError: (error) => {
            handleProcessError(processId, error);
          }
        }
      );
      
      // Obtener información del proceso
      const processInfo = await dbService.getById(dbService.DB.STORES.PROCESSES, processId);
      
      // Actualizar lista de procesos activos
      setActiveProcesses(prev => {
        const updated = [...prev, processInfo];
        updateProcessCounts(updated);
        return updated;
      });
      
      // Crear notificación
      addNotification({
        id: `${processId}-start`,
        type: 'info',
        message: 'Iniciando proceso: Resumen estructurado',
        processId
      });
      
      return processId;
    } catch (error) {
      console.error('Error al iniciar proceso de resumen estructurado:', error);
      throw error;
    }
  };

  // Iniciar proceso de artículo de revisión científica
  const startReviewArticleProcess = async (summaryIds, specificInstructions, language, model, modelParams, externalCallbacks = {}) => {
    try {
      const processId = await WorkerService.createReviewArticleProcess(
        summaryIds,
        specificInstructions,
        language,
        model,
        modelParams,
        {
          onStatusUpdate: (status, message) => {
            updateProcessStatus(processId, status, message);
          },
          onComplete: (result) => {
            handleProcessCompletion(processId, WorkerService.PROCESS_TYPES.REVIEW_ARTICLE, result);
            // Llamar al callback externo si existe
            if (externalCallbacks && typeof externalCallbacks.onComplete === 'function') {
              externalCallbacks.onComplete(result);
            }
          },
          onError: (error) => {
            handleProcessError(processId, error);
            // Llamar al callback externo si existe
            if (externalCallbacks && typeof externalCallbacks.onError === 'function') {
              externalCallbacks.onError(error);
            }
          }
        }
      );
      
      // Obtener información del proceso
      const processInfo = await dbService.getById(dbService.DB.STORES.PROCESSES, processId);
      
      // Actualizar lista de procesos activos
      setActiveProcesses(prev => {
        const updated = [...prev, processInfo];
        updateProcessCounts(updated);
        return updated;
      });
      
      // Crear notificación
      addNotification({
        id: `${processId}-start`,
        type: 'info',
        message: 'Iniciando proceso: Artículo de revisión científica',
        processId
      });
      
      return processId;
    } catch (error) {
      console.error('Error al iniciar proceso de artículo de revisión:', error);
      throw error;
    }
  };

  // Iniciar un proceso de resúmenes por lotes
  const startBatchSummaryProcess = async (fileIds, language, model, modelParams, externalCallbacks = {}) => {
    try {
      const processId = await WorkerService.createBatchSummaryProcess(
        fileIds,
        language,
        model,
        modelParams,
        {
          onStatusUpdate: (status, message) => {
            updateProcessStatus(processId, status, message);
          },
          onComplete: (result) => {
            handleProcessCompletion(processId, WorkerService.PROCESS_TYPES.BATCH_SUMMARY, result);
            // Llamar al callback externo si existe
            if (externalCallbacks && typeof externalCallbacks.onComplete === 'function') {
              externalCallbacks.onComplete(result);
            }
          },
          onError: (error) => {
            handleProcessError(processId, error);
            // Llamar al callback externo si existe
            if (externalCallbacks && typeof externalCallbacks.onError === 'function') {
              externalCallbacks.onError(error);
            }
          }
        }
      );
      
      // Obtener información del proceso
      const processInfo = await dbService.getById(dbService.DB.STORES.PROCESSES, processId);
      
      // Actualizar lista de procesos activos
      setActiveProcesses(prev => {
        const updated = [...prev, processInfo];
        updateProcessCounts(updated);
        return updated;
      });
      
      // Crear notificación
      addNotification({
        id: `${processId}-start`,
        type: 'info',
        message: 'Iniciando proceso: Procesamiento por lotes',
        processId
      });
      
      return processId;
    } catch (error) {
      console.error('Error al iniciar proceso de resúmenes por lotes:', error);
      throw error;
    }
  };

  // Cancelar proceso
  const cancelProcess = async (processId) => {
    try {
      await WorkerService.terminateWorker(processId);
      
      // Actualizar estado en IndexedDB
      await dbService.updateProcess(processId, {
        status: 'cancelled',
        lastUpdated: Date.now()
      });
      
      // Actualizar estado local
      setActiveProcesses(prev => {
        const updated = prev.filter(p => p.id !== processId);
        updateProcessCounts(updated);
        return updated;
      });
      
      // Notificación
      addNotification({
        id: `${processId}-cancel`,
        type: 'warning',
        message: 'Proceso cancelado',
        processId
      });
    } catch (error) {
      console.error(`Error al cancelar proceso ${processId}:`, error);
    }
  };

  // Obtener procesos activos por tipo
  const getActiveProcessesByType = (type) => {
    return activeProcesses.filter(p => 
      p.type === type && (p.status === 'running' || p.status === 'pending')
    );
  };

  // Obtener resultados por tipo
  const getResultsByType = async (type) => {
    let storeName;
    
    switch (type) {
      case WorkerService.PROCESS_TYPES.ARTICLE_INTELLIGENCE:
        storeName = dbService.DB.STORES.ARTICLE_INTELLIGENCE;
        break;
      case WorkerService.PROCESS_TYPES.STRUCTURED_SUMMARY:
        storeName = dbService.DB.STORES.STRUCTURED_SUMMARY;
        break;
      case WorkerService.PROCESS_TYPES.REVIEW_ARTICLE:
        storeName = dbService.DB.STORES.REVIEW_ARTICLE;
        break;
      default:
        return [];
    }
    
    return await dbService.getAllFromStore(storeName);
  };

  // Eliminar todos los procesos y resultados
  const clearAllData = async () => {
    try {
      // Terminar todos los workers activos
      await WorkerService.terminateAllWorkers();
      
      // Eliminar todos los procesos y resultados en IndexedDB
      await dbService.terminateAllProcesses();
      
      // Reiniciar estados
      setActiveProcesses([]);
      setProcessNotifications([]);
      setProcessCounts({
        article_intelligence: 0,
        structured_summary: 0,
        review_article: 0,
        batch_summary: 0
      });
      
      return true;
    } catch (error) {
      console.error('Error al limpiar todos los datos:', error);
      return false;
    }
  };

  // Valor del contexto
  const contextValue = {
    // Estados
    activeProcesses,
    processNotifications,
    processCounts,
    isRecovering,
    
    // Funciones para iniciar procesos
    startArticleIntelligenceProcess,
    startStructuredSummaryProcess,
    startReviewArticleProcess,
    startBatchSummaryProcess,
    
    // Gestión de procesos
    cancelProcess,
    getActiveProcessesByType,
    getResultsByType,
    clearAllData,
    
    // Constantes
    PROCESS_TYPES: WorkerService.PROCESS_TYPES
  };

  return (
    <ProcessContext.Provider value={contextValue}>
      {children}
    </ProcessContext.Provider>
  );
};

export default ProcessProvider;
