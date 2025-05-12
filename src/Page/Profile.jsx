import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Chip,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import SideBar from '../Component/SideBar';
import { Card, Typography, Box, Deivder, InputLabel, FormControl, DialogTitle, Grid, Select, IconButton, MenuItem } from '@mui/material';
import { CardContent, CardMedia, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { DatePicker } from '@mui/lab';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { SvgIcon } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneIcon from '@mui/icons-material/Phone';



import UploadFileIcon from '@mui/icons-material/UploadFile';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};



const LinkedInStyledIcon = styled(LinkedInIcon)(({ theme }) => ({
  fontSize: 100,
  color: '#0077b5', // LinkedIn color
  marginBottom: 10,
  marginLeft: 80
}));

// const FacebookStyledIcon = styled(FacebookIcon)(({ theme }) => ({
//   fontSize: 55,
//   color: '#3b5998', // Facebook color
//   marginBottom: 10,
// }));

// const SkypeStyledIcon = styled(PhoneIcon)(({ theme }) => ({
//   fontSize: 55,
//   color: '#00aff0', // Skype color
//   marginBottom: 10,
// }));

const icons = [
  { component: LinkedInStyledIcon, name: 'LinkedIn' },
  // { component: FacebookStyledIcon, name: 'Facebook' },
  // { component: SkypeStyledIcon, name: 'Skype' },
];

const StyledCard = styled(Card)({
  maxWidth: 350,
  margin: 'auto',
});

const StyledMedia = styled(CardMedia)({
  height: 140,
});

const StyledAvatar = styled(Avatar)({
  width: 150,
  height: 150,
  margin: 'auto',
  marginBottom: 20,
});

const StyledContent = styled(CardContent)({
  textAlign: 'center',
});

