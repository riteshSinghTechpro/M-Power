import React, { useEffect } from 'react';
import SideBar from '../Component/SideBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import "../App.css"
import "../Dashboard.css"
import CardTop from '../Component/Dashboard/CardTop';
import Chart2 from '../Component/Dashboard/Chart2';
import MyPieChart from '../Component/Dashboard/MyPieChart';
import { useLocation, useNavigate } from 'react-router-dom';


export default function Dashboard() {

  const {state} = useLocation();

  const navigate = useNavigate();
  useEffect(() => {
    const data = sessionStorage.getItem('employeeName');
    if (!data) {
      navigate('/');
    } 
  }, [navigate]);




  return (
    <Box className="main-container">
       <SideBar/>
      {/* <SideBar /> */}
      
      <Box component="main" className="main-content">
      <Typography 
       className='head-title'
       variant="h6">
        Dashboard 
      </Typography>

      <CardTop/>
      <Chart2/>
      </Box>

     
   
     
        
   
      
    </Box>
  );
}
