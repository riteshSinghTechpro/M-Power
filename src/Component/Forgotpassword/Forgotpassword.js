import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Loginsideimage from '../../images/womanbanner.jpg';
import StaffCentrallogo from '../../images/StaffCentral.png'; // Import your image file
import { Avatar } from '@mui/material';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import axios from 'axios';

function Forgotpassword() {
  const baseURL = 'https://staffcentral.azurewebsites.net/api';
    const  navigate = useNavigate()
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleEmail = (e) => {
      setEmail(e.target.value);
    };
    const validateEmail = () => {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email=="") {
        setError('Email address is required.');
        return false;
      }
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return false;
      }
    
      setError("");
      return true;
    };
  
    const handleSubmit = async (e) => {

      e.preventDefault();
      
      if (validateEmail() && email) {
        try {
          setIsLoading(true);
          const response = await axios.post(baseURL+'/ForgotPassword/forgot-password', {
           email,
          });
          if (response.data.otp) {
            let mOTP=response.data.otp;
            let empcode=response.data.empCode;
            navigate('/resetpassword', {
              state: { mailOTP: mOTP, eCode:empcode}
            });
          } else {
            setSuccess('');
            setError("Email id do not match");
          }
        } catch (err) {
          setSuccess('');
          setError('Email id do not match');
        }finally{
          setIsLoading(false);
        }
      }
    };

  return (
    <Grid container className='bg_login' component="main" sx={{ height: '100vh' }}>   
    <CssBaseline />



    <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} className='login-bg auth-wrapper' square>
    <Grid>
      <Avatar className='mart-logo main-logocss' alt="Online Mart" src={StaffCentrallogo}/>
    </Grid>
      <Box
        sx={{
          my: 4,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
        }}
      >
   
      
        <Typography component="h1" variant="h4"> 
          <span className='sign-in'>Forgot Password</span>
        </Typography>
     
        <Grid component="form" className='wt-100'  onSubmit={handleSubmit}>
          <label>Email Address</label>
        <Box className='forgotpassword'>
          <TextField
            className='inputlogin'
            margin="normal"
            fullWidth
            // id="email"
            // label="Youremail@gmail.com"
            name="email"
            onChange={handleEmail}
            autoComplete="email"
            placeholder="Enter email address"
            autoFocus
          />
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success">{success}</Typography>}
          <Button 
            className='sign-bt mt-30'
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            // onChange={handleSubmit}
            // onClick={()=>navigate("/resetpassword" )}
          >
           {isLoading ? 'Sending...' : 'Send Mail'}
          </Button>
        
          <Grid className='backtologin'>
          <Link href="#" onClick={()=>navigate("/")}>
             Back to Login
          </Link>
          </Grid>
          </Box>

          </Grid>
           
       
      </Box>
    </Grid>
  </Grid>
  )
}

export default Forgotpassword
