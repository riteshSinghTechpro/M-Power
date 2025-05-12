import React, { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Grid, Typography, TextField, CircularProgress } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { ListItemText } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';

function UserAndRoleMappingForm(props) {
  const baseURL = 'https://staffcentral.azurewebsites.net/api';
  const [roleNameIds, setRoleNameIds] = useState([]);
  const [roleNames, setRoleNames] = useState([]);
  const [username, setUsername] = useState('');
  const [roles, setRoleItems] = useState([]);
  const [users, setUserNames] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [roleNameError, setRoleNameError] = useState('');
  const [hide, setHide] = useState(true);
  const [error, setError] = useState('');

  const urdata = props.roleData;
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const roleRes = await axios.post(`${baseURL}/RoleMapping/GetAllRole`);
        setRoleItems(roleRes.data);

        const userRes = await axios.post(`${baseURL}/RoleMapping/GetAllUser`);
        setUserNames(userRes.data);

        if (urdata ) {
          setUsername(urdata.empCode);
          setRoleNameIds(urdata.roleId.split(',').map(Number));
          setRoleNames(urdata.roleTexts.split(', '));
          setIsEdit(true);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [urdata]);

  const handleRoleChange = (event) => {
    const selectedRoleIds = event.target.value;
    setRoleNameIds(selectedRoleIds);

    const selectedRoleNames = roles
      .filter(role => selectedRoleIds.includes(role.roleId))
      .map(role => role.roleText);

    setRoleNames(selectedRoleNames);

    if (selectedRoleIds.length > 0) {
      setRoleNameError('');
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (event.target.value) {
      setUsernameError('');
    }
  };

  const handleCancel = () => {
    resetForm();
    props.dataHide(!hide);
    setIsEdit(false);
    setHide(false);
   ;
  };

  const validateRole = () => {
    let isValid = true;

    if (!username || username.length === 0) {
      setUsernameError('Please Select User Name');
      isValid = false;
    }

    if (!roleNameIds || roleNameIds.length === 0) {
      setRoleNameError('Please Select Role Name');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
   
    event.preventDefault();
    if (validateRole()) {
      setIsLoading(true);
      setIsEdit(false);
      try {
        const payload = {
          userId: username,
          roleIds: roleNameIds
        };
        const response = await axios.post(`${baseURL}/RoleMapping/assign-roles`, payload);

        if (response.data == 'Roles assigned successfully') {
          toast.success(response.data, {
            position: 'top-center',
            closeButton: false,
            autoClose: 2000
          });
          props.refreshList();
          resetForm();
          setHide(false);
          props.dataHide(!hide);
        } 
         if(response.data==='Role Already Assign') {
          setError("User already assigned with various roles. You can update the users role.");
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Role Already Assigned.', {
          position: 'top-center',
          closeButton: false,
          autoClose: 2000
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    
    if (validateRole()) {
      setIsLoading(true);
      try {
        const payload = {
          userId: username,
          roleIds: roleNameIds
        };
        const response = await axios.post(`${baseURL}/RoleMapping/update-roles`, payload);

        if (response.data === 'Roles Assign updated successfully.') {
          toast.success(response.data, {
            position: 'top-center',
            closeButton: false,
            autoClose: 2000
          });
          props.refreshList();
          resetForm();
          props.dataHide(!hide);
        } else {
          toast.error('Failed to update role mapping', {
            position: 'top-center',
            closeButton: false,
            autoClose: 2000
          });
        }
      } catch (error) {
        toast.error('Error updating role mapping', {
          position: 'top-center',
          closeButton: false,
          autoClose: 2000
        });
      } finally {
        setIsLoading(false);
      }
    }
  };


  const resetForm = () => {
    setUsername('');
    setRoleNameIds([]);
    setRoleNames([]);
    setUsernameError('');
    setRoleNameError('');
  };
  
  return ( 
    <div className='cart-border-10'>
      {hide && (
        <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
          
          <form onSubmit={isEdit ? handleUpdate : handleSubmit} className='tondform-css'>
            <Grid container>
            <Grid item xs={6} sx={{ mt:3, mb: 0, pl: 2, pr: 2 }}>
                <FormControl fullWidth error={!!usernameError}>
                  <InputLabel id="username-label">Username</InputLabel>
                  <Select
                    labelId="username-label"
                    id="username-select"
                    value={username}
                    label="Username"
                    onChange={handleUsernameChange}
                  >
                    {users.map((item) => (
                      <MenuItem key={item.empCode} value={item.empCode}>
                        {item.empName}
                      </MenuItem>
                    ))}
                  </Select>
                  {usernameError && (
                    <Typography variant="" className='errorcss'>
                      {usernameError}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6} sx={{mt:3, mb: 0, pl: 0, pr: 2}}>
                <FormControl fullWidth error={!!roleNameError}>
                  <InputLabel id="role-name-label">Role Name</InputLabel>
                  <Select
                    labelId="role-name-label"
                    id="role-name-select"
                    multiple
                    label="Role Name"
                    value={roleNameIds}
                    onChange={handleRoleChange}
                    renderValue={() => roleNames.join(', ')}
                  >
                    {roles.map((option) => (
                      <MenuItem key={option.roleId} value={option.roleId}>
                        <Checkbox checked={roleNameIds.includes(option.roleId)} />
                        <ListItemText primary={option.roleText} />
                      </MenuItem>
                    ))}
                  </Select>
                  {roleNameError && (
                    <Typography variant="" className='errorcss'>
                      {roleNameError}
                    </Typography>
                  )}
                </FormControl>
                
              </Grid>
             
              <Grid item xs={12} sx={{mt:3, mb: 2, pl: 2, pr: 3 }} textAlign={'right'}>
              {error && (
                   <Grid item xs={12} sx={{mt:0, mb: 0, pl: 2, pr: 3 }} textAlign={'left'}>
                    <Typography variant=""  className='errorcss'>
                      {error}
                    </Typography>
                    </Grid>
                  )}
                <Button variant="contained" color="primary" disabled={isLoading} type="submit" className='primary mr-10'>
                  {isEdit ? 'Update' : 'Save'}
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

export default UserAndRoleMappingForm;
