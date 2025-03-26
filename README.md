# 🚀 (U)Boost scientific paper 📝✨

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![OpenAI](https://img.shields.io/badge/OpenAI-API-7A2723?logo=openai)
![Anthropic](https://img.shields.io/badge/Anthropic-Claude-623CE4?logo=anthropic)

**(U)Boost scientific paper** es una potente aplicación web para procesar, analizar y generar contenido académico a partir de artículos científicos en formato PDF. Utiliza tecnología RAG (Retrieval Augmented Generation) junto a modelos avanzados de OpenAI (GPT-4o, GPT-4o-mini) y Anthropic (Claude 3.7 Sonnet), proporcionando análisis detallados y precisos con una interfaz moderna y amigable basada en Material-UI.

<p align="center">
  <b>Sistema avanzado de procesamiento, análisis y síntesis de documentos científicos con tecnología RAG</b>
</p>

## 📸 Capturas de pantalla

![Inteligencia sobre artículo: Consulta contextual precisa sobre PDFs científicos](img/consulta-simple.png)
*Inteligencia sobre artículo: Consulta contextual precisa sobre PDFs científicos*

![Artículo de revisión científica: Generación de revisiones completas a partir de múltiples PDFs](img/revision-cientifica.png)
*Artículo de revisión científica: Generación de revisiones completas a partir de múltiples PDFs*

---

## 🔥 Características principales

- 🔑 **Configuración sencilla de API Keys**
  - Interfaz gráfica para configurar tus claves API de OpenAI y Anthropic.
  - Validación en tiempo real de las claves ingresadas.
  - Indicador visual del estado de configuración.
  - Instrucciones paso a paso para obtener las claves.

- 📚 **Gestión avanzada de PDFs**
  - Carga rápida y sencilla de documentos PDF.
  - Visualización de documentos subidos.
  - Selección individual o múltiple para análisis específico.

- 🔍 **Inteligencia sobre artículo**
  - Consultas contextuales precisas sobre el contenido de los PDF.
  - Ejemplos pre-configurados para análisis de variables, metodologías, resultados y síntesis.
  - Respuestas referenciadas directamente a las fuentes originales.

- 📝 **Generación de resúmenes estructurados**
  - Organización clara según normas académicas con 10+ secciones detalladas.
  - Títulos adaptados a normas RAE y tablas de variables bien estructuradas.
  - Referencias APA completas con información de recuperación.
  - Soporte multilenguaje: Español, Inglés, Francés, Alemán, Italiano, Portugués.

- 📄 **Artículo de revisión científica** (Beta)
  - Generación de artículos de revisión completos a partir de múltiples resúmenes PDFs.
  - Estructura académica con secciones personalizables a través de instrucciones específicas.
  - Síntesis coherente de información de múltiples fuentes con referencias cruzadas.

- 📊 **Análisis de uso y costes**
  - Contador en tiempo real de PDFs procesados por sesión.
  - Seguimiento en vivo del consumo total de tokens.
  - Cálculo automático de costes basado en modelo seleccionado.

- ⚙️ **Opciones avanzadas de IA**
  - **Tokens máximos:** Controla la longitud máxima del contenido generado.
  - **Temperatura:** Ajusta la creatividad de las respuestas (0.7 recomendado).
  - **Top P:** Diversidad léxica (0.9-1 recomendado).
  - **Penalización frecuencia:** Evita repetición de frases.
  - **Penalización presencia:** Evita repetición de temas.

- 💾 **Opciones de exportación y gestión del historial**
  - Descarga en formato Markdown (.md) y texto plano (.txt).
  - Copia rápida directa al portapapeles.
  - Historial completo de consultas realizadas con indicadores visuales.
  - Exportación de múltiples consultas seleccionadas en archivo ZIP.
  - Reutilización de consultas anteriores con un solo clic.

- 🎨 **Interfaz moderna y amigable**
  - Diseño intuitivo y responsive con Material-UI.
  - Asistentes contextuales con ejemplos copiables para cada función.
  - Feedback visual durante cargas y generación de contenido.

---

## 🎛️ Parámetros avanzados de IA

| Parámetro | Descripción | Valores recomendados |
|-----------|-------------|----------------------|
| **Tokens máximos** | Longitud máxima del texto generado | 8192 (GPT-4o), 4096 (GPT-4o-mini) |
| **Temperatura** | Creatividad/Aleatoriedad de respuestas | 0 (bajo), 0.7 (medio, recomendado), 2 (alto) |
| **Top P** | Diversidad léxica en generación | 0.9-1 |
| **Penalización frecuencia** | Evitar repetición de frases | 0 a 2 |
| **Penalización presencia** | Evitar repetición temática | 0 a 2 |

> **Nota:** Experimenta según el tipo y objetivo del análisis.

---

## 💻 Arquitectura tecnológica

### Frontend 🖥️
- React 18
- Material-UI
- Axios (Cliente HTTP)
- ReactMarkdown (remark-gfm, tablas Markdown)

### Backend ⚙️
- Node.js (18+) y Express
- OpenAI API (GPT-4o, GPT-4o-mini)
- Anthropic API (Claude 3.7 Sonnet)
- Multer (middleware subida PDFs)
- PDF.js (procesamiento PDFs)

---

## 🚀 Instalación y ejecución

### 🔧 Requisitos previos
- Node.js v18+ (recomendado v18.17.0 o superior)
- npm v9+ o yarn v1.22+
- Git instalado
- Claves API de OpenAI y Anthropic (opcionales para la instalación inicial)

### 📥 Instalación paso a paso

#### 1. Clonar el repositorio
```bash
git clone https://github.com/686f6c61/abstract-scientific-paper.git
cd abstract-scientific-paper
```

#### 2. Instalar dependencias del servidor
```bash
cd server
npm install
cd ..
```

#### 3. Instalar dependencias del cliente
```bash
cd client
npm install
cd ..
```

#### 4. Configurar variables de entorno
Crea un archivo `.env` en la carpeta raíz del proyecto basado en el archivo `.env.example`:

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo con tu editor favorito
nano .env   # o usa: vim .env, code .env, etc.
```

Modifica el archivo `.env` con tus claves API:
```env
OPENAI_API_KEY=sk-...  # Tu clave de OpenAI
ANTHROPIC_API_KEY=sk-ant-...  # Tu clave de Anthropic
```

> **Nota**: No es obligatorio configurar las API Keys en este paso. También puedes configurarlas más tarde directamente desde la interfaz gráfica de la aplicación usando el botón de configuración (🔑) en la barra superior.

### 🔑 Obtención de API Keys

#### OpenAI API Key (para GPT-4o y GPT-4o-mini)
1. Crea una cuenta en [OpenAI Platform](https://platform.openai.com/signup)
2. Ve a la sección de [API Keys](https://platform.openai.com/api-keys)
3. Haz clic en "Create new API key"
4. Asigna un nombre descriptivo a tu clave (ej. "UBoostApp")
5. Copia la API key generada (comienza con "sk-")
6. Guárdala en un lugar seguro, ¡no podrás volver a verla!

#### Anthropic API Key (para Claude 3.7 Sonnet)
1. Crea una cuenta en [Anthropic Console](https://console.anthropic.com/signup)
2. Ve a la sección de [API Keys](https://console.anthropic.com/account/keys)
3. Haz clic en "Create key"
4. Asigna un nombre descriptivo y establece los permisos
5. Copia la API key generada (comienza con "sk-ant-")
6. Guárdala en un lugar seguro, ¡no podrás volver a verla!

### ▶️ Ejecución de la aplicación

#### Iniciar en modo desarrollo (dos terminales)

**Terminal 1 - Servidor Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Cliente Frontend:**
```bash
cd client
npm start
```

#### Iniciar con un solo comando (producción)
```bash
# En la carpeta raíz del proyecto
npm start
```

### 🌐 Acceso a la aplicación
- Frontend React: [http://localhost:3000](http://localhost:3000)
- Backend Express: [http://localhost:5000](http://localhost:5000)

### 🔍 Verificar la instalación
Para comprobar que todo está funcionando correctamente:

1. Abre [http://localhost:3000](http://localhost:3000) en tu navegador
2. Asegúrate de que la interfaz se carga correctamente
3. Configura tus API Keys usando el botón de configuración en la barra superior
4. Sube un PDF de prueba para verificar la funcionalidad

### ❓ Solución de problemas comunes

- **Error: ENOENT no such file or directory**: Asegúrate de que la estructura de carpetas sea correcta y estés ejecutando los comandos desde la ubicación adecuada.
- **Error de conexión al servidor**: Verifica que el servidor backend esté ejecutándose en el puerto 5000.
- **Problemas con las API Keys**: Comprueba que las claves están correctamente formateadas y son válidas.

---

## 📜 Gestión del historial de consultas

El sistema implementa un historial completo de consultas y resúmenes con múltiples funcionalidades:

- **Guardado automático**: Todas las consultas y resúmenes se guardan automáticamente.
- **Visualización detallada**: Diferenciación visual entre consultas simples y resúmenes estructurados.
- **Selección múltiple**: Posibilidad de seleccionar varias consultas para operaciones por lotes.
- **Exportación ZIP**: Las consultas seleccionadas pueden exportarse como archivo ZIP con cada consulta en formato TXT.
- **Operaciones de consulta**:
  - Copia al portapapeles
  - Descarga individual
  - Preguntas de seguimiento basadas en respuestas anteriores
  - Reutilización de consultas previas
- **Persistencia**: El historial se mantiene entre sesiones mediante almacenamiento local.

---

## 📂 Estructura del proyecto

```
📁 abstract-scientific-paper
├── 📁 client                      # Frontend React
│   ├── 📁 public                # Archivos públicos y estáticos
│   │   └── 📁 icons            # Iconos de la aplicación
│   │
│   └── 📁 src                   # Código fuente React
│       ├── 📁 components        # Componentes UI
│       │   └── 📁 ReviewArticle  # Componentes de artículo de revisión
│       ├── 📁 contexts          # Contextos (API Keys, PDF, etc.)
│       ├── 📁 services          # Servicios para comunicación con API
│       ├── 📁 utils             # Utilidades y funciones auxiliares
│       └── 📁 workers           # Web workers para procesamiento
│
├── 📁 server                      # Backend Node.js/Express
│   ├── 📁 controllers        # Controladores de rutas API
│   ├── 📁 routes             # Definición de rutas API
│   ├── 📁 uploads            # Almacenamiento temporal de PDFs
│   └── 📁 utils              # Utilidades para proceso RAG y IA
│
├── 📁 examples                    # Ejemplos de resultados generados
└── 📁 img                         # Imágenes para documentación
```

### Componentes principales

#### Componentes de infraestructura
- **Header**: Barra superior con navegación, gestión de API Keys y historial de versiones (V.01-V.09)
- **ApiKeysConfig**: Interfaz mejorada para configuración y validación de claves API de OpenAI y Anthropic
- **VersionHistory**: Historial completo de versiones con detalles de cada actualización
- **PdfContext**: Contexto React para gestión centralizada de PDFs, consultas e historial
- **MainContent**: Contenedor principal con sistema de pestañas para las diferentes funcionalidades

#### Consulta contextual ("INTELIGENCIA SOBRE ARTÍCULO")
- **QueryForm**: Formulario principal para consultas contextuales sobre PDFs
- **QueryInput**: Campo de consulta con sugerencias y autocompletado
- **QueryExamples**: Ejemplos preconfigurados para consultas comunes
- **FileUpload**: Componente para subida individual y múltiple de PDFs
- **PdfList**: Visualización y gestión de documentos cargados
- **ResultsDisplay**: Visualización de resultados con formato Markdown

#### Artículo de revisión científica
- **ReviewArticleForm**: Interfaz mejorada para generación de artículos de revisión con etiqueta "Beta"
- **SpecificInstructions**: Campo de texto libre para instrucciones detalladas de generación
- **ModelSelector**: Selector de modelos con diálogo informativo sobre cada modelo disponible
- **AdvancedOptions**: Panel rediseñado con controles para temperatura, tokens y otros parámetros
- **StepIndicator**: Indicador visual del proceso de generación
- **LanguageSelector**: Selección ampliada de idiomas (Español, Inglés, Francés, Alemán, Italiano, Portugués)

#### Historial y exportación
- **QueryHistory**: Registro completo del historial de consultas realizadas
- **QueryHistoryFixed**: Panel de historial persistente con funcionalidad de exportación
- **ExportOptions**: Opciones de descarga en formato Markdown, texto y ZIP

---

## 🧠 Implementación avanzada RAG (Retrieval Augmented Generation)

- Basado en [OpenAI Cookbook](https://cookbook.openai.com/examples/file_search_responses).
- Extracción eficiente de contenido PDF mediante embeddings optimizados.
- Búsqueda paralela mejorada para grandes colecciones.
- Generación de resúmenes con referencias bibliográficas precisas.
- Reconocimiento específico de estructura académica y elementos visuales (tablas, figuras).

---

## 📋 Limitaciones del sistema

- Optimizado principalmente para documentos académicos en texto.
- Documentos con ecuaciones complejas, muchas tablas o gráficos visuales pueden no procesarse de forma óptima.
- Documentos extremadamente largos o complejos pueden afectar al rendimiento y coste.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Sigue estos pasos para contribuir:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza los cambios y commits (`git commit -m "añade nueva funcionalidad"`).
4. Envía la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request en GitHub.

---

## 📜 Licencia

Este proyecto está disponible bajo Licencia MIT. Ver [`LICENSE`](LICENSE) para detalles.

---

## 📋 Ejemplos de resúmenes generados

### Ejemplos de contenido generado

- [**Resumen generado con GPT-4o-mini**](examples/sample-abstract-4o-mini.md) - La importancia de la representación de personas con discapacidad para abordar el sesgo implícito en el lugar de trabajo

- [**Artículo de revisión generado con Claude 3.7 Sonnet**](examples/sample-review-claude-sonnet-37.md) - La importancia del capital psicológico en la relación entre orientación religiosa y estrés laboral

## 📧 Contacto y soporte

Si tienes dudas o sugerencias, abre un issue en este repositorio. ¡Responderemos con gusto!

---

<p align="center">
Desarrollado con ❤️ para el análisis avanzado de documentos científicos<br>
(U)Boost scientific paper - Marzo 2025
</p>
