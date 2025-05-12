import React, { useState, useEffect } from 'react';
import { Card, TextField, Typography, } from '@mui/material';
import { DialogTitle, } from '@mui/material';
import { Button, Grid } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

function ClientMasterForm(props) {
  const baseURL = 'https://staffcentral.azurewebsites.net/api';
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const [clientFormData, setClientFormData] = useState({
    clientName: "",
    clientAddress: "",
  });

  const editData = props.formData;

  useEffect(() => { 
    // If editing, populate the form with existing data
    if (editData) {
      setClientFormData({
        clientName: editData.name,
        clientAddress: editData.address
      });
      setIsEdit(true);
    } else {
      // If not editing, reset the form
      setClientFormData({
        clientName: "",
        clientAddress: ""
      });
      setIsEdit(false);
    }
  }, [editData]);

  
  const validateClientForm = () => {
    if (clientFormData.clientName.trim() === '') {
      setError('Please enter client name');
      return false;
    }

    setError('');
    return true;
  };

  const [isVisible, setIsVisible] = useState(true);

  const handleCancel = () => {
    setIsEdit(false);
    setIsVisible(false);
    props.showDivData(false);
  };

  const handleSubmit = async () => {

    if (validateClientForm()) {
      try {
        const payload = {
          name: clientFormData.clientName,
          address: clientFormData.clientAddress
        }

        let response;
        if (isEdit) {
          payload.id = editData.id;
          response = await axios.post(`${baseURL}/Client/SaveUpdateClient`, payload);
          if (response.status === 200) {
            toast.success('Record Updated Successfully', { position: 'top-center', closeButton: false,autoClose: 2000 });
            props.refreshTable();
            props.showDivData(false);
          } else {
            toast.error(response.data, { position: 'top-center', closeButton: false,autoClose: 2000 });
          }
        } else {
          response = await axios.post(`${baseURL}/Client/SaveUpdateClient`, payload);
          if (response.status === 200) {
            toast.success('Record Submitted Successfully', { position: 'top-center', closeButton: false,autoClose: 2000 });         
            props.refreshTable();
            props.showDivData(false);
          } else {
            toast.error(response.data, { position: 'top-center', closeButton: false, autoClose: 2000 });
          }
        }
        // Reset form
        setClientFormData({
          clientName: "",
          clientAddress: "",
        });

      } catch (error) {
       
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientFormData((v) => ({ ...v, [name]: value }));
  };

  return (
    <div>
      {isVisible && (
        <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
          <form className='tondform-css'>
          <Grid container>
          <Grid item xs={6} sx={{ mt:3, mb: 1, pl: 3, pr: 1 }}>
              {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>Client Name</DialogTitle> */}
              <TextField
                fullWidth
                label="Client Name"
                required
                variant="outlined"
                name="clientName"
                value={clientFormData.clientName}
                onChange={handleChange}
              />
            </Grid>
            {error && (
              <Grid item xs={12} sx={{ mb: 1, pl: 2, pr: 2 }}>
                <Typography fontSize={13} color="error">{error}</Typography>
              </Grid>
            )}

                <Grid item xs={6} sx={{ mt:3, mb: 0, pl: 2, pr: 2 }}>
                {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>Client Address</DialogTitle> */}

              <textarea
                fullWidth
                label="Client Address"
                minRows={2}
                required
                placeholder='Client Address'
                variant="outlined"
                name="clientAddress"
                value={clientFormData.clientAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sx={{mt:2, mb: 2, pl: 2, pr: 3 }} textAlign={'right'}>
            <Button variant="contained" className='primary mr-10' onClick={handleSubmit} type="submit">
                {isEdit ? 'Update' : 'Submit'}
              </Button>
              <Button variant="contained" className='warning' onClick={handleCancel} type="button">
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


export default ClientMasterForm
