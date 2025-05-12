import React, { useState } from 'react';
import SideBar from '../Component/SideBar'
import { Box, Card, Grid, Typography } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import UserRoleAccessTable from '../Component/UserRoleAccessTable';
import MultiLevelMenu from '../Component/MultiLevelMenu';

function UserRoleAccess() {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false); 
  };

  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  return (
    <Box sx={{display:'flex'}} className="main-container">
    <SideBar /> 
    <Box component="main" className="main-content" sx={{ flexGrow: 1,}}>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
        <Typography className='head-title' component="h1" variant="h6" align="left">
        User Role Access
        </Typography>
        </Grid>
        <Grid item xs={4} textAlign={'right'}>
            <div role="presentation" onClick={handleClick}>
            <Breadcrumbs className='breadcrumbs-css' aria-label="breadcrumb" textAlign={'right'} sx={{ mt: 1 }}>
            <Link underline="hover" color="inherit" href="/">
            Role Management
            </Link>
            <Typography color="text.primary">User Role Access</Typography>
          </Breadcrumbs>
        </div>
        </Grid>
      </Grid>
    </Box>

    <Grid container spacing={2} sx={{ mt:0 }}>
    <Grid item xs={12} className='pdt-0'>
      
      <UserRoleAccessTable/>
      
      </Grid>
    </Grid>    
    </Box>
  </Box>
  )
}

export default UserRoleAccess
