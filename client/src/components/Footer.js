import React from 'react';
import { Box, Typography, Container, Chip, Stack } from '@mui/material';
import { usePdf } from '../contexts/PdfContext';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TokenIcon from '@mui/icons-material/Token';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Footer = () => {
  const { totalTokensUsed, inputTokens, outputTokens, totalCostUSD, pdfsProcessed } = usePdf();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ position: 'relative', width: '100%' }}>
          {/* Contador de tokens y costo a la izquierda */}
          <Box sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip 
                icon={<PictureAsPdfIcon fontSize="small" />}
                label={pdfsProcessed}
                color="secondary"
                size="small"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  height: '28px',
                  '& .MuiChip-label': {
                    overflow: 'visible'
                  }
                }}
              />
              <Chip 
                icon={<ArrowDownwardIcon fontSize="small" />}
                label={isNaN(inputTokens) ? "0" : inputTokens.toLocaleString()}
                color="secondary"
                size="small"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  height: '28px',
                  '& .MuiChip-label': {
                    overflow: 'visible'
                  }
                }}
              />
              <Chip 
                icon={<ArrowUpwardIcon fontSize="small" />}
                label={isNaN(outputTokens) ? "0" : outputTokens.toLocaleString()}
                color="secondary"
                size="small"
                sx={{
                  color: 'white',
                  fontWeight: 'medium',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  height: '28px',
                  '& .MuiChip-label': {
                    overflow: 'visible'
                  }
                }}
              />
              <Chip 
                icon={<MonetizationOnIcon fontSize="small" />}
                label={`$${isNaN(totalCostUSD) ? "0.000000" : totalCostUSD.toFixed(6)}`}
                color="secondary"
                size="small"
                sx={{
                  color: 'white',
                  fontWeight: 'medium',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  height: '28px',
                  '& .MuiChip-label': {
                    overflow: 'visible'
                  }
                }}
              />
            </Stack>
          </Box>

          {/* Footer centrado */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" gutterBottom>
              (U)Boost © Abstract Scientific Paper - Marzo 2025
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Licencia MIT - Software de código abierto para uso educativo y académico
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
