# 🚀 (U)Boost - Abstract Scientific Paper 📝✨

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![OpenAI](https://img.shields.io/badge/OpenAI-API-7A2723?logo=openai)
![Anthropic](https://img.shields.io/badge/Anthropic-Claude-623CE4?logo=anthropic)

**(U)Boost - Abstract Scientific Paper** es una potente aplicación web para procesar, analizar y generar resúmenes estructurados a partir de artículos científicos en formato PDF. Utiliza tecnología RAG (Retrieval Augmented Generation) junto a modelos avanzados de OpenAI (GPT-4o, GPT-4o-mini) y Anthropic (Claude 3.7 Sonnet 2025), proporcionando análisis detallados y precisos con una interfaz moderna y amigable basada en Material-UI.

<p align="center">
  <b>Sistema avanzado de procesamiento y resumen de documentos científicos con tecnología RAG</b>
</p>

---

## 🔥 Características principales

- 📚 **Gestión avanzada de PDFs**
  - Carga rápida y sencilla de documentos PDF.
  - Visualización de documentos subidos.
  - Selección individual o múltiple para análisis específico.

- 🔍 **Búsqueda semántica inteligente**
  - Consultas contextuales basadas en significado, no solo palabras clave.
  - Resultados precisos con referencias directas a las fuentes originales.

- 📝 **Generación de resúmenes estructurados**
  - Organización clara según normas académicas.
  - Títulos adaptados a normas RAE.
  - Referencias APA con formato "Recuperado de [enlace]".
  - Soporte multilenguaje: Español, Inglés, Francés, Alemán, Italiano, Portugués.
  - Visualización de tablas Markdown correctamente formateadas.

- 📊 **Análisis de uso y costes**
  - Contador en tiempo real de PDFs procesados por sesión.
  - Seguimiento en vivo del consumo total de tokens.
  - Cálculo automático de costes basado en modelo usado (GPT-4o, GPT-4o-mini, Claude 3.7 Sonnet 2025).

- ⚙️ **Opciones avanzadas de IA**
  - **Tokens máximos:** Controla la longitud máxima del contenido generado.
  - **Temperatura (0-2):** Ajusta la creatividad de las respuestas (0.7 recomendado).
  - **Top P (0-1):** Diversidad léxica (0.9-1 recomendado).
  - **Penalización frecuencia (-2 a 2):** Evita repetición de frases.
  - **Penalización presencia (-2 a 2):** Evita repetición de temas.

- 💾 **Opciones de exportación**
  - Descarga en formato Markdown (.md) y texto plano (.txt).
  - Copia rápida directa al portapapeles.

- 🎨 **Interfaz moderna y amigable**
  - Diseño intuitivo y responsive con Material-UI.
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
- Anthropic API (Claude 3.7 Sonnet 2025)
- Multer (middleware subida PDFs)
- PDF.js (procesamiento PDFs)

---

## 🚀 Instalación y ejecución

### 🔧 Requisitos previos
- Node.js v18+
- npm o yarn
- Claves API de OpenAI y Anthropic

### 🛠️ Instalación rápida
```bash
git clone https://github.com/686f6c61/abstract-scientific-paper.git
cd abstract-scientific-paper
npm install
```

### ⚙️ Configuración de variables de entorno
Crear archivo `.env` en `/server` basado en `.env.example`:
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### ▶️ Ejecución de la aplicación
```bash
npm start
```
- Frontend React: `http://localhost:3000`
- Backend Express: `http://localhost:5000`

---

## 📂 Estructura del proyecto

```
📁 abstract-scientific-paper
├── 📁 client
│   ├── 📁 src
│   │   ├── 📁 components   # Componentes React
│   │   ├── 📁 contexts     # Gestión de estados globales
│   │   └── 📁 utils        # Utilidades frontend
│
└── 📁 server
    ├── 📁 controllers      # Controladores API
    ├── 📁 routes           # Rutas y endpoints API
    ├── 📁 utils            # Procesamiento PDFs y prompts
    └── 📁 uploads          # PDFs cargados
```

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

## 📧 Contacto y soporte

Si tienes dudas o sugerencias, abre un issue en este repositorio. ¡Responderemos con gusto!

---

<p align="center">
Desarrollado con ❤️ para el análisis avanzado de documentos científicos<br>
(U)Boost © Abstract Scientific Paper - Marzo 2025
</p>
