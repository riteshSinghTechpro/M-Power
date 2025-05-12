import React, { useState } from 'react';
import { Button, Card, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SkillmasterForm({ onSkillAdded, onClose }) {
  const baseURL = 'https://staffcentral.azurewebsites.net/api/SkillMaster';
  const [error, setError] = useState('');
  const [roleText, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const alphabetRegex = /^[a-zA-Z ]*$/;

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const validateRole = () => {
    if (roleText.trim() === '') {
      setError('Please Enter Skill Name');
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
    if (validateRole()) {
      try {
        setIsLoading(true);
        const payload = {
          skillId: 0,
          name: roleText,
        };

        const response = await axios.post(`${baseURL}/SaveUpdateSkillMaster`, payload);

        if (response.data === 'Record Submit Successfully') {
          toast.success('Skill Master Created Successfully', {
            position: 'top-center',
            closeButton: false,
          });
          setRole('');
          setError('');
          onSkillAdded(); // Notify parent component of new skill
          onClose(); // Hide the form
        } else {
          setError(response.data.message || 'Failed to create Skill Master');
        }
      } catch (err) {
        // setError(err.response?.data?.message || 'Error creating Skill Master');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
      <ToastContainer />
      <form onSubmit={handleSubmit} className='tondform-css'>
        <Grid container>
          <Grid item xs={6} sx={{ mt: 3, mb: 1, pl: 3, pr: 1 }}>
            <TextField
              fullWidth
              id="skillname"
              value={roleText}
              onChange={handleRole}
              label="Skill Name"
              variant="outlined"
            />
            {error && <Typography className='errorcss'>{error}</Typography>}
          </Grid>
          <Grid item xs={12} sx={{ mt: -5, mb: 2, pl: 2, pr: 3 }} textAlign={'right'}>
            <Button variant="contained" color="primary" type="submit" disabled={isLoading} className='primary mr-10'>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
            <Button variant="contained" color="error" onClick={onClose} type="button" className='warning'>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
}

export default SkillmasterForm;