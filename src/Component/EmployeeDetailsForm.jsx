import React from 'react';
import { Button, Card, TextField, Box, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { MenuItem, FormControl, InputLabel } from '@mui/material';

function EmployeeDetailsForm() {
    const [roleName, setRoleName] = React.useState('');
    const [moduleName, setModuleName] = React.useState('');
    const [linkingName, setLinkingName] = React.useState('');
  
    const handleRoleChange = (event) => {
      setRoleName(event.target.value);
    };
  
    const handleModuleChange = (event) => {
      setModuleName(event.target.value);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      // Handle form submission
      
    };
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0 , mt:0 }}>
    <Box sx={{ flexGrow: 1 }}>
    <Grid container>
      <Grid item xs={4} sx={{ mb: 0, pl:0, pr:0.,}}>
      <DialogTitle sx={{pl:0, pr:0, pt:0, }}>First Name</DialogTitle>
          <TextField
            fullWidth
            required
            id="firstName"
            label="First Name"  
            variant="outlined"
          />
        </Grid>
      <Grid item xs={4} sx={{ mb: 0, pl:2, pr:0.,}}>
      <DialogTitle sx={{pl:0, pr:0, pt:0, }}>Last Name</DialogTitle>
          <TextField
            fullWidth
            required
            id="lasttName"
            label="Last Name"  
            variant="outlined"
          />
        </Grid>
      <Grid item xs={4} sx={{ mb: 0, pl:2, pr:0.,}}>
      <DialogTitle sx={{pl:0, pr:0, pt:0, }}>Email</DialogTitle>
          <TextField
            fullWidth
            required
            type='Email'
            id="email"
            label="Email"  
            variant="outlined"
          />
        </Grid>
      <Grid item xs={4} sx={{ mb: 0, pl:0, pr:0, pt:2,}}>
      <DialogTitle sx={{pl:0, pr:0, pt:0, }}>Date of Birth</DialogTitle>
          <TextField
            fullWidth
            required
            type='date'
            id="dateofBirth"
            variant="outlined"
          />
        </Grid>
      <Grid item xs={4} sx={{ mb: 0, pl:2, pr:0, pt:2,}}>
      <DialogTitle sx={{pl:0, pr:0, pt:0, }}>Mobile Number</DialogTitle>
          <TextField
            fullWidth
            required
            type='Number'
            id="mobileNumber"
            label="Mobile Number"  
            variant="outlined"
          />
        </Grid>
      <Grid item xs={4} sx={{ mb: 0, pl:2, pr:0, pt:2,}}>
      <DialogTitle sx={{pl:0, pr:0, pt:0, }}>Highest Qualification</DialogTitle>
          <TextField
            fullWidth
            required
            id="highestQualification"
            label="Highest Qualification"  
            variant="outlined"
          />
        </Grid>
      <Grid item xs={4} sx={{ mb: 0, pl:0, pr:0, pt:2,}}>
      <DialogTitle sx={{pl:0, pr:0, pt:0, }}>Pass Out year</DialogTitle>
          <TextField
            fullWidth
            required
            type='year'
            id="passoutYear"
            label="Pass Out year"  
            variant="outlined"
          />
        </Grid>
      <Grid item xs={4} sx={{ mb: 0, pl:2, pr:0, pt:2,}}>
      <DialogTitle sx={{pl:0, pr:0, pt:0, }}>Father’s Name</DialogTitle>
          <TextField
            fullWidth
            required
            id="fatherName"
            label="Father’s Name"  
            variant="outlined"
          />
        </Grid>
      <Grid item xs={4} sx={{ mb: 0, pl:2, pr:0, pt:2,}}>
      <DialogTitle sx={{pl:0, pr:0, pt:0, }}>Mother’s Name</DialogTitle>
          <TextField
            fullWidth
            required
            id="motherName"
            label="Mother’s Name"  
            variant="outlined"
          />
        </Grid>
      <Grid item xs={12} sx={{ mb: 0, pl:0, pr:0, pt:2,}}>
      <DialogTitle sx={{pl:0, pr:0, pt:0, }}>Address</DialogTitle>
          <TextField
            fullWidth
            required
            id="address"
            label="Address"  
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sx={{ mb: 0, pb:2, pl:0, pr:0, mt:3 }}>
          <Button variant="contained" color="primary" type="submit" sx={{mt:0 }}>
            Save
          </Button>
        </Grid>
      </Grid>
  </Box>
  </Box>
  )
}

export default EmployeeDetailsForm


