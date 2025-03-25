import React, { useState, useCallback } from 'react';
import { 
  Button, 
  Box, 
  Typography,
  Alert
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { usePdf } from '../contexts/PdfContext';

const FileUpload = () => {
  const { uploadPdf } = usePdf();
  const [uploadError, setUploadError] = useState(null);

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
        }}
      >
        <input {...getInputProps()} />
        <UploadFileIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {isDragActive ? (
            <span>Suelta el archivo aquí</span>
          ) : (
            <span>Arrastra un PDF aquí, o haz clic para seleccionarlo</span>
          )}
        </Typography>
      </Box>
      
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        startIcon={<UploadFileIcon />}
        {...getRootProps()}
      >
        Subir PDF
      </Button>
    </>
  );
};

export default FileUpload;
