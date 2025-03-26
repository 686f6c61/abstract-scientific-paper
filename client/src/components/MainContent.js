import React, { useState } from 'react';
import { 
  Grid, 
  Paper, 
  Box, 
  Typography, 
  Tabs, 
  Tab,
  Alert,
  Backdrop,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SummarizeIcon from '@mui/icons-material/Summarize';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PdfList from './PdfList';
import FileUpload from './FileUpload';
import QueryForm from './QueryForm';
import ReviewArticleForm from './ReviewArticle';
import ResultsDisplay from './ResultsDisplay';
import { usePdf } from '../contexts/PdfContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MainContent = () => {
  const [tabValue, setTabValue] = useState(0);
  const { 
    loading, 
    error, 
    searchResults, 
    summary,
    queryLoading,
    summaryLoading,
    reviewArticleLoading,
    batchProcessing,
    clearSearchResults,
    clearSummary,
    clearReviewArticle
  } = usePdf();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0 && searchResults) {
      clearSearchResults();
    }
    if (newValue === 1 && summary) {
      clearSummary();
    }
    if (newValue === 2) {
      clearReviewArticle();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading || queryLoading || summaryLoading || reviewArticleLoading || batchProcessing}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - PDF Management */}
        <Grid item xs={12} md={3}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PictureAsPdfIcon fontSize="small" />
              Artículos
            </Typography>
            <FileUpload />
            <PdfList />
          </Paper>
        </Grid>

        {/* Right Column - Query and Results */}
        <Grid item xs={12} md={9}>
          <Paper elevation={1} sx={{ p: 0 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                aria-label="query tabs"
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    py: 2,
                  },
                }}
              >
                <Tab 
                  icon={<SearchIcon />}
                  iconPosition="start"
                  label={<Typography sx={{ textTransform: 'uppercase', fontWeight: 'medium' }}>Inteligencia Sobre Artículo</Typography>} 
                  id="simple-tab-0" 
                />
                <Tab 
                  icon={<SummarizeIcon />}
                  iconPosition="start"
                  label={<Typography sx={{ textTransform: 'uppercase', fontWeight: 'medium' }}>Resumen Estructurado</Typography>} 
                  id="simple-tab-1" 
                />
                <Tab 
                  icon={<MenuBookIcon />}
                  iconPosition="start"
                  label={<Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ textTransform: 'uppercase', fontWeight: 'medium' }}>Artículo de Revisión Científica</Typography>
                    <Box sx={{ ml: 1, px: 0.7, py: 0.2, bgcolor: 'warning.main', borderRadius: 1, fontSize: '0.7rem', color: 'white', fontWeight: 'bold' }}>Beta</Box>
                  </Box>} 
                  id="simple-tab-2" 
                />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <QueryForm isSimpleQuery={true} />
              {searchResults && <ResultsDisplay type="query" data={searchResults} />}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <QueryForm isSimpleQuery={false} />
              {summary && <ResultsDisplay type="summary" data={summary} />}
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <ReviewArticleForm />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainContent;
