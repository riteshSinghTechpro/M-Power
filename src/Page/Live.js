import React from 'react'
import SideBar from '../Component/SideBar'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
const Live = () => {
  return (
    <Box sx={{display:'flex'}}>
    <SideBar />
    <Box component="main" sx={{ flexGrow: 1, p: 3 ,marginTop:"55px"}}>
      
      <Typography variant='h4'>
      Live
      </Typography>

    </Box>
  </Box>
  )
}

export default Live