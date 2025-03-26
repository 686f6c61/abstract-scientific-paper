/* eslint-disable no-restricted-globals */
// Web Worker para manejar solicitudes al API en segundo plano
// Esto permite que las solicitudes continúen incluso si el usuario navega entre pestañas

// Función para realizar solicitudes HTTP
const makeRequest = async (url, method, data = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
};

// Manejador de mensajes recibidos del hilo principal
self.onmessage = async (event) => {
  const { action, payload, processId } = event.data;
  
  try {
    let result;
    
    // Notificar inicio de la operación
    self.postMessage({
      type: 'STATUS_UPDATE',
      processId,
      status: 'running',
      message: `Iniciando proceso: ${action}`
    });

    // Ejecutar la acción solicitada
    switch (action) {
      case 'PROCESS_QUERY':
        // Procesar consulta (Inteligencia sobre artículo)
        result = await makeRequest('/api/openai/query', 'POST', payload);
        break;
        
      case 'GENERATE_SUMMARY':
        // Generar resumen estructurado
        const apiEndpoint = payload.model.includes('claude') ? 'anthropic' : 'openai';
        result = await makeRequest(`/api/${apiEndpoint}/summary`, 'POST', payload);
        break;
        
      case 'GENERATE_REVIEW_ARTICLE':
        // Generar artículo de revisión científica
        const articleApiEndpoint = payload.model.includes('claude') ? 'anthropic' : 'openai';
        result = await makeRequest(`/api/${articleApiEndpoint}/review-article`, 'POST', payload);
        break;
        
      case 'PROCESS_BATCH_SUMMARIES':
        // Procesar resúmenes por lotes
        const batchEndpoint = payload.model.includes('claude') ? 'anthropic' : 'openai';
        result = await makeRequest(`/api/${batchEndpoint}/batch-summary`, 'POST', payload);
        break;
        
      default:
        throw new Error(`Acción desconocida: ${action}`);
    }

    // Enviar el resultado exitoso al hilo principal
    self.postMessage({
      type: 'RESULT',
      processId,
      action,
      result,
      status: 'completed'
    });
    
  } catch (error) {
    // Enviar error al hilo principal
    self.postMessage({
      type: 'ERROR',
      processId,
      action,
      error: error.message,
      status: 'error'
    });
  }
};

// Escuchar mensajes de terminación
self.addEventListener('message', (event) => {
  if (event.data.action === 'TERMINATE') {
    self.close();
  }
});

console.log('API Worker inicializado y listo para procesar solicitudes');
