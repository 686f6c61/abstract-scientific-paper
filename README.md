# (U)Boost - Abstract Scientific Paper 📝✨

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![OpenAI](https://img.shields.io/badge/OpenAI-API-7A2723?logo=openai)
![Anthropic](https://img.shields.io/badge/Anthropic-Claude-623CE4?logo=anthropic)


(U)Boost - Abstract Scientific Paper es una potente aplicación web para procesar, analizar y generar resúmenes estructurados a partir de artículos científicos en formato PDF. Utilizando tecnología RAG (Retrieval Augmented Generation) combinada con modelos avanzados de OpenAI (GPT-4o y GPT-4o-mini) y Anthropic (Claude 3.7 Sonnet 2025), el sistema proporciona análisis precisos y detallados basados en el contenido real de los documentos con una interfaz moderna y amigable.

<p align="center">
  <b>Sistema avanzado de procesamiento y resumen de documentos científicos con tecnología RAG</b>
</p>

## 🔥 Características principales

- 📚 **Gestión de PDFs**:
  - Carga de documentos científicos en formato PDF
  - Visualización de documentos subidos
  - Selección de documentos específicos para análisis

- 🔍 **Búsqueda semántica inteligente**:
  - Búsquedas contextuales basadas en el significado, no solo palabras clave
  - Filtrado por documentos específicos
  - Visualización de resultados con referencias a las fuentes originales

- 📝 **Generación de resúmenes estructurados**:
  - Resúmenes completos con secciones específicas siguiendo normas académicas
  - Títulos según normas RAE (sin mayúsculas consecutivas excepto en nombres propios)
  - Referencias bibliográficas en formato APA con el formato "Recuperado de [enlace]"
  - Visualización de tablas Markdown correctamente formateadas
  - Información de consumo de tokens para cada generación
  - Soporte para múltiples idiomas (Español, English, Français, Deutsch, Italiano, Português)
  - Selección de modelo (GPT-4o, GPT-4o-mini, Claude 3.7 Sonnet 2025)

- 📊 **Análisis de uso y costes**:
  - Contador de PDFs procesados durante la sesión
  - Seguimiento de tokens totales consumidos en tiempo real
  - Cálculo preciso de costes en dólares según el modelo utilizado
  - Visualización de métricas de uso en el footer de la aplicación

- ⚙️ **Opciones avanzadas de IA**:
  - **Tokens máximos**: Control sobre la longitud máxima de la respuesta generada
  - **Temperatura (0-2)**: Ajuste de creatividad y aleatoriedad en las respuestas
  - **Top P (0-1)**: Control de diversidad mediante muestreo de núcleo
  - **Penalización por frecuencia (-2 a 2)**: Reducción de repeticiones de frases
  - **Penalización por presencia (-2 a 2)**: Control de repetición de temas

- 💾 **Opciones de exportación**:
  - Descarga de resúmenes en formato Markdown (.md)
  - Descarga de resúmenes en formato texto plano (.txt)
  - Copia directa al portapapeles

- 🎨 **Interfaz de usuario limpia y moderna**:
  - Diseño intuitivo con Material-UI
  - Feedback visual durante los procesos de carga y generación
  - Visualización optimizada de contenido Markdown

## 🎛️ Parámetros avanzados de IA

La aplicación permite personalizar el comportamiento de los modelos GPT-4o y GPT-4o-mini mediante los siguientes parámetros:

### Tokens máximos
- **Descripción**: Define la longitud máxima de texto que el modelo puede generar.
- **Valores**: De 1 hasta el máximo del modelo (8192 para GPT-4o, 4096 para GPT-4o-mini).
- **Cuándo ajustar**: Aumentar para obtener respuestas más completas o reducir para respuestas más concisas.
- **Impacto**: Afecta directamente al consumo de tokens y al coste de la petición a la API.

### Temperatura
- **Descripción**: Controla la aleatoriedad y creatividad de las respuestas.
- **Rango**: 0 a 2
  - **Valores bajos (0-0.3)**: Respuestas más deterministas, consistentes y enfocadas en hechos.
  - **Valores medios (0.4-0.8)**: Balance entre creatividad y coherencia (valor por defecto: 0.7).
  - **Valores altos (0.9-2)**: Respuestas más creativas, diversas e impredecibles.
- **Aplicación práctica**: Usar valores bajos para información factual y análisis riguroso; valores altos para generación más creativa.

### Top P (Nucleus Sampling)
- **Descripción**: Determina qué palabras considera el modelo durante la generación de texto.
- **Rango**: 0 a 1
  - **Valores bajos**: Considera solo las palabras más probables (respuestas más predecibles).
  - **Valores altos**: Considera más opciones, incluyendo palabras menos probables (respuestas más diversas).
- **Uso recomendado**: Valores entre 0.9 y 1 para mantener precisión con algo de variabilidad.

### Penalización por frecuencia
- **Descripción**: Reduce la probabilidad de repetir las mismas frases o estructuras gramaticales.
- **Rango**: -2 a 2
  - **Valores negativos**: Promueve repeticiones (raramente útil).
  - **Valor 0**: Comportamiento neutral (por defecto).
  - **Valores positivos**: Desalienta repeticiones, favoreciendo mayor diversidad léxica.
- **Aplicación**: Aumentar para evitar que el resumen repita las mismas estructuras y expresiones.

### Penalización por presencia
- **Descripción**: Disminuye la probabilidad de repetir los mismos temas o tópicos.
- **Rango**: -2 a 2
  - **Valores negativos**: Promueve el retorno a temas ya mencionados.
  - **Valor 0**: Sin efecto (por defecto).
  - **Valores positivos**: Fomenta la exploración de nuevos temas.
- **Uso óptimo**: Valores positivos para resúmenes más diversos que cubran más aspectos del documento.

> **Nota**: La combinación óptima de estos parámetros depende del tipo de documento y los objetivos del análisis. Se recomienda experimentar con diferentes configuraciones.

## 💻 Arquitectura y tecnologías

El proyecto utiliza una arquitectura cliente-servidor moderna con las siguientes tecnologías:

### 🖥️ Frontend
- **React 18**: Biblioteca JavaScript para la construcción de interfaces de usuario
- **Material-UI**: Framework de componentes React para un diseño moderno
- **ReactMarkdown**: Renderizado de Markdown con soporte para tablas (remark-gfm)
- **Axios**: Cliente HTTP para comunicación con el backend

### ⚙️ Backend
- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor
- **Express**: Framework web minimalista para Node.js
- **OpenAI API**: Integración con modelos avanzados de lenguaje (GPT-4o y GPT-4o-mini)
- **Anthropic API**: Integración con modelos avanzados de Claude (Claude 3.7 Sonnet 2025)

- **Multer**: Middleware para manejo de carga de archivos
- **PDF.js**: Biblioteca para procesamiento y extracción de texto de PDFs



## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js 18 o superior
- npm o yarn
- Clave API de OpenAI

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/686f6c61/abstract-scientific-paper.git
   cd abstract-scientific-paper
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Crear un archivo `.env` en la carpeta `server` basado en `.env.example`
   - Añadir tus claves API:
     ```
     OPENAI_API_KEY=sk-...
     ANTHROPIC_API_KEY=sk-ant-...
     DEEPSEEK_API_KEY=sk-...
     ```

4. **Iniciar la aplicación**
   ```bash
   npm start
   ```
   Esto iniciará tanto el servidor (puerto 5000) como el cliente (puerto 3000)

2. **Accede a la aplicación web**
   
   Abre tu navegador y ve a `http://localhost:3000`

## 📊 Flujo de funcionamiento

1. **Subida de documentos**:
   - El usuario carga documentos PDF a través de la interfaz
   - El sistema extrae y procesa el texto automáticamente

2. **Consulta o resumen**:
   - **Consulta simple**: Permite hacer preguntas específicas sobre el contenido
   - **Resumen estructurado**: Genera un análisis completo siguiendo una estructura académica

3. **Generación y visualización**:
   - La aplicación envía el contenido procesado junto con la consulta a la API de OpenAI o Anthropic
   - El modelo seleccionado (GPT-4o, GPT-4o-mini o Claude 3.7 Sonnet 2025) genera la respuesta
   - El resultado se muestra con formato Markdown, incluyendo tablas correctamente renderizadas
   - Las métricas en el footer (PDFs procesados, tokens consumidos y coste en dólares) se actualizan en tiempo real

4. **Exportación**:
   - El usuario puede descargar el resultado en formato Markdown o texto plano

## 🧹 Estructura del Sistema

- `server/`: Directorio del backend
  - `controllers/`: Controladores para las rutas de la API (OpenAI y Anthropic)
  - `routes/`: Definición de endpoints de la API
  - `utils/`: Utilidades para el procesamiento de PDFs y prompts
  - `uploads/`: Directorio donde se almacenan los PDFs subidos

- `client/`: Directorio del frontend
  - `src/components/`: Componentes React de la interfaz
  - `src/contexts/`: Contextos para la gestión del estado
  - `src/utils/`: Utilidades para el frontend

## 💡 Características detalladas

### 💬 Prompts de generación avanzados

El sistema utiliza prompts detallados y estructurados para generar resúmenes completos. El prompt principal incluye instrucciones específicas para:

1. **Estructura de secciones**: Título, Contexto y Objetivos, Metodología, Resultados y Conclusiones, Referencias Clave, Ideas Clave, Clasificación del Trabajo, Detalles Metodológicos, Variables Empleadas.

2. **Normas de formato**:
   - Títulos siguiendo normas RAE (primera letra y nombres propios en mayúscula)
   - Referencias web con formato "Recuperado de [enlace]"
   - Formato de tablas adecuado

3. **Análisis exhaustivo**:
   - Variables dependientes, independientes, moderadoras y de control
   - Clasificación del tipo de trabajo (teórico, empírico, revisión)
   - Extracción de referencias bibliográficas con localización precisa

### 📊 Métricas de uso y costes

La aplicación incluye un sistema de seguimiento que proporciona información en tiempo real sobre el uso y los costes asociados:

- **PDFs procesados**: Contador del total de documentos PDF procesados durante la sesión actual.

- **Tokens consumidos**: Contador en tiempo real de la cantidad total de tokens utilizados en todas las consultas y resúmenes generados.

- **Coste calculado**: Cálculo preciso del coste en dólares según el modelo utilizado y los tokens consumidos, basado en las tarifas oficiales de OpenAI:

  | Modelo | Tokens de entrada | Tokens de salida |
  |--------|------------------|------------------|
  | GPT-4o | $2.50 / 1M tokens | $10.00 / 1M tokens |
  | GPT-4o-mini | $0.15 / 1M tokens | $0.60 / 1M tokens |

- **Modelo utilizado**: Indicador del modelo actual seleccionado (GPT-4o o GPT-4o-mini).

Estas métricas se actualizan automáticamente después de cada consulta o generación de resumen, permitiendo a los usuarios monitorizar su uso de recursos y los costes asociados en tiempo real.

### 🤖 Modelos disponibles

La aplicación ofrece dos opciones de modelo:

| Modelo | Descripción | Límite de tokens |
|--------|-------------|------------------|
| **GPT-4o** | Modelo avanzado para resúmenes más detallados y precisos | 8,192 tokens |
| **GPT-4o-mini** | Versión más ligera y rápida, ideal para documentos más pequeños | 4,096 tokens |

## 📊 Flujo de funcionamiento

1. **Subida de documentos**:
   - El usuario carga documentos PDF a través de la interfaz
   - El sistema extrae y procesa el texto automáticamente

2. **Consulta o resumen**:
   - **Consulta simple**: Permite hacer preguntas específicas sobre el contenido
   - **Resumen estructurado**: Genera un análisis completo siguiendo una estructura académica

3. **Generación y visualización**:
   - La aplicación envía el contenido procesado junto con la consulta a la API de OpenAI o Anthropic
   - El modelo seleccionado (GPT-4o, GPT-4o-mini o Claude 3.7 Sonnet 2025) genera la respuesta
   - El resultado se muestra con formato Markdown, incluyendo tablas correctamente renderizadas
   - Las métricas en el footer (PDFs procesados, tokens consumidos y coste en dólares) se actualizan en tiempo real

4. **Exportación**:
   - El usuario puede descargar el resultado en formato Markdown o texto plano

## 📝 Uso recomendado

Esta aplicación está diseñada para asistir en el análisis y resumen de documentos científicos, siendo especialmente útil para:

- Investigadores que necesitan procesar grandes volúmenes de literatura científica
- Estudiantes preparando revisiones bibliográficas
- Profesionales que requieren extraer información clave de artículos técnicos
- Equipos de investigación que comparten conocimiento basado en publicaciones científicas

---

(U)Boost © Abstract Scientific Paper - Marzo 2025

## 🧠 Implementación de RAG (Retrieval Augmented Generation)

Nuestra implementación de RAG se ha basado en las técnicas descritas en [OpenAI Cookbook](https://cookbook.openai.com/examples/file_search_responses), adaptadas para optimizar el análisis de documentos científicos:

### Vector Store y Embeddings

- **Procesamiento eficiente de PDFs**: Nuestro sistema extrae y procesa el texto de los documentos PDF utilizando técnicas de chunking optimizadas para preservar el contexto científico y académico.

- **Almacenamiento vectorial**: El contenido extraído se convierte en embeddings utilizando modelos avanzados, permitiendo búsquedas semánticas precisas incluso en documentos extensos y técnicos.

- **Búsqueda paralela**: Implementamos búsquedas concurrentes que mejoran significativamente la velocidad de recuperación en colecciones grandes de documentos científicos.

### Integración con LLM mediante API de Responses

- **Llamada API unificada**: A diferencia de implementaciones tradicionales que requieren múltiples llamadas, utilizamos una única llamada a la API que combina la recuperación de documentos y generación de respuestas, reduciendo latencia.

- **Herramienta file_search personalizada**: Hemos adaptado la herramienta file_search para priorizar contenido académico relevante, mejorando la precisión en referencias y conceptos científicos.

- **Citaciones y referencias mejoradas**: Nuestro sistema rastrea las fuentes exactas de información dentro de los documentos, permitiendo generar referencias bibliográficas precisas en formato APA.

### Optimizaciones específicas para documentos científicos

- **Reconocimiento de estructura académica**: El sistema identifica automáticamente secciones como metodología, resultados y conclusiones, permitiendo consultas más específicas.

- **Interpretación de tablas y figuras**: Implementamos procesamiento especial para reconocer y extraer información de tablas y figuras, elementos críticos en la literatura científica.

- **Validación terminológica**: Utilizamos verificaciones adicionales para mantener la precisión de términos técnicos y científicos especializados durante la generación de respuestas.

Estas adaptaciones han permitido crear un sistema RAG específicamente optimizado para el análisis de literatura científica, combinando la potencia de los modelos de OpenAI con técnicas avanzadas de recuperación de información.

## 📋 Limitaciones

- El sistema está optimizado para documentos académicos y científicos en formato texto.
- Los PDFs con contenido mayoritariamente visual, tablas complejas o ecuaciones pueden no procesarse correctamente.
- El tamaño y complejidad de los PDFs puede afectar al tiempo de procesamiento y al coste de uso de la API.

## 🔗 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está disponible bajo la Licencia MIT, lo que permite su uso libre para fines educativos, académicos y comerciales. Consulta el archivo [`LICENSE`](LICENSE) para ver el texto completo de la licencia.

## 📧 Contacto

Para preguntas o sugerencias, no dudes en abrir un issue en este repositorio.

---

<p align="center">
Desarrollado con ❤️ para el análisis avanzado de documentos científicos
</p>
