import React from 'react'
import SideBar from './Component/SideBar'
import { Box } from '@mui/material'

function LeaveAppliedReport() {
  return (
    <Box sx={{display:'flex'}} className="main-container">
    <SideBar />
    <Box component="main" className="main-content" sx={{ flexGrow: 1,}}>
    Leave Applied Report
    </Box>

    
  </Box>
  )
}

export default LeaveAppliedReport