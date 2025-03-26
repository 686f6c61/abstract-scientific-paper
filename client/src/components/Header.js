import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GavelIcon from '@mui/icons-material/Gavel';

const Header = () => {
  const [legalDialogOpen, setLegalDialogOpen] = useState(false);

  const handleOpenLegalDialog = () => {
    setLegalDialogOpen(true);
  };

  const handleCloseLegalDialog = () => {
    setLegalDialogOpen(false);
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
    </>
  );
};

export default Header;
