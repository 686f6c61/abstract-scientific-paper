import React from 'react';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import { PdfContextProvider } from './contexts/PdfContext';
import './App.css';

function App() {
  return (
    <PdfContextProvider>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: 'background.default' 
      }}>
        <Header />
        <Container component="main" sx={{ mt: 4, mb: 4, flex: '1 0 auto' }}>
          <MainContent />
        </Container>
        <Footer />
      </Box>
    </PdfContextProvider>
  );
}

export default App;
