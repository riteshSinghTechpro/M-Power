import React, { useState } from 'react';
import { Card, TextField, } from '@mui/material'
import { DialogTitle,} from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { styled } from '@mui/system';

function ObjectiveMasterForm() {
    const [empeName, setRoleName] = React.useState('');
    const [moduleName, setModuleName] = React.useState('');
  
    const handleempChange = (event) => {
      setRoleName(event.target.value);
    };
  
    const Textarea = styled(BaseTextareaAutosize)(
        ({ theme }) => `
        box-sizing: border-box;
        font-size: 0.875rem;
        font-weight: 400;
        width: 100%;
        line-height: 1.5;
        padding: 8px 12px;
        border-radius:4px;
    }
  `,
  );

  const [isVisible, setIsVisible] = useState(true);

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <div>
    {isVisible && (
<Card sx={{ minWidth: 275, mt:0, pb:1 }}>
      <Grid container>
      {/* <Grid item xs={12} sx={{ mb: 0, pl:2, pr:2 }}>
      <DialogTitle sx={{pl:0, pr:0 }}>Employee Name</DialogTitle>
      <FormControl fullWidth>
          <InputLabel id="role-name-label">Employee Name</InputLabel>
          <Select
            labelId="emp-name-label"
            id="emp-name-select"
            value={empeName}
            label="Employee Name"  
            onChange={handleempChange}
          >
            <MenuItem value={'Admin'}>Sanjeev</MenuItem>
          </Select>
        </FormControl>
        </Grid> */}

        <Grid item xs={6} sx={{ mb: 2, pl:2, pr:2 }}>
        <DialogTitle sx={{pl:0, pr:0 }}>Objective name</DialogTitle>
 
          <TextField 
            fullWidth
            label="Objective name"  
            required
            id="Objectivename"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6} sx={{ mb: 2, pl:2, pr:2 }}>
        <DialogTitle sx={{pl:0, pr:0 }}>Description</DialogTitle>
 
          <Textarea 
            fullWidth
            label="Description"  
            minRows={1.1} 
            required
            id="Description"
            variant="outlined"
            placeholder="Description"
          />
        </Grid>
        <Grid item xs={12} sx={{ mb: 2, pl:2, pr:2 }} textAlign={'right'}>
          <Button variant="contained" color="primary" type="submit" sx={{mt:0 }}>
            Submit
          </Button>
          <Button variant="contained" color="error" onClick={handleCancel} type="button" sx={{ mt: 0, ml:2 }}>
          Cancel 
          </Button> 
        </Grid>
      </Grid>
      
      </Card>
  )}
  </div>
    );
  }

export default ObjectiveMasterForm
