import React from 'react';
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Header = () => {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          (U)Boost - GRC
        </Typography>
        
        <Stack direction="row" spacing={1}>
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
  );
};

export default Header;
