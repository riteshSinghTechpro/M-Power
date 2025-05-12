import React from 'react'
import SideBar from './SideBar'
import { Box } from '@mui/material'
function LeaveBalanceReport() {
  return (
    <Box sx={{display:'flex'}} className="main-container">
    <SideBar />
    <Box component="main" className="main-content" sx={{ flexGrow: 1,}}>
    Leave Balance
    </Box>

    
  </Box>
  )
}

export default LeaveBalanceReport