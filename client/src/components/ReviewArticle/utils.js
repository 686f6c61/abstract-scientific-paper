/**
 * Utilidades para el componente ReviewArticle
 */

/**
 * Formatea el tamaño de archivo en bytes a una representación legible
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Tamaño formateado
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Extrae el nombre de archivo sin la extensión
 * @param {string} filename - Nombre del archivo con extensión
 * @returns {string} - Nombre sin extensión
 */
export const getFilenameWithoutExtension = (filename) => {
  if (!filename) return '';
  return filename.replace(/\.[^/.]+$/, "");
};

/**
 * Devuelve las clases CSS para los botones principales según el estado
 * @param {boolean} disabled - Si el botón está deshabilitado
 * @returns {object} - Objeto con los estilos
 */
export const getPrimaryButtonStyles = (disabled = false) => ({
  py: 1.2,
  px: 3,
  borderRadius: 2,
  boxShadow: 2,
  fontSize: '0.95rem',
  fontWeight: 'medium',
  textTransform: 'none',
  opacity: disabled ? 0.7 : 1,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: 3,
    transform: disabled ? 'none' : 'translateY(-2px)'
  }
});

/**
 * Devuelve las clases CSS para los elementos principales
 * @returns {object} - Objeto con los estilos
 */
export const getCommonStyles = () => ({
  mainContainer: {
    p: 3,
    borderRadius: 2,
    boxShadow: 1,
    bgcolor: 'background.paper'
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: 'primary.main',
    mb: 2
  },
  mainHeader: {
    textTransform: 'uppercase', 
    fontWeight: 'bold', 
    my: 3, 
    color: '#1a237e'
  }
});
