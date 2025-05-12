import React, { useState } from 'react';
import SideBar from '../Component/SideBar'
import { Box, Card, Grid, Typography } from '@mui/material'
import TableContainer from '../Component/TableContainer';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

function Master() {

  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }
  
  return (
<Box sx={{display:'flex'}}>
    <SideBar />
    <Box component="main" sx={{ flexGrow: 1, p: 3 , mt:8 }}>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
        <Typography component="h1" variant="h5" align="left" sx={{ mb: 1 }}>
          Master
        </Typography>
        </Grid>
        <Grid item xs={3} textAlign={'right'}>
            <div role="presentation" onClick={handleClick}>
          <Breadcrumbs aria-label="breadcrumb" textAlign={'right'} sx={{ mt: 1 }}>
            <Link underline="hover" color="inherit" href="/">
            Employee Management
            </Link>
            <Typography color="text.primary">Master</Typography>
            
          </Breadcrumbs>
        </div>
        </Grid>
      </Grid>
    </Box>

    <Grid container spacing={2} sx={{ mt:1 }}>
      <Grid item xs={12}>
      
      </Grid>
    </Grid>    
    </Box>
  </Box>
  )
}

export default Master
