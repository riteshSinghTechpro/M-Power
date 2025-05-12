import React, { useState, useEffect } from 'react';
import { Card, TextField, Typography } from '@mui/material'
import { DialogTitle, } from '@mui/material';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { toast } from 'react-toastify';

function ObjectiveMasterForm(props) {
  const baseURL = 'https://staffcentral.azurewebsites.net/api';
  const [isEdit, setIsEdit] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);

  const [error, setError] = useState({
    objectiveName: "",
    empCode: ""
  });
  const [objectiveFormData, setObjectiveFormData] = useState({
    objectiveName: "",
    empCode: "",
    objectiveDescription: ""
  });

  // Fetch roles and module data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [empResponse] = await Promise.all([
          fetch(`${baseURL}/ObjectiveMaster/GetAllEmployee`)
        ]);
        const empsData = await empResponse.json();

        setEmployeesData(empsData);
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const editData = props.formData;
  useEffect(() => {
    // If editing, populate the form with existing data
    if (editData) {
      setObjectiveFormData({
        objectiveName: editData.objectiveName,
        empCode: editData.empCode,
        objectiveDescription: editData.objectiveDescription
      });
      setIsEdit(true);
      setError({
        objectiveName: "",
        empCode: ""
      });
    } else {
      // If not editing, reset the form
      setObjectiveFormData({
        objectiveName: "",
        empCode: "",
        objectiveDescription: ""
      });
      setIsEdit(false);
    }
  }, [editData]);

  // const Textarea = styled(BaseTextareaAutosize)(
  //   ({ theme }) => `
  //       box-sizing: border-box;
  //       font-size: 0.875rem;
  //       font-weight: 400;
  //       width: 100%;
  //       line-height: 1.5;
  //       padding: 8px 12px;
  //       border-radius:4px;
  //   }
  // `,
  // );

  const validateObjectiveForm = () => {
    let errors = {};

    if (objectiveFormData.objectiveName?.trim() === '') {
      errors.objectiveName = 'Please enter objective name';
    }

    if (objectiveFormData.empCode?.trim() === '') {
      errors.empCode = 'Please select an employee';
    }

    setError(errors);

    return Object.keys(errors).length === 0;
  };

  const [isVisible, setIsVisible] = useState(true);

  const handleCancel = () => {
    setIsEdit(false);
    setIsVisible(false);
    props.showDivData(false);
  };


  const handleSubmit = async () => {
    if (validateObjectiveForm()) {
      try {
        const payload = {
          objectiveName: objectiveFormData.objectiveName,
          empCode: objectiveFormData.empCode,
          objectiveDescription: objectiveFormData.objectiveDescription
        }

        let response;
        if (isEdit) {
          payload.objectiveId = editData.objectiveId;
          response = await axios.post(`${baseURL}/ObjectiveMaster/SaveUpdateobjective`, payload);
          if (response.status === 200) {
            toast.success('Record Updated Successfully', { position: 'top-center', closeButton: false });
            props.refreshTable();
            props.showDivData(false);
          } else {
            toast.error(response.data, { position: 'top-center', closeButton: false });
          }
        } else {
          response = await axios.post(`${baseURL}/ObjectiveMaster/SaveUpdateobjective`, payload);
          if (response.status === 200) {
            toast.success('Record Submitted Successfully', { position: 'top-center', closeButton: false });
            props.refreshTable();
            props.showDivData(false);
          } else {
            toast.error(response.data, { position: 'top-center', closeButton: false });
          }
        }

        // Reset form
        setObjectiveFormData({
          objectiveName: "",
          empCode: "",
          objectiveDescription: ""
        });

      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setObjectiveFormData((v) => ({ ...v, [name]: value }));
  };

  return (
    <div>
      {isVisible && (
          <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
              <form className='tondform-css'>
          <Grid container>
          <Grid item xs={6} sx={{ mt:3, mb: 1, pl: 3, pr: 1 }}>
          {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>Objective Name</DialogTitle> */}
              <TextField
                fullWidth
                label="Objective name"
                required
                variant="outlined" 
                // placeholder="Objective name"
                name="objectiveName"
                value={objectiveFormData.objectiveName}
                onChange={handleChange}
              />
              {error.objectiveName && (
              <Grid item xs={12} sx={{ mb: 1, pl: 0, pr: 2 }}>
                <Typography fontSize={13} color="error">{error.objectiveName}</Typography>
              </Grid>
            )}
            </Grid>
            

            <Grid item xs={6} sx={{mt:3, mb: 1, pl: 1, pr: 2 }}>
            {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>Employee Name</DialogTitle> */}
              <FormControl fullWidth>
                <InputLabel id="emp-name-label">Employee Name</InputLabel>
                <Select
                  labelId="emp-name-label"
                  label="Employee Name"
                  required
                  name="empCode"
                  value={objectiveFormData.empCode}
                  onChange={handleChange}
                >
                  {employeesData.map((item) => (
                    <MenuItem key={item.empCode} value={item.empCode}>
                      {item.empName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {error.empCode && (
              <Grid item xs={12} sx={{ mb: 1, pl: 2, pr: 2 }}>
                <Typography fontSize={13} color="error">{error.empCode}</Typography>
              </Grid>
            )}
           
           <Grid item xs={12} sx={{ mt:2, mb: 0, pl: 3, pr: 2 }}>
           {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>Description</DialogTitle> */}
              <textarea
                fullWidth
                label="Description"
                minRows={2}
                variant="outlined"
                placeholder="Description"
                name="objectiveDescription"
                value={objectiveFormData.objectiveDescription}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sx={{mt:2, mb: 2, pl: 2, pr: 3 }} textAlign={'right'}>
            <Button variant="contained" className='primary mr-10' onClick={handleSubmit} >
                {isEdit ? 'Update' : 'Submit'}
              </Button>
              <Button variant="contained" color="error" onClick={handleCancel} type="button" className='warning'>
                Cancel
              </Button>
            </Grid>
          </Grid>
         </form>
        </Card>
      )}
    </div>
  );
}

export default ObjectiveMasterForm
