// import React, { useEffect, useState } from 'react';
// import SideBar from '../Component/SideBar';
// import { Box, Button, Card, Grid, TextField, Tooltip, Typography, List, ListItem } from '@mui/material';
// import CardContent from '@mui/material/CardContent';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { styled } from '@mui/system';
// import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
// import Breadcrumbs from '@mui/material/Breadcrumbs';
// import Link from '@mui/material/Link';



// const StyledListItem = styled(ListItem)(({ valid }) => ({
//   color: valid ? 'green !important' : 'red !important',
// }));

// const ListItemStyled = ({ valid, children }) => (
//   <StyledListItem valid={valid}>
//     {valid ? <CheckCircleOutline sx={{ mr: 1 }} /> : <HighlightOff sx={{ mr: 1 }} />}
//     {children}
//   </StyledListItem>
// );

// function ChangePassword(props) { 
//   const baseURL = 'https://staffcentral.azurewebsites.net/api';
//   const navigate = useNavigate();

//   useEffect(() => {
//     const data = sessionStorage.getItem('employeeName');
//     if (!data) {
//       navigate('/');
//     }
//   }, [navigate]);

//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmNewPassword, setConfirmNewPassword] = useState('');
//   const [fieldErrors, setFieldErrors] = useState({
//     oldPassword: '',
//     newPassword: '',
//     confirmNewPassword: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [validations, setValidations] = useState({
//     numeric: false,
//     uppercase: false,
//     lowercase: false,
//     specialChar: false,
//     minLength: false,
//   });

//   const empCode = sessionStorage.getItem('empCode');
//   const role = sessionStorage.getItem('employeeRole');

//   const validatePassword = (password) => {
//     const validations = {
//       numeric: /\d/.test(password),
//       uppercase: /[A-Z]/.test(password),
//       lowercase: /[a-z]/.test(password),
//       specialChar: /[!@#$%^&*()<>/?\])`]/.test(password),
//       minLength: password.length >= 8,
//     };
//     setValidations(validations);
//   };

//   const handleOldPasswordChange = (e) => {
//     setOldPassword(e.target.value);
//     setFieldErrors((prev) => ({ ...prev, oldPassword: '' }));
//   };

//   const handleNewPasswordChange = (e) => {
//     const newPassword = e.target.value;
//     setNewPassword(newPassword);
//     validatePassword(newPassword);
//     setFieldErrors((prev) => ({ ...prev, newPassword: '' }));
//   };

//   const handleConfirmNewPasswordChange = (e) => {
//     setConfirmNewPassword(e.target.value);
//     setFieldErrors((prev) => ({ ...prev, confirmNewPassword: '' }));
//   };

//   const validatePasswords = () => {
//     const errors = {
//       oldPassword: !oldPassword ? 'Current password is required' : '',
//       newPassword: !newPassword ? 'New password is required' : '',
//       confirmNewPassword: !confirmNewPassword ? 'Confirm new password is required' : '',
//     };

//     // Set field errors first
//     setFieldErrors(errors);

//     // Check if there are any missing passwords
//     if (!oldPassword || !newPassword || !confirmNewPassword) {
//       return false;
//     }

//     // Now check if newPassword and confirmNewPassword match
//     if (newPassword !== confirmNewPassword) {
//       setError('Passwords do not match');
//       return false;
//     }

//     // Clear the setError if passwords match
//     setError('');

