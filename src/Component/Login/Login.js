import React, { useEffect, useState } from 'react';
import "./Login.css"
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
import axios from 'axios';

function Login() {
  const baseURL = 'https://staffcentral.azurewebsites.net/api';


  const navigate = useNavigate();
  useEffect(() => {
    const data = sessionStorage.getItem('employeeName');
    if (data) {
      navigate('/dashboard');
    }
  }, [navigate]);


  const [data, setData] = useState({
    username: "",
    password: ""
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accountEmpCodes, setEmpCodes] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setRememberMe(checked);
    } else {
      setData(values => ({ ...values, [name]: value }));
    }
  };

  useEffect(() => {
    const savedAccountEmpCode = sessionStorage.getItem('username');
    const savedPassword = sessionStorage.getItem('password');
    if (savedAccountEmpCode && savedPassword) {
      setData({
        username: savedAccountEmpCode,
        password: savedPassword
      });
      setRememberMe(true);
    }
  }, []);

  const validateRole = () => {

    if (data.username === '' && data.password === '') {
      setError('Enter The Username and Password.');
      return false;
    }

    if (data.username === '') {
      setError('Username is required');
      return false;
    }
    if (data.password === "") {
      setError('Password is required');
      return false;
    }

    setError('');
    return true;
  };


  const handleSubmit = async (event) => {

    event.preventDefault();
    if (validateRole() && data.username && data.password) {

      try {
        setIsLoading(true);
        const response = await axios.post(baseURL + '/UserLogin/UserLogin', data);
        
        if (response.data[0].status == 1) {
          let name = response.data[0].employeeName;
          let roles = response.data[0].employeeRoles;
          let empcode = response.data[0].empCode;

          sessionStorage.setItem('employeeName', name);
          sessionStorage.setItem('employeeRoles', roles);
          sessionStorage.setItem('empCode', empcode);

          if (rememberMe) {
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('password', data.password);
          } else {
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('password');
          }

          navigate("/dashboard", { state: { empName: name, empRole: roles } });
        } else {
          setError("Username or password is wrong");
        }
      } catch (err) {
        setError('Please check your credentials and try again.');
      
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Grid container className='bg_login' component="main" sx={{ height: '100vh' }}>



      <Grid item xs={12} sm={12} md={12} component={Paper} elevation={12} className='login-bg auth-wrapper' square>
        <Grid>
          <Avatar className='mart-logo main-logocss' alt="Staff Central" src={StaffCentrallogo} />
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
            <span className='sign-in'>Login</span>
          </Typography>

          <Grid component="form" onSubmit={handleSubmit}>

            <Box noValidate sx={{ mt: 1 }}>
              <label>Email Address</label>
              <TextField
                className='inputlogin'
                margin="normal"
                fullWidth
                // id="email"
                // label="User Name"
                name="username"
                value={data.username}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Enter email address"
                autoFocus
              />

              <label>Password</label>
              <TextField
                className='inputlogin'
                margin="normal"
                fullWidth
                name="password"
                value={data.password}
                onChange={handleChange}
                // label="Password"
                type="password"
                // id="password"
                autoComplete="current-password"
                placeholder="Enter Password"
              />

              <Grid container>
                <Grid item xs={6} sx={{ pl: 1, mt: 1 }}>
                  <FormControlLabel
                    className='remember'
                    control={<Checkbox value="remember" checked={rememberMe} onChange={handleChange} color="primary" />}
                    label="Remember me"
                  />
                </Grid>
                <Grid item xs={6} className='login-forgot'>
                  <Link href="#" onClick={() => navigate("/forgotpassword")} variant="body2" className='forgot-password'>
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>

              <Button
                className='sign-bt'
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                // onClick={()=>navigate("/dashboard" )}
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Login'}

              </Button>
              {error && <Typography color="error">{error}</Typography>}
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;

