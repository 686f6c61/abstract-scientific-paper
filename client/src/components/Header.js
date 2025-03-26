import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GavelIcon from '@mui/icons-material/Gavel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SearchIcon from '@mui/icons-material/Search';
import SummarizeIcon from '@mui/icons-material/Summarize';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import TranslateIcon from '@mui/icons-material/Translate';

import ApiKeysConfig from './ApiKeysConfig';
import VersionHistory from './VersionHistory';

const Header = () => {
  const [legalDialogOpen, setLegalDialogOpen] = useState(false);
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);

  const handleOpenLegalDialog = () => {
    setLegalDialogOpen(true);
  };

  const handleCloseLegalDialog = () => {
    setLegalDialogOpen(false);
  };
  
  const handleOpenFaqDialog = () => {
    setFaqDialogOpen(true);
  };

  const handleCloseFaqDialog = () => {
    setFaqDialogOpen(false);
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <RocketLaunchIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              (U)Boost scientific paper
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <ApiKeysConfig />
            <VersionHistory />
            <Button 
              color="inherit"
              onClick={handleOpenFaqDialog}
              aria-label="Preguntas Frecuentes"
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <HelpOutlineIcon />
            </Button>
            <Button 
              color="inherit"
              onClick={handleOpenLegalDialog}
              aria-label="Aviso Legal"
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <GavelIcon />
            </Button>
            <Button 
              color="inherit"
              href="https://github.com/686f6c61/abstract-scientific-paper"
              target="_blank"
              aria-label="GitHub Repository"
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <GitHubIcon />
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Dialog
        open={legalDialogOpen}
        onClose={handleCloseLegalDialog}
        aria-labelledby="legal-dialog-title"
        aria-describedby="legal-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="legal-dialog-title" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
          Aviso legal y descargo de responsabilidad
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="legal-dialog-description" component="div">
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
              Uso ético y responsable
            </Typography>
            <Typography paragraph>
              Esta herramienta ha sido desarrollada exclusivamente con fines educativos, de aprendizaje y de divulgación del conocimiento científico. Su propósito principal es servir como asistente en la investigación académica, facilitando la síntesis de información científica y el análisis de documentos académicos. No está destinada a reemplazar el juicio crítico ni el trabajo intelectual original del investigador.
            </Typography>
            <Typography paragraph>
              Instamos a todos los usuarios a emplear esta aplicación de manera ética, honesta y responsable, respetando siempre los principios de integridad académica y evitando cualquier uso que pueda considerarse plagio o conducta académica inapropiada. La herramienta debe utilizarse como un complemento al proceso de investigación, no como un sustituto de la lectura profunda y el análisis crítico.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', mt: 2 }}>
              Descargo de responsabilidad
            </Typography>
            <Typography paragraph>
              Los desarrolladores, colaboradores y mantenedores de esta aplicación no asumen ni aceptan responsabilidad alguna por el uso indebido, inapropiado o no ético que cualquier usuario pueda hacer de esta herramienta o de los contenidos generados mediante ella. No ofrecemos garantías de ningún tipo, expresas o implícitas, sobre la exactitud, integridad, actualidad, fiabilidad o idoneidad de la información generada.
            </Typography>
            <Typography paragraph>
              Toda síntesis, resumen o artículo producido mediante esta herramienta debe ser minuciosamente revisado, verificado y contrastado por el usuario antes de su utilización o difusión. El usuario es el único responsable de verificar la veracidad y precisión de cualquier información obtenida a través de esta aplicación. Recomendamos encarecidamente contrastar siempre los resultados con las fuentes originales y aplicar el pensamiento crítico.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', mt: 2 }}>
              Propiedad intelectual y derechos de autor
            </Typography>
            <Typography paragraph>
              El usuario tiene la responsabilidad absoluta de respetar las leyes de propiedad intelectual y derechos de autor aplicables en su jurisdicción. Los contenidos generados mediante esta herramienta no están exentos de las normas sobre propiedad intelectual. Cuando se utilicen textos o ideas derivados del uso de esta aplicación en trabajos académicos, publicaciones o cualquier otro tipo de difusión, deberán citarse adecuadamente tanto las fuentes originales como el uso de herramientas de asistencia, siguiendo las normas de citación académica correspondientes (APA, MLA, Vancouver u otras según corresponda).
            </Typography>
            <Typography paragraph>
              La falta de atribución adecuada o el uso indebido de los contenidos generados podrían constituir una infracción de derechos de autor o plagio, con las consecuencias legales y académicas que esto puede conllevar. Instamos a los usuarios a familiarizarse con las políticas de sus instituciones respecto al uso de herramientas de inteligencia artificial en contextos académicos.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', mt: 2 }}>
              Limitación de responsabilidad
            </Typography>
            <Typography paragraph>
              En la máxima medida permitida por la legislación aplicable, los desarrolladores, colaboradores y mantenedores de esta aplicación no serán responsables bajo ninguna circunstancia por daños directos, indirectos, incidentales, especiales, punitivos, consecuentes o ejemplares que puedan derivarse del uso o imposibilidad de uso de esta herramienta, incluyendo pero no limitándose a:
            </Typography>
            <ul>
              <li>
                <Typography paragraph>
                  Cualquier pérdida de datos, información, oportunidades, reputación o beneficios
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  Consecuencias académicas o profesionales derivadas del uso inapropiado de la herramienta
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  Problemas técnicos, interrupciones o fallos en el funcionamiento de la aplicación
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  Decisiones tomadas basándose en información generada por la aplicación
                </Typography>
              </li>
            </ul>
            <Typography paragraph>
              Esta limitación de responsabilidad se aplica independientemente de que los daños surjan del uso o mal uso de la aplicación, de la imposibilidad de utilizarla, o de la confianza depositada en la información obtenida a través de ella, incluso si se ha advertido de la posibilidad de tales daños.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', mt: 2 }}>
              Licencia MIT
            </Typography>
            <Typography paragraph>
              Esta aplicación se distribuye bajo la Licencia MIT, lo que significa que el código fuente está disponible públicamente y puede ser utilizado, modificado y distribuido con pocas restricciones. La Licencia MIT permite el uso del software tanto para fines comerciales como no comerciales, siempre que se incluya el aviso de copyright y el texto de la licencia en todas las copias o partes sustanciales del software.
            </Typography>
            <Typography paragraph sx={{ fontFamily: 'monospace', fontSize: '0.85rem', bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
              Copyright (c) 2025 686f6c61/abstract-scientific-paper<br/><br/>
              Por la presente se concede permiso, libre de cargos, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados (el "Software"), a utilizar el Software sin restricción, incluyendo sin limitación los derechos a usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar, y/o vender copias del Software, y a permitir a las personas a las que se les proporcione el Software a hacer lo mismo, sujeto a las siguientes condiciones:<br/><br/>
              El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del Software.<br/><br/>
              EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O TITULARES DEL COPYRIGHT SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑOS U OTRAS RESPONSABILIDADES, YA SEA EN UNA ACCIÓN DE CONTRATO, AGRAVIO O CUALQUIER OTRO MOTIVO, QUE SURJA DE O EN CONEXIÓN CON EL SOFTWARE O EL USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', mt: 2 }}>
              Modificaciones y actualizaciones
            </Typography>
            <Typography paragraph>
              Los desarrolladores se reservan el derecho de modificar, actualizar o eliminar cualquier parte de esta aplicación o de este aviso legal en cualquier momento y sin previo aviso. Es responsabilidad del usuario revisar periódicamente los términos para estar al tanto de cualquier cambio. El uso continuado de la aplicación después de la publicación de cambios constituirá la aceptación de dichos cambios.
            </Typography>
            
            <Typography paragraph sx={{ fontStyle: 'italic', mt: 3, fontWeight: 'medium' }}>
              Al utilizar esta aplicación, usted reconoce que ha leído, entendido y aceptado este aviso legal en su totalidad. Confirma que utilizará la herramienta bajo su propia responsabilidad, de manera ética y conforme a la legislación aplicable en su jurisdicción.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLegalDialog} variant="contained" color="primary" sx={{ px: 4, py: 1 }}>
            He leído y acepto
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={faqDialogOpen}
        onClose={handleCloseFaqDialog}
        aria-labelledby="faq-dialog-title"
        aria-describedby="faq-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle id="faq-dialog-title" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
          Guía de uso: (U)Boost scientific paper
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="faq-dialog-description" component="div">
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'medium' }}>
              (U)Boost scientific paper es una herramienta integral diseñada para facilitar el trabajo con artículos científicos, ofreciendo tres funcionalidades principales adaptadas a diferentes necesidades de investigación.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Sección 1: Inteligencia sobre Artículos */}
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon /> Inteligencia sobre artículos
            </Typography>
            <Typography paragraph>
              Esta sección permite realizar consultas específicas sobre los artículos científicos seleccionados, funcionando como un asistente de investigación personalizado.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium', ml: 2, mt: 2 }}>
              ¿Qué ofrece?
            </Typography>
            <ul>
              <li>
                <Typography paragraph>
                  <strong>Consultas ilimitadas:</strong> Puedes preguntar cualquier cosa sobre el contenido de los artículos seleccionados, desde metodologías específicas hasta hallazgos clave o comparativas entre diferentes papers.
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Información contextualizada:</strong> Las respuestas se generan basándose únicamente en el contenido de los documentos cargados, lo que garantiza que la información sea relevante y específica.
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Respuestas con referencias:</strong> El sistema proporciona referencias a las secciones específicas de los artículos donde se encuentra la información, facilitando la verificación y profundización.
                </Typography>
              </li>
            </ul>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium', ml: 2, mt: 2 }}>
              Casos de uso ideales:
            </Typography>
            <ul>
              <li>
                <Typography paragraph>
                  Extraer información específica de una colección de artículos sin tener que leerlos por completo
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  Verificar datos puntuales o metodologías descritas en los papers
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  Identificar patrones o tendencias entre diferentes publicaciones científicas
                </Typography>
              </li>
            </ul>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Sección 2: Resumen Estructurado */}
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <SummarizeIcon /> Resumen estructurado
            </Typography>
            <Typography paragraph>
              Esta funcionalidad genera resúmenes comprensivos y estructurados de artículos científicos, organizados en secciones predefinidas para facilitar su comprensión y análisis.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium', ml: 2, mt: 2 }}>
              Estructura del resumen:
            </Typography>
            <ul>
              <li>
                <Typography paragraph>
                  <strong>Información general:</strong> Título, autores, fecha de publicación y revista/conferencia
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Objetivos:</strong> Metas principales y preguntas de investigación abordadas
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Metodología:</strong> Diseño experimental, técnicas empleadas y procedimientos
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Resultados principales:</strong> Hallazgos clave, datos relevantes y observaciones importantes
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Conclusiones:</strong> Interpretaciones, implicaciones y relevancia del estudio
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Limitaciones:</strong> Restricciones metodológicas o conceptuales identificadas
                </Typography>
              </li>
            </ul>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium', ml: 2, mt: 2 }}>
              Beneficios principales:
            </Typography>
            <ul>
              <li>
                <Typography paragraph>
                  Ahorro significativo de tiempo en la revisión de literatura científica
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  Formato consistente que facilita la comparación entre diferentes estudios
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  Identificación rápida de los aspectos más relevantes de cada publicación
                </Typography>
              </li>
            </ul>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Sección 3: Artículo de Revisión Científica */}
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBookIcon /> Artículo de revisión científica
            </Typography>
            <Typography paragraph>
              Esta herramienta avanzada permite sintetizar múltiples artículos científicos en un documento de revisión cohesivo y estructurado, ideal para iniciar investigaciones o crear estados del arte.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium', ml: 2, mt: 2 }}>
              El proceso consta de tres pasos:
            </Typography>
            <ol>
              <li>
                <Typography paragraph>
                  <strong>Selección de artículos:</strong> Elige los documentos que deseas incluir en tu revisión
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Selección de resúmenes:</strong> Revisa y selecciona los resúmenes generados automáticamente
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Generación del artículo:</strong> El sistema crea un documento de revisión completo que integra y analiza todos los resúmenes seleccionados
                </Typography>
              </li>
            </ol>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium', ml: 2, mt: 2 }}>
              Estructura del artículo de revisión:
            </Typography>
            <ul>
              <li>
                <Typography paragraph>
                  <strong>Introducción:</strong> Contexto, relevancia y objetivos de la revisión
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Marco teórico:</strong> Fundamentos conceptuales y teóricos relevantes
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Metodología:</strong> Estrategia de búsqueda y criterios de selección de estudios
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Datos y resultados:</strong> Síntesis organizada de los hallazgos principales
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Discusión y conclusiones:</strong> Interpretación crítica y conclusiones generales
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Evaluación global:</strong> Valoración crítica de la evidencia colectiva
                </Typography>
              </li>
            </ul>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Sección 4: Características Avanzadas */}
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon /> Características avanzadas
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium', ml: 2, mt: 2 }}>
              Selección de modelos de IA:
            </Typography>
            <ul>
              <li>
                <Typography paragraph>
                  <strong>GPT-4o-mini (Rápido):</strong> Óptimo para consultas simples y resúmenes básicos, con tiempos de respuesta más rápidos y menor consumo de tokens.
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>GPT-4o (Avanzado):</strong> Recomendado para análisis complejos y artículos de revisión más detallados, con mayor precisión y profundidad.
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Claude 3.7 Sonnet:</strong> Especializado en síntesis de información científica, con capacidad para manejar estructuras complejas y generar contenido bien organizado.
                </Typography>
              </li>
            </ul>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium', ml: 2, mt: 2 }}>
              Opciones de configuración:
            </Typography>
            <ul>
              <li>
                <Typography paragraph>
                  <strong>Temperatura:</strong> Controla el nivel de creatividad y variabilidad en las respuestas generadas
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Tokens máximos:</strong> Ajusta la extensión de las respuestas según tus necesidades
                </Typography>
              </li>
              <li>
                <Typography paragraph>
                  <strong>Campo de instrucciones específicas:</strong> Permite personalizar las directrices para la generación de contenido
                </Typography>
              </li>
            </ul>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium', ml: 2, mt: 2 }}>
              <TranslateIcon sx={{ mr: 1, fontSize: '1rem', verticalAlign: 'middle' }} />
              Soporte multilingüe:
            </Typography>
            <Typography paragraph sx={{ ml: 2 }}>
              Genera respuestas y documentos en múltiples idiomas: Español, English, Français, Deutsch, Italiano, Português.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium', ml: 2, mt: 2 }}>
              <CodeIcon sx={{ mr: 1, fontSize: '1rem', verticalAlign: 'middle' }} />
              Información de tokens y costes:
            </Typography>
            <Typography paragraph sx={{ ml: 2 }}>
              Monitoriza el uso de tokens y costes estimados para gestionar eficientemente tus recursos.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 2, color: 'primary.contrastText' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Optimiza tu experiencia:
              </Typography>
              <Typography paragraph>
                Para obtener los mejores resultados, recomendamos utilizar documentos PDF bien estructurados, formular preguntas específicas y experimentar con diferentes modelos según la complejidad de tu tarea.
              </Typography>
              <Typography>
                Si necesitas más información, consulta nuestra 
                <Link href="https://github.com/686f6c61/abstract-scientific-paper" target="_blank" sx={{ color: 'white', fontWeight: 'bold', textDecoration: 'underline' }}>
                  documentación completa en GitHub
                </Link>.
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFaqDialog} color="primary" variant="contained">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
