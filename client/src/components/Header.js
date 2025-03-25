import React from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, Box } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const Header = () => {
  return (
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
