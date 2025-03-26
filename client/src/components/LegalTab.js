import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const LegalTab = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          AVISO LEGAL
        </Typography>
        
        <Typography variant="h5" mt={3} mb={2} color="primary">
          Licencia MIT para Educación
        </Typography>
        <Typography paragraph>
          Copyright (c) 2025 (U)Boost scientific paper
          
          Por la presente se concede permiso, libre de cargos, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados, a utilizar el Software sin restricción, incluyendo sin limitación los derechos a usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar, y/o vender copias del Software, y a permitir a las personas a las que se les proporcione el Software a hacer lo mismo, sujeto a las siguientes condiciones:
          
          El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del Software.
          
          EL SOFTWARE SE PROPORCIONA "COMO ESTÁ", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O TITULARES DEL COPYRIGHT SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑOS U OTRAS RESPONSABILIDADES, YA SEA EN UNA ACCIÓN DE CONTRATO, AGRAVIO O CUALQUIER OTRO MOTIVO, QUE SURJA DE O EN CONEXIÓN CON EL SOFTWARE O EL USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.
        </Typography>
        
        <Typography variant="h5" mt={4} mb={2} color="primary">
          Descargo de Responsabilidad
        </Typography>
        <Typography paragraph>
          El usuario asume toda la responsabilidad por el contenido generado a través de este sistema. La información, análisis y contenidos producidos reflejan las entradas proporcionadas por el usuario y no representan la opinión o posición de los desarrolladores del sistema.
        </Typography>
        <Typography paragraph>
          El usuario se compromete a utilizar esta herramienta exclusivamente para fines éticos y educativos legítimos. Queda prohibido el uso de este sistema para:
        </Typography>
        <Box component="ul" sx={{ pl: 4, mb: 3 }}>
          <li>Actividades que puedan violar derechos de autor o propiedad intelectual</li>
          <li>Generación de contenido falso o engañoso con intención de desinformar</li>
          <li>Cualquier propósito que pueda entrar en conflicto con políticas educativas establecidas</li>
          <li>Actividades que puedan causar daño o perjuicio a terceros</li>
        </Box>
        <Typography 
          paragraph 
          fontWeight="bold" 
          sx={{ 
            p: 2, 
            bgcolor: 'rgba(0, 0, 0, 0.04)', 
            borderRadius: 1, 
            border: `1px solid rgba(25, 118, 210, 0.12)`,
            color: 'text.primary'
          }}
        >
          El uso de esta herramienta implica la aceptación de estos términos y condiciones. Los desarrolladores no se hacen responsables del mal uso que pueda hacerse de esta tecnología.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LegalTab;
