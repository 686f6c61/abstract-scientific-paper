/**
 * Módulo con los prompts utilizados en la aplicación RAG
 * Esto permite modificar los prompts sin tocar el código principal
 */

/**
 * Obtiene el prompt para generar resúmenes estructurados
 * 
 * @param {string} query - Consulta del usuario
 * @param {string} language - Idioma en el que generar el resumen
 * @returns {string} - Prompt completo para enviar a la API
 */
exports.getSummaryPrompt = (query, language = "Español") => {
  return `
    Basado en los documentos proporcionados, genera un resumen estructurado EXTENSO y DETALLADO en ${language} utilizando estos apartados. IMPORTANTE: Los apartados deben presentarse en mayúsculas, en NEGRITAS, y seguidos de DOS PUNTOS (p.ej: "**TITULO:**"). Desarrolla cada sección con múltiples párrafos cuando sea necesario.
    
    **TITULO:** Proporciona un título completo y descriptivo del estudio. SIGUE ESTRICTAMENTE LAS NORMAS DE LA RAE: en títulos, solo escribe en mayúscula la primera letra y los nombres propios. NUNCA escribas dos palabras seguidas que comiencen con mayúscula (excepto nombres propios o acrónimos). Ejemplo INCORRECTO: "Evaluación de la Eficacia del Uso de Inteligencia Artificial...". Ejemplo CORRECTO: "Evaluación de la eficacia del uso de inteligencia artificial...".
    
    **CONTEXTO Y OBJETIVOS:** Desarrolla ampliamente el contexto académico, social, económico o empresarial en el que se enmarca el estudio. Explica de forma detallada los objetivos principales y secundarios de la publicación, justificando su relevancia e impacto potencial. Describe la problemática que aborda y las preguntas de investigación planteadas.
    
    **METODOLOGÍA:** Explica exhaustivamente la metodología utilizada, incluyendo diseño de investigación, procedimientos, herramientas analíticas, software empleado, y justificación de las decisiones metodológicas. Precisa los pasos seguidos en el estudio con suficiente detalle para comprender el proceso completo.
    
    **RESULTADOS Y CONCLUSIONES:** Presenta de manera detallada todos los hallazgos principales, resultados estadísticos relevantes, patrones identificados y tendencias observadas. Detalla las conclusiones del estudio, sus implicaciones teóricas y prácticas, así como las recomendaciones derivadas de la investigación. Incluye cualquier limitación identificada y propuestas para futuras investigaciones.
    
    **REFERENCIAS CLAVE:** Es OBLIGATORIO proporcionar un MÍNIMO DE 4 REFERENCIAS BIBLIOGRÁFICAS importantes (o mínimo 2 si definitivamente no es posible encontrar más) utilizadas en el documento siguiendo el formato APA (Autor, año, título, fuente, etc.). Para cada referencia: 
    1) Descríbela en formato APA completo
    2) ASEGÚRATE de que todas las referencias web incluyan "Recuperado de [enlace]" al final (Ejemplo: "McKinsey & Company. (2020). The future of work: AI and the workplace. Recuperado de [enlace]")
    3) Explica su relevancia y contribución al estudio
    4) ESPECIFICA EXACTAMENTE DÓNDE se encuentra esta referencia en el documento original (números de página, secciones, capítulos o párrafos específicos)
    5) INDICA DÓNDE debería citarse esta referencia en el texto del resumen que estás generando (por ejemplo: "Esta referencia debería citarse en la sección de Metodología cuando se menciona..."). 
    
    Esta información es crucial para poder referenciar correctamente el trabajo y mantener la integridad académica.
    
    **IDEAS CLAVE:** Esta sección debe ser EXTENSA y DETALLADA. Desarrolla profundamente todas las ideas principales y conceptos fundamentales del estudio, explicando su significado e importancia en el contexto de la investigación. Identifica al menos 5-7 ideas o conceptos clave y desarrolla cada uno en un párrafo completo. Para cada idea, explica:
    1) El concepto en sí y su definición precisa según el documento
    2) Su origen teórico o empírico
    3) Cómo se aplica específicamente en este estudio
    4) Su relación con otras ideas clave del documento
    5) Su relevancia para el campo de investigación en general
    6) Posibles implicaciones o aplicaciones futuras
    
    **CLASIFICACIÓN DEL TRABAJO:** Esta sección debe ser AMPLIADA CONSIDERABLEMENTE. Proporciona un análisis detallado y justificado del tipo de trabajo, que incluya:
    1) Clasificación principal (Teórico, Empírico, Revisión sistemática, Meta-análisis, Estudio de caso, Mixto u otro)
    2) Subclasificaciones específicas dentro de esa categoría principal
    3) Justificación detallada de por qué se clasifica de esa manera, citando características específicas del documento
    4) Comparación con otras posibles clasificaciones alternativas y explicación de por qué fueron descartadas
    5) Análisis de las implicaciones que esta clasificación tiene para la interpretación de los resultados
    6) Ubicación del trabajo dentro de la literatura científica más amplia de su campo
    
    **DETALLES METODOLÓGICOS:** Esta sección debe ser MUCHO MÁS EXTENSA Y EXHAUSTIVA. En caso de ser un trabajo empírico, proporciona información minuciosa sobre:
    - Paradigma de investigación (Positivista, Interpretativo, Crítico, etc.) y su justificación epistemológica
    - Enfoque metodológico (Cuantitativo, Cualitativo, Experimental, Cuasi-experimental, Mixto u otros), justificando su elección teórica y práctica
    - Diseño específico dentro del enfoque (Transversal, Longitudinal, Panel, etc.) con justificación
    - Contexto temporal y sectorial completo: períodos temporales, sectores industriales o ámbitos de aplicación
    - Caracterización general de la metodología, instrumentos utilizados, procedimientos de análisis
    - Cualquier otra información metodológica relevante no cubierta en otras secciones
    
    **PAISES DEL ESTUDIO:** Especificar explícitamente el país o países donde se realizó el estudio, incluyendo regiones específicas si se mencionan. Detallar cualquier característica geográfica relevante para la investigación. Si esta información NO se proporciona en el documento original, indicar claramente: "El documento no especifica el país o países donde se realizó el estudio".
    
    **MUESTRA:** Esta sección debe ser completa y detallada. Especificar explícitamente:
    - El número exacto de participantes, casos, documentos o unidades analizadas (p.ej., "n=350 participantes")
    - Tipo de muestra (empresas, individuos, documentos, transacciones, PYMEs, etc.)
    - Proceso de muestreo (aleatorio, estratificado, por conveniencia, etc.)
    - Criterios de inclusión y exclusión detallados 
    - Características demográficas o empresariales completas
    - Distribución de la muestra por categorías relevantes
    - Justificación del tamaño muestral (si se proporciona)
    - Análisis de la representatividad y cálculos de potencia estadística (si se mencionan)
    - Si esta información NO se proporciona en el documento original, indicar claramente: "El documento no especifica información sobre la muestra utilizada"
    - Métodos analíticos empleados con especificaciones técnicas completas:
      * Técnicas estadísticas específicas (tipo específico de Regresión, ANOVA, SEM, etc.)
      * Algoritmos de Machine Learning (tipo, parámetros, validación)
      * Software y versiones utilizadas (R, SPSS, Python, etc.)
      * Transformaciones de datos aplicadas
      * Tests estadísticos empleados y niveles de significación
    - Procedimientos detallados de recolección de datos:
      * Instrumentos (cuestionarios, entrevistas, observaciones, extracción automática)
      * Validación de instrumentos (estudios piloto, validez, fiabilidad)
      * Procedimientos específicos de campo o laboratorio
      * Consideraciones éticas y consentimientos
    - Limitaciones metodológicas reconocidas en el estudio
    
    **VARIABLES EMPLEADAS:** LEE CUIDADOSAMENTE LOS DOCUMENTOS ORIGINALES E IDENTIFICA CON PRECISIÓN cada tipo de variable utilizada en el estudio. Es EXTREMADAMENTE IMPORTANTE que revises el documento completo para detectar todas las variables mencionadas, incluso aquellas que puedan estar dispersas en diferentes secciones. Incluye:
    
    1) Una explicación detallada de:
    - Variables dependientes: definición conceptual y operativa, forma de medición, justificación
    - Variables independientes: definición, operacionalización, relación esperada con las variables dependientes
    - Variables moderadoras: naturaleza y modo en que afectan las relaciones principales
    - Variables mediadoras: mecanismos de transmisión de efectos
    - Variables de control: justificación de su inclusión y método de control
    
    2) Un cuadro resumen COMPLETO con TODAS las variables identificadas en el siguiente formato (usa formato markdown para crear la tabla):
    
    | Tipo de Variable | Nombre de la Variable | Definición | Medición/Operacionalización |
    |-----------------|------------------------|------------|--------------------------------|
    | Dependiente     | [Nombre exacto]       | [Def]      | [Cómo se midió]              |
    | Independiente   | [Nombre exacto]       | [Def]      | [Cómo se midió]              |
    | Moderadora      | [Nombre exacto]       | [Def]      | [Cómo se midió]              |
    | Mediadora       | [Nombre exacto]       | [Def]      | [Cómo se midió]              |
    | Control         | [Nombre exacto]       | [Def]      | [Cómo se midió]              |
    
    INCLUYE TODAS LAS VARIABLES, aunque parezcan secundarias. Si alguna categoría de variables no está presente en el estudio, indícalo claramente con "No se identificaron variables de este tipo en el estudio".
    
    **MARCO TEÓRICO DE REFERENCIA:** Explica extensamente la teoría o marco teórico principal en que se fundamenta el estudio, su desarrollo histórico, sus principales exponentes, postulados centrales y cómo se aplica específicamente en esta investigación. Menciona teorías complementarias o alternativas consideradas. Para cada marco teórico mencionado, incluye la referencia completa en formato APA de la fuente original o canónica de dicha teoría (por ejemplo: Bandura, A. (1986). Social foundations of thought and action: A social cognitive theory. Prentice-Hall, Inc.).
    
    Consulta original: ${query}
  `;
};

/**
 * Obtiene el prompt adicional para especificar archivos
 * 
 * @param {string[]} file_ids - Lista de IDs de archivos
 * @returns {string} - Prompt adicional o cadena vacía
 */
exports.getFileSpecificPrompt = (file_ids) => {
  if (file_ids && file_ids.length > 0) {
    return `
      
      IMPORTANTE: Enfoca tu búsqueda y resumen sólo en los documentos con los siguientes IDs: ${file_ids.join(', ')}
    `;
  }
  return "";
};
