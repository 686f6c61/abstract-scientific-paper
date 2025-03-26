import React, { useState, useCallback } from 'react';
import { 
  Button, 
  Box, 
  Typography,
  Alert,
  Stack
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { usePdf } from '../contexts/PdfContext';

const FileUpload = () => {
  const { uploadPdf, selectAllPdfs } = usePdf();
  const [uploadError, setUploadError] = useState(null);
  
  const handleSelectAll = () => {
    selectAllPdfs();
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploadError(null);
    
    // Check if files are PDFs
    const nonPdfFiles = acceptedFiles.filter(file => !file.type.includes('pdf'));
    if (nonPdfFiles.length > 0) {
      setUploadError('Solo se permiten archivos PDF');
      return;
    }
    
    // Upload each file
    try {
      for (const file of acceptedFiles) {
        await uploadPdf(file);
      }
    } catch (error) {
      setUploadError('Error al subir el archivo: ' + error.message);
    }
  }, [uploadPdf]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  return (
    <>
      {uploadError && (
        <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }} onClose={() => setUploadError(null)}>
          {uploadError}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 1,
            p: 2,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'primary.light' : 'background.paper',
            '&:hover': {
              bgcolor: 'grey.50',
              borderColor: 'primary.light',
            },
            width: '90%',
            maxWidth: '500px'
          }}
        >
          <input {...getInputProps()} />
          <UploadFileIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            {isDragActive ? (
              <span>Suelta el archivo aquí</span>
            ) : (
              <>
                <span>Arrastra un</span>
                <PictureAsPdfIcon sx={{ fontSize: '1rem', color: 'primary.main', mx: 0.5 }} />
                <span>Artículo aquí, o haz clic para seleccionarlo</span>
              </>
            )}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button
          variant="contained"
          fullWidth
          sx={{ mb: 1, maxWidth: '350px' }}
          startIcon={<UploadFileIcon />}
          {...getRootProps()}
        >
          Subir Artículo
        </Button>
        
        <Button
          variant="outlined"
          fullWidth
          sx={{ maxWidth: '350px' }}
          startIcon={<SelectAllIcon />}
          onClick={handleSelectAll}
        >
          Seleccionar todos
        </Button>
      </Box>
    </>
  );
};

export default FileUpload;
