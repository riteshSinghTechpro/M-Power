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
import { Avatar, ListItem, Tooltip,List } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/system';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';

const StyledListItem = styled(ListItem)(({ valid }) => ({
  color: valid ? 'green !important' : 'red !important',
}));

const ListItemStyled = ({ valid, children }) => (
  <StyledListItem valid={valid}>
    {valid ? <CheckCircleOutline sx={{ mr: 1 }} /> : <HighlightOff sx={{ mr: 1 }} />}
    {children}
  </StyledListItem>
);


function Resetpassword() {
  const baseURL = 'https://staffcentral.azurewebsites.net/api';

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [otp, setOtp] = useState('');
    const [empCode, setEmpcode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
      otp: '',
      newPassword: '',
      confirmPassword: '',
    });

    const [validations, setValidations] = useState({
      numeric: false,
      uppercase: false,
      lowercase: false,
      specialChar: false,
      minLength: false,
    });
    

    const  navigate = useNavigate()

    const handleOTP = (e) => {
      setOtp(e.target.value);
      setFieldErrors((prev) => ({ ...prev, otp: '' }));
    };

    const handlePasswordChange = (e) => {
        const password =e.target.value;
        setNewPassword(password);
        validatePassword(password);
        setFieldErrors((prev) => ({ ...prev, newPassword: '' }));
      
    };

    const validatePassword = (password) => {
      const validations = {
        numeric: /\d/.test(password),
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        specialChar: /[!@#$%^&*()<>/?\])`]/.test(password),
        minLength: password.length >= 8,
      };
      setValidations(validations);
    };


    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value);
      setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
    };

   
    const location = useLocation();
    const { mailOTP, eCode } = location.state || {};


    const validatePasswords = () => {

      const errors = {
        otp: !otp ? 'OTP is required' : '',
        newPassword: !newPassword ? 'New password is required' : '',
        confirmPassword: !confirmPassword ? 'Confirm new password is required' : '',
      };
  
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      if (otp=="") {
        setError('OTP is required');
        return false;
      }
      if (otp !== mailOTP) {
        setError('OTP do not match');
        return false;
      }
      
      setFieldErrors(errors);
      
      return !Object.values(errors).some(error => error);

    };


    
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validatePasswords() && otp && newPassword && confirmPassword) {
        try {
          setIsLoading(true);
          const response = await axios.post(baseURL+'/ForgotPassword/reset-password', {
            empCode:eCode,
            newPassword,
          });
          
          if (response.data === 'Password reset successfully.') {
            toast.success(response.data, {
              position: 'top-center',
              closeButton: false,
            });
            setTimeout(() => {
              navigate('/')
            }, 5000)
           
          } else {
            setSuccess('');
            setError(response.data|| 'Failed to reset password');
          }
        } catch (err) {
          setSuccess('');
          setError(err.response?.data?.message || 'Error reseting password');
        }finally{
          setIsLoading(false)
        }
      }
    };

  
  return (
    <Grid container className='bg_login' component="main" sx={{ height: '100vh' }}>   
    <ToastContainer/>
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
          <span className='sign-in'>Reset Password</span>
        </Typography>
   
          <Grid component="form" onSubmit={handleSubmit}>
        
        <Box  className='forgotpassword'>
         <label>OTP</label>
          <TextField
          className='inputlogin'
            margin="normal"
            fullWidth
            // id="otp"
            // label="Enter OTP"
             placeholder="Enter OTP"
            value={otp}
            onChange={handleOTP}
            name="otp"
            autoComplete="otp"
            autoFocus
            error={!!fieldErrors.otp}
            helperText={fieldErrors.otp}
          />

            <Tooltip
                title={
                  <List style={{ backgroundColor:'white', borderRadius: '10px', padding: '1px', boxShadow:'1px 2px 9px #F4AAB9', margin:'-8px' }}>
                    <ListItemStyled valid={validations.numeric}>
                      <Typography>Contains at least one numeric.</Typography>
                    </ListItemStyled>
                    <ListItemStyled valid={validations.uppercase}>
                      <Typography>Contains at least one uppercase letter.</Typography>
                    </ListItemStyled>
                    <ListItemStyled valid={validations.lowercase}>
                      <Typography>Contains at least one lowercase letter.</Typography>
                    </ListItemStyled>
                    <ListItemStyled valid={validations.specialChar}>
                    <Typography>
                      Contains at least one special character.
                    </Typography>
                    </ListItemStyled>
                    <ListItemStyled valid={validations.minLength}>
                      <Typography>Minimum length of 8 characters.</Typography>
                    </ListItemStyled>
                  </List>
                }
                placement="left"
                arrow
              >
          <label>New Password</label>
          <TextField
          className='inputlogin'
            margin="normal"
            fullWidth
            // id="new_password"
            // label="New Password"
             placeholder="Enter New Password"
            name="newpassword"
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            autoComplete="newpassword"
            autoFocus
            error={!!fieldErrors.newPassword}
            helperText={fieldErrors.newPassword}
          />
          </Tooltip>

          <label>Confirm Password</label>
          <TextField
          className='inputlogin'
            margin="normal"
            fullWidth
            // id="confirmpassword"
            // label="Confirm Password"
            placeholder="Confirm Password"
            name="confirmpassword"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="confirmpassword"
            autoFocus
            error={!!fieldErrors.confirmPassword}
            helperText={fieldErrors.confirmPassword}
          />
          <Button 
            className='sign-bt mt-30'
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            // onClick={()=>navigate("/" )}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              {success && <Typography sx={{ color: 'green', mt: 2 }}>{success}</Typography>}
          {/* <Grid className='backtologin'>
          <Link href="#" onClick={()=>navigate("/")}>
             <ArrowBackIosOutlinedIcon /> Back to Login
          </Link>
          </Grid> */}
        
        </Box>
        </Grid>
       
      </Box>
    </Grid>
  </Grid>
  )
}

export default Resetpassword