//     // Return true if there are no field errors
//     return !Object.values(errors).some(error => error);
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validatePasswords() && oldPassword && newPassword && confirmNewPassword) {
//       try {
//         setIsLoading(true);
//         const response = await axios.post(baseURL + '/UserAccount/UpdatePassword', {
//           oldPassword,
//           newPassword,
//           empCode: empCode,
//           modifiedBy: role
//         });

//         if (response.data === 'Update Password Successfully') {
//           sessionStorage.removeItem('employeeName');
//           toast.success('Update Password Successfully, Redirecting To Login page', {
//             position: 'top-center',
//             closeButton: false,
//             autoClose: 2000
//           });
//           setError('');

//           setTimeout(() => {
//             navigate('/');
//           }, 3000); // 2 seconds delay
//         } else {
//           setSuccess('');
//           toast.warning(response.data, {
//             position: 'top-center',
//             closeButton: false
//           });
//         }
//       } catch (err) {
//         setSuccess('');
//         toast.warning(err.response?.data?.message || 'Error changing password', {
//           position: 'top-center',
//           closeButton: false
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   function handleClick(event) {
//     event.preventDefault();
//     console.info('You clicked a breadcrumb.');
//   }

//   return (
//     <Box sx={{display:'flex'}} className="main-container">
//       <ToastContainer />
//       <SideBar />

//       <Box component="main" className="main-content" sx={{ flexGrow: 1,}}>
//       <Box sx={{ flexGrow: 1 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={8}>
//               <Typography className='head-title' component="h1" variant="h6" align="left">
//                  Change Password
//               </Typography>
//               </Grid>
//               <Grid item xs={4} textAlign={'right'}>
//                   <div role="presentation" onClick={handleClick}>
//                   <Breadcrumbs className='breadcrumbs-css' aria-label="breadcrumb" textAlign={'right'} sx={{ mt: 1 }}>
//                   <Link color="inherit" href="/">
//                     Dashboard
//                   </Link>
//                   <Typography color="text.primary">Change Password</Typography>
//                 </Breadcrumbs>
//               </div>
//               </Grid>
//             </Grid>
//           </Box>


//           <Grid component="form" onSubmit={handleSubmit} className='form-input'>
//           <Card sx={{ minWidth: 275 }} className='card-box-css'>
//           {/* <form onSubmit={handleSubmit} className='form-input'> */}
//           <Grid container spacing={0} sx={{mt:0}}> 
//           <Grid item xs={4} sx={{pr:2, pl:3, mt:2}}>
//             <label>Current Password</label>
//           <TextField
//                 className='mt-0'
//                 variant="outlined"
//                 margin="normal"
//                 fullWidth
//                 id="currentPassword"
//                 placeholder="Current Password"
//                 name="oldPassword"
//                 value={oldPassword}
//                 onChange={handleOldPasswordChange}
//                 type="password"
//                 autoComplete="current-password"
//                 error={!!fieldErrors.oldPassword}
//                 helperText={fieldErrors.oldPassword}
//               />

//            </Grid> 

//            <Grid item xs={4} sx={{pr:0, pl:0, mt:2}}>
//            <label>New Password</label>
//            <Tooltip
//                 title={
//                   <List style={{ backgroundColor: 'white', borderRadius: '10px', padding: '1px', boxShadow:'1px 2px 9px #F4AAB9', margin:'-8px' }}>
//                     <ListItemStyled valid={validations.numeric}>
//                       <Typography>Contains at least one numeric.</Typography>
//                     </ListItemStyled>
//                     <ListItemStyled valid={validations.uppercase}>
//                       <Typography>Contains at least one uppercase letter.</Typography>
//                     </ListItemStyled>
//                     <ListItemStyled valid={validations.lowercase}>
//                       <Typography>Contains at least one lowercase letter.</Typography>
//                     </ListItemStyled>
//                     <ListItemStyled valid={validations.specialChar}>
//                     <Typography>
//                       Contains at least one special character.
//                     </Typography>
//                     </ListItemStyled>
//                     <ListItemStyled valid={validations.minLength}>
//                       <Typography>Minimum length of 8 characters.</Typography>
//                     </ListItemStyled>
//                   </List>
//                 }
//                 placement="top"
//                 arrow
//               >
//            <TextField
//                 className='mt-0'
//                 variant="outlined"
//                 margin="normal"
//                 // required
//                 fullWidth
//                 id="newPassword"
//                 placeholder="New Password"
//                 name="password"
//                 value={newPassword}
//                 onChange={handleNewPasswordChange}
//                 type="password"
//                 autoComplete="new-password"
//                 error={!!fieldErrors.newPassword}
//                 helperText={fieldErrors.newPassword}
//               />
//               </Tooltip>
//            </Grid>

//            <Grid item xs={4} sx={{pr:3, pl:2, mt:2}}>
//            <label>Confirm New Password</label>
//            <TextField
//                 className='mt-0'
//                 variant="outlined"
//                 margin="normal"
//                 fullWidth
//                 id="confirmPassword"
//                 placeholder="Confirm New Password"
//                 name="confirmPassword"
//                 value={confirmNewPassword}
//                 onChange={handleConfirmNewPasswordChange}
//                 type="password"
//                 autoComplete="new-password"
//                 error={!!fieldErrors.confirmNewPassword}
//                 helperText={fieldErrors.confirmNewPassword}
//               />


//             </Grid>
//             <Grid item xs={12} sx={{mt:2, mb:3, mr:3}} textAlign={'right'}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 className="primary"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Changing...' : 'Change Password'}
//               </Button>
//               </Grid>
//               {error && <Typography color="error" sx={{ mb: 3,ml:3 }}>{error}</Typography>}
//             </Grid>
//             {/* </form> */}
//           </Card>
//           </Grid>
//       </Box>
//     </Box>
//   );
// }

// export default ChangePassword;
import React, { useEffect, useState } from 'react';
import SideBar from '../Component/SideBar';
import { Box, Button, Card, Grid, TextField, Tooltip, Typography, List, ListItem } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/system';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';



const StyledListItem = styled(ListItem)(({ valid }) => ({
  color: valid ? 'green !important' : 'red !important',
}));

const ListItemStyled = ({ valid, children }) => (
  <StyledListItem valid={valid}>
    {valid ? <CheckCircleOutline sx={{ mr: 1 }} /> : <HighlightOff sx={{ mr: 1 }} />}
    {children}
  </StyledListItem>
);

function ChangePassword(props) {
  const baseURL = 'https://staffcentral.azurewebsites.net/api';
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('employeeName');
    if (!data) {
      navigate('/');
    }
  }, [navigate]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validations, setValidations] = useState({
    numeric: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    minLength: false,
  });

  const empCode = sessionStorage.getItem('empCode');
  const role = sessionStorage.getItem('employeeRole');

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

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
    setFieldErrors((prev) => ({ ...prev, oldPassword: '' }));
  };

  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    validatePassword(newPassword);
    setFieldErrors((prev) => ({ ...prev, newPassword: '' }));
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
    setFieldErrors((prev) => ({ ...prev, confirmNewPassword: '' }));
  };

  const validatePasswords = () => {
    const errors = {
      oldPassword: !oldPassword ? 'Current password is required' : '',
      newPassword: !newPassword ? 'New password is required' : '',
      confirmNewPassword: !confirmNewPassword ? 'Confirm new password is required' : '',
    };

    // Set field errors first
    setFieldErrors(errors);

    // Check if there are any missing passwords
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return false;
    }

    // Now check if newPassword and confirmNewPassword match
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Clear the setError if passwords match
    setError('');

    // Return true if there are no field errors
    return !Object.values(errors).some(error => error);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePasswords() && oldPassword && newPassword && confirmNewPassword) {
      try {
        setIsLoading(true);
        const response = await axios.post(baseURL + '/UserAccount/UpdatePassword', {
          oldPassword,
          newPassword,
          empCode: empCode,
          modifiedBy: empCode
        });

        if (response.data === 'Update Password Successfully') {
          sessionStorage.removeItem('employeeName');
          toast.success('Update Password Successfully, Redirecting To Login page', {
            position: 'top-center',
            closeButton: false,
            autoClose: 2000
          });
          setError('');

          setTimeout(() => {
            navigate('/');
          }, 3000); // 2 seconds delay
        } else {
          setSuccess('');
          toast.warning(response.data, {
            position: 'top-center',
            closeButton: false
          });
        }
      } catch (err) {
        setSuccess('');
        toast.warning(err.response?.data?.message || 'Error changing password', {
          position: 'top-center',
          closeButton: false
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  return (
    <Box sx={{ display: 'flex' }} className="main-container">
      <ToastContainer />
      <SideBar />

      <Box component="main" className="main-content" sx={{ flexGrow: 1, }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography className='head-title' component="h1" variant="h6" align="left">
                Change Password
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign={'right'}>
              <div role="presentation" onClick={handleClick}>
                <Breadcrumbs className='breadcrumbs-css' aria-label="breadcrumb" textAlign={'right'} sx={{ mt: 1 }}>
                  <Link color="inherit" href="/">
                    Dashboard
                  </Link>
                  <Typography color="text.primary">Change Password</Typography>
                </Breadcrumbs>
              </div>
            </Grid>
          </Grid>
        </Box>


        <Grid component="form" onSubmit={handleSubmit} className='form-input'>
          <Card sx={{ width: "500px" }} className='card-box-css'>
            {/* <form onSubmit={handleSubmit} className='form-input'> */}
            <Grid container spacing={0} sx={{ mt: 0 }}>
              <Grid item  xs={12} sx={{ pr: 3, pl: 2, mt: 2 }}>
                <label>Current Password</label>
                <TextField
                  className='mt-0'
                  variant="outlined"
                  margin="normal"
                
                  id="currentPassword"
                  placeholder="Current Password"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                  type="password"
                  autoComplete="current-password"
                  error={!!fieldErrors.oldPassword}
                  helperText={fieldErrors.oldPassword}
                  sx={{ width: '465px' }}
                />

              </Grid>

              <Grid item  xs={12} sx={{ pr: 3, pl: 2, mt: 2 }}>
                <label>New Password</label>
                <Tooltip
                  title={
                    <List style={{ backgroundColor: 'white', borderRadius: '10px', padding: '1px', boxShadow: '1px 2px 9px #F4AAB9', margin: '-8px' }}>
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
                  placement="top"
                  arrow
                >
                  <TextField
                    className='mt-0'
                    variant="outlined"
                    margin="normal"
                    // required
                  
                    id="newPassword"
                    placeholder="New Password"
                    name="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    type="password"
                    autoComplete="new-password"
                    error={!!fieldErrors.newPassword}
                    helperText={fieldErrors.newPassword}
                    sx={{ width: '465px' }}
                  />
                </Tooltip>
              </Grid>

              <Grid item xs={12} sx={{ pr: 3, pl: 2, mt: 2 }}>
                <label>Confirm New Password</label>
                <TextField
                  className='mt-0'
                  variant="outlined"
                  margin="normal"
                
                  id="confirmPassword"
                  placeholder="Confirm New Password"
                  name="confirmPassword"
                  value={confirmNewPassword}
                  onChange={handleConfirmNewPasswordChange}
                  type="password"
                  autoComplete="new-password"
                  error={!!fieldErrors.confirmNewPassword}
                  helperText={fieldErrors.confirmNewPassword}
                  sx={{ width: '465px' }}
                />


              </Grid>
              <Grid item xs={12} sx={{ mt: 2, mb: 3, mr: 3 }} textAlign={'right'}>
                <Button
                  type="submit"
                  variant="contained"
                  className="primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </Grid>
              {error && <Typography color="error" sx={{ mb: 3, ml: 3 }}>{error}</Typography>}
            </Grid>
            {/* </form> */}
          </Card>
        </Grid>
      </Box>
    </Box>
  );
}

export default ChangePassword;
