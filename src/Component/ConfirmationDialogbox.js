// ConfirmationDialogBox.js
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ConfirmationDialogBox = ({ open, onClose, onConfirm, title, content }) => {
  return (
    <Dialog className='delete_box_css'
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title" 
      aria-describedby="confirmation-dialog-description"
      PaperProps={{
        style: {
          borderRadius: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions item xs={12} sx={{mt:1, mb: 2, pl: 2, pr: 3 }}>
        <Button onClick={onClose} className='warning mr-10' variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} className='primary ' variant="contained"> 
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialogBox;
