import React, { useEffect, useState } from 'react';
import { Button, Card, Grid, TextField, Typography } from '@mui/material';
import { DialogTitle } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RolemasterForm(props) {
  // Ensure props exist and provide default values if necessary
  const id = props?.data || '';
  const baseURL = 'https://staffcentral.azurewebsites.net/api';
  const [error, setError] = useState('');
  const [roleText, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const alphabetRegex = /^[a-zA-Z ]*$/;
  const emp_Code = sessionStorage.getItem('accountEmpCode');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRole(id);
    }
  }, [id]);

  const fetchRole = async (roleId) => {
    try {
      const response = await axios.get(`${baseURL}/RoleMaster/GetRoleById/?id=${roleId}`);
      if (response.data) {
        setRole(response.data.roleText);
        // Populate other fields if any
      }
    } catch (err) {
      setError('Failed to fetch role data');
    }
  };
  
  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const validateRole = () => {
    if (roleText === '') {
      setError('Please Enter Role Name');
      return false;
    }
    if (!alphabetRegex.test(roleText)) {
      setError('Only alphabetic characters are allowed.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateRole() && roleText) {
      try {
        setIsLoading(true);
        const payload = {
          roleText,
          createdBy: emp_Code,
        };
        
        let response;
        if (id) {
          payload.roleId = id;
          payload.modifiedBy = emp_Code;
          response = await axios.post(`${baseURL}/RoleMaster/SaveUpdateRole`, payload);
          if (response.data === 'Record Submit Successfully') {
            toast.success('Role Master Updated Successfully', {
              position: 'top-center',
              closeButton: false,
            });
            setError('');
          } else {
            setError(response.data.message || 'Failed to Update role master');
          }
        } else {
          response = await axios.post(`${baseURL}/RoleMaster/SaveUpdateRole`, payload);
          if (response.data === 'Record Submit Successfully') {
            toast.success('Role Master Saved Successfully', {
              position: 'top-center',
              closeButton: false,
            });
            setRole("");
            setError('');
          } else {
            setError(response.data.message || 'Failed to save role master');
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error saving role master');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
  };
  
  return (
    <div>
      {isVisible && (
        <Card sx={{ minWidth: 275, mt: 2, pb: 1 }}>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item xs={6} sx={{ mb: 2, pl: 2, pr: 2 }}>
                <DialogTitle sx={{ pl: 0, pr: 0 }}>Role Master</DialogTitle>
                <TextField
                  fullWidth
                  id="rolename"
                  value={roleText}
                  onChange={handleRole}
                  label="Role Name"
                  variant="outlined"
                />
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              </Grid>
              <Grid item xs={12} sx={{ mb: 2, pl: 2, pr: 2 }} textAlign={'right'}>
                <Button variant="contained" color="primary" type="submit" disabled={isLoading} sx={{ mt: 2 }}>
                  {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
                <Button variant="contained" color="error" onClick={handleCancel} type="button" sx={{ mt: 2, ml: 2 }}>
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


export default RolemasterForm;
