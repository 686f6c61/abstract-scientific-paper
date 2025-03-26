// Configuración y gestión de IndexedDB
const DB_NAME = 'rag_scientific_db';
const DB_VERSION = 1;

// Definición de tiendas de objetos (tablas)
const STORES = {
  PROCESSES: 'processes',            // Almacena los procesos en ejecución
  ARTICLE_INTELLIGENCE: 'articleIntelligence', // Resultados de la pestaña Inteligencia sobre artículo
  STRUCTURED_SUMMARY: 'structuredSummary', // Resultados de Resumen estructurado
  REVIEW_ARTICLE: 'reviewArticle'    // Datos del Artículo de revisión científica
};

/**
 * Función para inicializar/abrir la base de datos
 * @returns {Promise} Promesa que resuelve a la conexión de la base de datos
 */
export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error al abrir la base de datos:', event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
    
    // Se ejecuta cuando se crea la BD por primera vez o se aumenta la versión
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Tienda para procesos en ejecución
      if (!db.objectStoreNames.contains(STORES.PROCESSES)) {
        const store = db.createObjectStore(STORES.PROCESSES, { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Tienda para datos de Inteligencia sobre artículo
      if (!db.objectStoreNames.contains(STORES.ARTICLE_INTELLIGENCE)) {
        const store = db.createObjectStore(STORES.ARTICLE_INTELLIGENCE, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('query', 'query', { unique: false });
      }
      
      // Tienda para datos de Resumen estructurado
      if (!db.objectStoreNames.contains(STORES.STRUCTURED_SUMMARY)) {
        const store = db.createObjectStore(STORES.STRUCTURED_SUMMARY, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('query', 'query', { unique: false });
      }
      
      // Tienda para datos de Artículo de revisión científica
      if (!db.objectStoreNames.contains(STORES.REVIEW_ARTICLE)) {
        const store = db.createObjectStore(STORES.REVIEW_ARTICLE, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('step', 'step', { unique: false });
      }
    };
  });
};

/**
 * Guarda un registro en una tienda específica
 * @param {string} storeName - Nombre de la tienda
 * @param {Object} data - Datos a guardar
 * @returns {Promise} - Promesa que resuelve al ID del registro guardado
 */
export const saveToStore = async (storeName, data) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // Añadir timestamp si no existe
    if (!data.timestamp) {
      data.timestamp = Date.now();
    }
    
    const request = store.put(data);
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = (event) => {
      console.error(`Error al guardar en ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Obtiene todos los registros de una tienda
 * @param {string} storeName - Nombre de la tienda
 * @returns {Promise} - Promesa que resuelve a un array de registros
 */
export const getAllFromStore = async (storeName) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = (event) => {
      console.error(`Error al obtener registros de ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Obtiene un registro específico por su ID
 * @param {string} storeName - Nombre de la tienda
 * @param {string|number} id - ID del registro a obtener
 * @returns {Promise} - Promesa que resuelve al registro encontrado o null
 */
export const getById = async (storeName, id) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    
    request.onerror = (event) => {
      console.error(`Error al obtener registro de ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Elimina un registro por su ID
 * @param {string} storeName - Nombre de la tienda
 * @param {string|number} id - ID del registro a eliminar
 * @returns {Promise} - Promesa que resuelve cuando se completa la eliminación
 */
export const deleteFromStore = async (storeName, id) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = (event) => {
      console.error(`Error al eliminar registro de ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Guarda información sobre un proceso en ejecución
 * @param {Object} processData - Datos del proceso
 * @returns {Promise} - Promesa que resuelve al ID del proceso
 */
export const saveProcess = async (processData) => {
  // Asegurarse de que tiene un ID único
  if (!processData.id) {
    processData.id = Date.now().toString();
  }
  
  return await saveToStore(STORES.PROCESSES, processData);
};

/**
 * Actualiza el estado de un proceso
 * @param {string} processId - ID del proceso
 * @param {Object} updates - Actualizaciones a aplicar
 * @returns {Promise}
 */
export const updateProcess = async (processId, updates) => {
  const process = await getById(STORES.PROCESSES, processId);
  if (!process) {
    throw new Error(`Proceso con ID ${processId} no encontrado`);
  }
  
  const updatedProcess = {
    ...process,
    ...updates,
    lastUpdated: Date.now()
  };
  
  return await saveToStore(STORES.PROCESSES, updatedProcess);
};

/**
 * Obtiene los procesos activos
 * @param {string} type - Tipo de proceso (opcional)
 * @returns {Promise} - Promesa que resuelve a los procesos activos
 */
export const getActiveProcesses = async (type = null) => {
  const allProcesses = await getAllFromStore(STORES.PROCESSES);
  const activeProcesses = allProcesses.filter(process => 
    process.status === 'running' || process.status === 'pending'
  );
  
  if (type) {
    return activeProcesses.filter(process => process.type === type);
  }
  
  return activeProcesses;
};

/**
 * Finaliza todos los procesos en ejecución
 * @returns {Promise}
 */
export const terminateAllProcesses = async () => {
  const activeProcesses = await getActiveProcesses();
  
  // Actualizar todos los procesos activos a 'terminated'
  const updatePromises = activeProcesses.map(process => 
    updateProcess(process.id, { status: 'terminated' })
  );
  
  return Promise.all(updatePromises);
};

// Exportar constantes y funciones
export const DB = {
  NAME: DB_NAME,
  VERSION: DB_VERSION,
  STORES
};