function Profile() {
  const profile = {
    name: '',
    email: '',
    role: '',
    phone: '',
    imageUrl: '',
  };


  const divStyle = {
    marginLeft: 60
  };


  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };



  const [formData, setFormData] = useState({
    empMobileNumber: '',
    empEmergencyContactNumber: '',
    empEmailId: '',
    empPersonalEmailId: '',
    empDateofBirth: '',
    empGenderId: '',
    linkedIn: '',
    employeePicPath: "",
    permanentAddressLine1: '',
    permanentAddressLine2: '',
    empDesignationId: '',
    empJoiningDate: '',
    technologyId: '',
    experience: '',
    technologyIdList: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [technologyOptions, setTechnologyOptions] = useState([]);

  const [profileName, setProfileName] = useState('');
  const [profileRole, setProfileRole] = useState('');
  const [genderOptions, setGenderOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);

  // const handleProfilePictureChange = (event) => {
    
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setProfilePicture(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const [employeePicPath, setEmployeePicPath] = useState("");
  const [employeePicName, setEmployeePicName] = useState("");
  // Function to convert file to Base64
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      setEmployeePicName(file.name);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result;
        setEmployeePicPath(base64String); // Save Base64 image to state
      };
    }
  };

  const [data, setData] = useState('');

  const empCode = sessionStorage.getItem('empCode');

  useEffect(() => {
    if (empCode) {
      axios.get(`https://staffcentral.azurewebsites.net/api/EmployeeProfile/GetEmployeeDetailsByempCode?empCode=${encodeURIComponent(empCode)}`)
        .then(response => {
          const data = response.data;

        

          const genderidFilter = genderOptions.find(x => x.genderText == data.gender)?.genderId;
          const designationIdFilter = designationOptions.find(x => x.designationName == data.jobTitle)?.designationId;

          setFormData({
            empMobileNumber: data.mobileNumber || '',
            empEmergencyContactNumber: data.alternateMobileNumber || '',
            empEmailId: data.email || '',
            empPersonalEmailId: data.alternateEmail || '',
            empDateofBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
            empGenderId: genderidFilter || '',
            linkedIn: data.socialLink || '',
            permanentAddressLine1: data.address1 || '',
            permanentAddressLine2: data.address2 || '',
            empDesignationId: designationIdFilter || '',
            employeePicPath: data.employeePicPath || '',
            empJoiningDate: data.dateOfJoining ? new Date(data.dateOfJoining).toISOString().split('T')[0] : '',
            experience: data.experience || '',
            technologyIdList: data.technologyIdList,
          });
          setData(formData.technologyId);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }

  }, [genderOptions])

  



  useEffect(() => {
    // Fetch designation options
    axios.get('https://staffcentral.azurewebsites.net/api/Designation/GetDesignations')
      .then(response => {
        const designationData = response.data;
        setDesignationOptions(designationData);
      })
      .catch(error => {
        console.error('Error fetching designation data:', error);
      });
  }, [])

  useEffect(() => {
    const storedProfileName = sessionStorage.getItem('employeeName');
    const storedProfileRole = sessionStorage.getItem('employeeRoles');
    

    if (storedProfileName) {
      setProfileName(storedProfileName);
    }

    if (storedProfileRole) {
      setProfileRole(storedProfileRole);
    }


    // Fetch technology options
    axios.get('https://staffcentral.azurewebsites.net/api/Technology/GetTechnologys')
      .then(response => {
        setTechnologyOptions(response.data)
      })
      .catch(error => {
        console.error('Error fetching technology data:', error);
      });


    // Fetch gender options
    axios.get('https://staffcentral.azurewebsites.net/api/Gender/GetGender')
      .then(response => {
        const genderData = response.data;
        setGenderOptions(genderData);
      })
      .catch(error => {
        console.error('Error fetching gender data:', error);
      });

  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    // Handle multiple select values
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    setFormData(prevState => ({
      ...prevState,
      [name]: selectedValues,
    }));
  };





  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsEditing(false);

    // Update API call

    const payload = {
      empCode: empCode,
      employeePicPath:employeePicPath,
      empMobileNumber: String(formData.empMobileNumber),
      empEmergencyContactNumber: String(formData.empEmergencyContactNumber),
      empEmailId: String(formData.empEmailId),
      empPersonalEmailId: String(formData.empPersonalEmailId),
      empDateofBirth: String(formData.empDateofBirth),
      empGenderId: String(formData.empGenderId),
      linkedIn: String(formData.linkedIn),
      permanentAddressLine1: String(formData.permanentAddressLine1),
      empDesignationId: formData.empDesignationId,
      empJoiningDate: String(formData.empJoiningDate),
      technologyId: formData.technologyIdList,
      profileImage: employeePicPath,

    }
    if (empCode) {
      axios.post(`https://staffcentral.azurewebsites.net/api/EmployeeProfile/UpdateEmployeeByempCode?empCode=${encodeURIComponent(empCode)}`, payload, {
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          
        })
        .catch(error => {
          console.error('Error updating profile:', error.response ? error.response.data : error.message);
        });
    }
  };




  const handleCancel = () => {
    setIsEditing(false);
  };


  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }


  return (
    <Box sx={{ display: 'flex' }} className="main-container">
      <SideBar />

      <Box component="main" className="main-content" sx={{ flexGrow: 1, }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography className='head-title' component="h1" variant="h6" align="left">
                Profile
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign={'right'}>
              <div role="presentation" onClick={handleClick}>
                <Breadcrumbs className='breadcrumbs-css' aria-label="breadcrumb" textAlign={'right'} sx={{ mt: 1 }}>
                  <Link color="inherit" href="/">
                    Dashboard
                  </Link>
                  <Typography color="text.primary">Profile</Typography>
                </Breadcrumbs>
              </div>
            </Grid>
          </Grid>
        </Box>

        <Card sx={{ minWidth: 275 }} className='profile_bg' >
          <Grid container>
            <Grid item xs={3} sx={{ mt: 0, mb: 3, pl: 0, pr: 3, }}>
              <StyledCard className='card-box-css'>
                <StyledContent>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={formData.employeePicPath} // Replace with your default profile picture
                      alt="Profile Picture"
                      sx={{ width: 100, height: 100 }}
                    />
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-picture-upload"
                      type="file"
                      onChange={handleProfilePictureChange}
                    />
                    <label htmlFor="profile-picture-upload">
                      <IconButton
                        component="span"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          padding: '5px',
                          '&:hover': { backgroundColor: 'lightgray' }
                        }}
                      >
                        <EditIcon /> {/* You can replace this with <UploadFileIcon /> if you prefer */}
                      </IconButton>
                    </label>
                  </div>
                  {/* <StyledAvatar className='profile-img profile-side-compo' src={profile.imageUrl} sx={{ mt: 3 }} /> */}
                  <Typography variant="h5" component="h5">
                    {profileName || 'Name'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {profileRole || 'Role'}
                  </Typography>
                  <line className='line-css'></line>

                  <Grid container spacing={2} justifyContent="center" alignItems="center">
                    {icons.map((icon, index) => (
                      <Grid
                        item
                        key={index}
                        xs={12}
                        sm={4}
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {/* LinkedIn Icon */}
                        <SvgIcon
                          component={icon.component}
                          sx={{ fontSize: 40, display: 'block', margin: '0 auto' }}
                        />

                        {/* LinkedIn Text */}
                        <a href={formData.linkedIn} target="_blank" id="anchertag" style={{ textDecoration: 'none', marginTop: '8px', textAlign: 'center' }}>
                          <div className='social-text' style={{ textAlign: 'center', color: 'inherit' }}>
                            {icon.name}
                          </div>
                        </a>
                      </Grid>
                    ))}
                  </Grid>

                </StyledContent>
              </StyledCard>
            </Grid>

            <Grid item xs={9} sx={{ mt: 0, mb: 3, pl: 0, pr: 0, }}>
              <StyledCard className='card-box-css width-100'>
                <StyledContent>
                  <Typography variant='body2' sx={{ textAlign: 'left', mt: 0 }} component="p" color="textSecondary" className='pcolor'>
                    <Box mt={0}>
                      <form onSubmit={handleSubmit} className='form-input'>
                        <Typography variant='h6' className='allttitle' sx={{ textAlign: 'left' }}>Personal Information</Typography>
                        <Grid container spacing={0} sx={{ mt: 0 }}>
                          <Grid item xs={6} sx={{ pr: 2 }}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Mobile Number</DialogTitle>
                            <TextField
                              fullWidth
                              name="empMobileNumber"
                              placeholder='Mobile Number'
                              value={formData.empMobileNumber}
                              onChange={handleChange}
                              variant="outlined"
                              disabled={true}

                            />
                          </Grid>
                          <Grid item xs={6}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Alternate Number </DialogTitle>
                            <TextField
                              fullWidth
                              name="empEmergencyContactNumber"
                              value={formData.empEmergencyContactNumber}
                              onChange={handleChange}
                              variant="outlined"
                              disabled={!isEditing}
                            />
                          </Grid>
                          <Grid item xs={6} sx={{ pr: 2 }}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Email Id </DialogTitle>
                            <TextField
                              fullWidth
                              name="empEmailId"
                              value={formData.empEmailId}
                              onChange={handleChange}
                              variant="outlined"
                              disabled={true}

                            />
                          </Grid>
                          <Grid item xs={6}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Alternate Email -Id</DialogTitle>
                            <TextField
                              fullWidth
                              name="empPersonalEmailId"
                              value={formData.empPersonalEmailId}
                              onChange={handleChange}
                              variant="outlined"
                              disabled={!isEditing}

                            />
                          </Grid>
                          <Grid item xs={6} sx={{ pr: 2 }}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Date of Birth</DialogTitle>
                            <TextField
                              fullWidth
                              type="date"
                              name="empDateofBirth"
                              value={formData.empDateofBirth}
                              disabled={!isEditing}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Gender</DialogTitle>
                            <Select
                              name="empGenderId"
                              value={formData.empGenderId || ''}
                              //value= 'hhhh'
                              onChange={handleChange}
                              disabled={!isEditing}
                              fullWidth

                            >
                              {genderOptions.map(option => (
                                <MenuItem key={option.genderId} value={option.genderId}>
                                  {option.genderText


                                  }
                                </MenuItem>
                              ))}
                            </Select>
                          </Grid>
                          <Grid item xs={6} sx={{ pr: 2 }}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Social Link </DialogTitle>
                            <TextField
                              fullWidth
                              placeholder="Social Link"
                              name="linkedIn"
                              value={formData.linkedIn}
                              onChange={handleChange}
                              variant="outlined"
                              disabled={!isEditing}
                              sx={{ mb: 1 }}
                            />
                          </Grid>

                          <Grid item xs={12} className='jobinfocss'>
                            <Typography variant='h6' className='allttitle' sx={{ textAlign: 'left' }}>Address Information</Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Address 1</DialogTitle>
                            <TextField
                              className="text-area"
                              fullWidth
                              multiline
                              name="permanentAddressLine1"
                              value={formData.permanentAddressLine1}
                              onChange={handleChange}
                              variant="outlined"
                              disabled={!isEditing}

                              rows={3}
                            />
                          </Grid>

                          <Grid item xs={6} sx={{ pl: 2, pr: 0 }}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Address 2</DialogTitle>
                            <TextField
                              className="text-area"
                              fullWidth
                              multiline
                              name="permanentAddressLine2"
                              value={formData.permanentAddressLine2}
                              onChange={handleChange}
                              variant="outlined"
                              disabled={!isEditing}

                              rows={3}
                            />
                          </Grid>

                          <Grid item xs={12} className='jobinfocss'>
                            <Typography variant='h6' className='allttitle' sx={{ textAlign: 'left' }}>Job Information</Typography>
                          </Grid>

                          <Grid item xs={6} sx={{ pr: 2 }}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Job Title</DialogTitle>
                            <Select
                              name="empDesignationId"
                              value={formData.empDesignationId}
                              variant="outlined"
                              onChange={handleChange}
                              fullWidth
                              disabled={!isEditing}
                            >
                              {designationOptions.map((option) => (
                                <MenuItem key={option.designationId} value={option.designationId}>
                                  {option.designationName}
                                </MenuItem>
                              ))}
                            </Select>



                          </Grid>
                          <Grid item xs={6}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Date of Joining</DialogTitle>
                            <TextField
                              fullWidth
                              type="date"
                              name="empJoiningDate"
                              value={formData.empJoiningDate}
                              onChange={handleChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              disabled={!isEditing}
                            />
                          </Grid>
                          <Grid item xs={6} sx={{ pr: 2 }}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}> Technology </DialogTitle>
                            <Select
                              name="technologyIdList"
                              value={formData.technologyIdList}
                              variant="outlined"
                              onChange={handleChange}
                              fullWidth
                              multiple
                              disabled={!isEditing}
                              renderValue={(selected) => selected.map((id) => {
                                const selectedOption = technologyOptions.find(option => option.technologyId === id);
                                return selectedOption ? selectedOption.technologyName : null;
                              }).join(', ')}
                            >
                              {technologyOptions.map((option) => (
                                <MenuItem key={option.technologyId} value={option.technologyId}>
                                  <Checkbox checked={formData.technologyIdList.includes(option.technologyId)} />
                                  <ListItemText primary={option.technologyName} />
                                </MenuItem>
                              ))}
                            </Select>
                          </Grid>



                          <Grid item xs={6}>
                            <DialogTitle className='h2title' variant='h2' sx={{ pl: 0, pr: 0 }}>Experience</DialogTitle>
                            <TextField
                              fullWidth
                              name="experience"
                              value={formData.experience}
                              onChange={handleChange}
                              variant="outlined"
                              disabled={!isEditing}
                              required
                            />
                          </Grid>


                          <Grid item xs={12} sx={{ mt: 3, }} textAlign={'right'}>
                            {isEditing ? (
                              <Box display="flex" justifyContent="right">
                                <Button
                                  variant="contained"
                                  className='primary mrg-10'
                                  type="submit"

                                >
                                  Update
                                </Button>
                                <Button
                                  className='warning '
                                  variant="contained"
                                  color="secondary"
                                  onClick={handleCancel}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            ) : (

                              <Button
                                onClick={handleEditToggle}
                                className='primary'
                                variant="contained"
                                type="submit"
                              >
                                Edit
                              </Button>


                            )}
                          </Grid>
                        </Grid>
                      </form>
                    </Box>
                  </Typography>
                </StyledContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  )
}

export default Profile