import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import FunctionsIcon from '@mui/icons-material/Functions';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BuildIcon from '@mui/icons-material/Build';
import KeyIcon from '@mui/icons-material/Key';
import ArticleIcon from '@mui/icons-material/Article';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import FolderZipIcon from '@mui/icons-material/FolderZip';

const versionHistory = [
  {
    version: "V.09",
    title: "Historial de consultas y bajada en Zip",
    date: "Marzo 2025",
    icon: <HistoryToggleOffIcon />,
    features: [
      "Registro completo del historial de consultas realizadas",
      "Interfaz para visualizar consultas anteriores",
      "Descarga de todos los resultados en formato ZIP",
      "Organización automática de archivos por tipo y fecha"
    ],
    highlight: true
  },
  {
    version: "V.08",
    title: "Gestión de API Keys",
    date: "Marzo 2025",
    icon: <KeyIcon />,
    features: [
      "Interfaz gráfica para configurar claves API de OpenAI y Anthropic",
      "Validación en tiempo real de las API Keys",
      "Indicador visual del estado de configuración",
      "Almacenamiento seguro en archivo .env local"
    ],
    highlight: false
  },
  {
    version: "V.07",
    title: "Descarga de datos",
    date: "Marzo 2025",
    icon: <CloudDownloadIcon />,
    features: [
      "Exportación de resúmenes y artículos en formato Markdown",
      "Botones de descarga integrados en la interfaz",
      "Conservación del formato y estructura en los archivos exportados"
    ]
  },
  {
    version: "V.06",
    title: "Funciones avanzadas de modelos",
    date: "Marzo 2025",
    icon: <FunctionsIcon />,
    features: [
      "Control de parámetros avanzados: temperatura, max_tokens, top_p",
      "Opciones de idioma para generación de contenido",
      "Instrucciones específicas para personalizar generación"
    ]
  },
  {
    version: "V.05",
    title: "Modelos avanzados",
    date: "Marzo 2025",
    icon: <AutoAwesomeIcon />,
    features: [
      "Integración con GPT-4o y GPT-4o-mini",
      "Soporte para Claude 3.7 Sonnet",
      "Selección de modelo según necesidades y presupuesto"
    ]
  },
  {
    version: "V.04",
    title: "Artículo de revisión científica",
    date: "Marzo 2025",
    icon: <DescriptionIcon />,
    features: [
      "Generación de artículos de revisión completos",
      "Análisis y síntesis de múltiples documentos",
      "Secciones configurables y formato académico"
    ]
  },
  {
    version: "V.03",
    title: "Resumen estructurado",
    date: "Marzo 2025",
    icon: <SummarizeIcon />,
    features: [
      "Generación de resúmenes con estructura académica",
      "Secciones detalladas: metodología, resultados, referencias",
      "Formato académico profesional"
    ]
  },
  {
    version: "V.02",
    title: "Multi-PDF",
    date: "Marzo 2025",
    icon: <ArticleIcon />,
    features: [
      "Procesamiento de múltiples documentos PDF simultáneamente",
      "Análisis cruzado de información",
      "Interfaz para selección y gestión de archivos"
    ]
  },
  {
    version: "V.01",
    title: "Consulta sobre artículo",
    date: "Marzo 2025",
    icon: <BuildIcon />,
    features: [
      "Primera versión con consultas contextuales",
      "Procesamiento básico de documentos PDF",
      "Interfaz simple para preguntas y respuestas"
    ]
  }
];

const VersionHistory = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button 
        color="inherit"
        onClick={handleOpenDialog}
        aria-label="Historial de versiones"
        sx={{ minWidth: 'auto', p: 1 }}
      >
        <HistoryIcon />
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon /> Historial de versiones
        </DialogTitle>
        
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            Evolución de (U)Boost Scientific Paper a lo largo del tiempo
          </Typography>
          
          <List sx={{ mt: 2 }}>
            {versionHistory.map((version, index) => (
              <React.Fragment key={version.version}>
                <ListItem alignItems="flex-start" sx={{ 
                  mb: 2, 
                  p: 2, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: version.highlight ? 'primary.light' : 'divider',
                  bgcolor: version.highlight ? 'primary.50' : 'transparent'
                }}>
                  <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      backgroundColor: 'primary.main', 
                      color: 'white', 
                      width: 48, 
                      height: 48, 
                      borderRadius: '50%',
                      mb: 1
                    }}>
                      {version.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {version.version}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {version.date}
                    </Typography>
                    {version.highlight && (
                      <Chip 
                        size="small" 
                        icon={<NewReleasesIcon />} 
                        label="Nuevo" 
                        color="primary" 
                        sx={{ mt: 1, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {version.title}
                      </Typography>
                    }
                    secondary={
                      <Box component="div">
                        {version.features.map((feature, i) => (
                          <Typography key={i} variant="body2" color="text.secondary" sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            mb: 0.5
                          }}>
                            <Box 
                              component="span" 
                              sx={{ 
                                display: 'inline-block', 
                                width: 4, 
                                height: 4, 
                                borderRadius: '50%', 
                                bgcolor: 'primary.main', 
                                mr: 1 
                              }} 
                            />
                            {feature}
                          </Typography>
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
                {index < versionHistory.length - 1 && (
                  <Box 
                    sx={{ 
                      height: 20, 
                      ml: 7.5, 
                      borderLeft: '2px dashed',
                      borderColor: 'primary.light' 
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VersionHistory;
