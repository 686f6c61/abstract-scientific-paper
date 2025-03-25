import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography
} from '@mui/material';

/**
 * Componente que muestra los indicadores de los pasos del proceso
 */
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Paso 1', description: 'Selección de PDFs' },
    { number: 2, title: 'Paso 2', description: 'Selección de Resúmenes' },
    { number: 3, title: 'Paso 3', description: 'Artículo Generado' }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {steps.map((step) => (
        <Grid item xs={12} sm={6} md={4} key={step.number}>
          <Card elevation={currentStep === step.number ? 3 : 1}>
            <CardContent 
              sx={{ 
                textAlign: 'center',
                bgcolor: currentStep === step.number ? 'primary.main' : 'inherit',
                color: currentStep === step.number ? 'white' : 'inherit',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6">{step.title}</Typography>
              <Typography>{step.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StepIndicator;
