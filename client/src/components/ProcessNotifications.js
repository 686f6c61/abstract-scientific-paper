import React, { useState, useEffect } from 'react';
import {
  Box,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  Chip,
  Button,
  ListItemSecondaryAction,
  CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CloseIcon from '@mui/icons-material/Close';
import { useProcess } from '../contexts/ProcessContext';

// Componente para mostrar notificaciones de procesos en segundo plano
const ProcessNotifications = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  
  const { 
    activeProcesses, 
    processNotifications, 
    processCounts, 
    cancelProcess,
    isRecovering,
    PROCESS_TYPES
  } = useProcess();

  // Actualizar contador del badge cuando cambien procesos o notificaciones
  useEffect(() => {
    const total = Object.values(processCounts).reduce((sum, count) => sum + count, 0) +
                 processNotifications.filter(n => n.type === 'error').length;
    setBadgeCount(total);
  }, [processCounts, processNotifications]);

  // Función para obtener el nombre legible del tipo de proceso
  const getProcessTypeName = (processType) => {
    const typeNames = {
      [PROCESS_TYPES.ARTICLE_INTELLIGENCE]: 'Inteligencia sobre artículo',
      [PROCESS_TYPES.STRUCTURED_SUMMARY]: 'Resumen estructurado',
      [PROCESS_TYPES.REVIEW_ARTICLE]: 'Artículo de revisión científica',
      [PROCESS_TYPES.BATCH_SUMMARY]: 'Procesamiento por lotes'
    };
    
    return typeNames[processType] || processType;
  };

  // Obtener icono según el estado del proceso
  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <CircularProgress size={20} />;
      case 'pending':
        return <HourglassEmptyIcon color="primary" />;
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'cancelled':
        return <CancelIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  // Formatear tiempo relativo
  const getRelativeTime = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `hace ${seconds} seg`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return `hace ${days} d`;
  };

  return (
    <>
      {/* Botón de notificaciones con badge */}
      <Tooltip title="Procesos en segundo plano">
        <IconButton 
          color="inherit" 
          onClick={() => setDrawerOpen(true)}
          sx={{ position: 'relative' }}
        >
          <Badge 
            badgeContent={badgeCount} 
            color={processNotifications.some(n => n.type === 'error') ? "error" : "primary"}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      
      {/* Drawer para mostrar procesos y notificaciones */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 350, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Procesos en segundo plano
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {isRecovering && (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" align="center">
                <CircularProgress size={20} sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recuperando procesos...
              </Typography>
            </Box>
          )}
          
          {/* Sección de procesos activos */}
          {activeProcesses.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                Procesos activos ({activeProcesses.length})
              </Typography>
              <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
                {activeProcesses.map((process) => (
                  <ListItem key={process.id}>
                    <ListItemIcon>
                      {getStatusIcon(process.status)}
                    </ListItemIcon>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flexGrow: 1 }}>
                      <Box component="div" sx={{ fontWeight: 500 }}>
                        {getProcessTypeName(process.type)}
                      </Box>
                      <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box component="div" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {process.message || `Estado: ${process.status}`}
                        </Box>
                        <Box component="div" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {getRelativeTime(process.lastUpdated || process.timestamp)}
                        </Box>
                      </Box>
                    </Box>
                    {(process.status === 'running' || process.status === 'pending') && (
                      <ListItemSecondaryAction>
                        <Tooltip title="Cancelar proceso">
                          <IconButton 
                            edge="end" 
                            size="small"
                            onClick={() => cancelProcess(process.id)}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
              </List>
            </>
          )}
          
          {/* Sección de notificaciones */}
          {processNotifications.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                Notificaciones recientes
              </Typography>
              <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                {processNotifications.map((notification) => (
                  <ListItem key={notification.id}>
                    <ListItemIcon>
                      {notification.type === 'error' && <ErrorIcon color="error" />}
                      {notification.type === 'success' && <CheckCircleIcon color="success" />}
                      {notification.type === 'info' && <InfoIcon color="info" />}
                      {notification.type === 'warning' && <CancelIcon color="warning" />}
                    </ListItemIcon>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flexGrow: 1 }}>
                      <Box component="div" sx={{ fontWeight: 500 }}>
                        {notification.message}
                      </Box>
                      <Box component="div" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {getRelativeTime(notification.timestamp)}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </>
          )}
          
          {/* Mensaje cuando no hay procesos ni notificaciones */}
          {activeProcesses.length === 0 && processNotifications.length === 0 && !isRecovering && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No hay procesos activos ni notificaciones recientes.
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default ProcessNotifications;
