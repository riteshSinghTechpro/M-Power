import React from 'react'
import SideBar from '../Component/SideBar'
import { Box, Typography } from '@mui/material'

function PersonalDetails() {
  return (
    <Box sx={{display:'flex'}}>
    <SideBar />
    <Box component="main" sx={{ flexGrow: 1, p: 3 ,marginTop:"55px"}}>
      
    <Typography variant='h4'>
       Personal Details
    </Typography>

    </Box>
  </Box>
  )
}

export default PersonalDetails
