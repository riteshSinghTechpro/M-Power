import React, { useState } from 'react';
import { Button, Card, TextField, Box, Checkbox, Container, Typography, FormControlLabel, Breadcrumbs, Grid } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { MenuItem, FormControl, InputLabel, Textarea } from '@mui/material';
import { Select } from '@mui/material';
import { Link } from 'react-router-dom';
import SideBar from '../Component/SideBar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
function UploadDocuments() {
  const [file, setFile] = React.useState(null);
  const [downLoadfile, setDownLoadFile] = React.useState('');
  

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setDownLoadFile(event.target.files[0])

  };
  const [roleName, setRoleName] = React.useState('');

  // for download image

  // const handleDownload = () => {
  //   const pdfUrl = resume;
  //   const link = document.createElement("a");
  //   link.href = pdfUrl;
  //   link.download = "DilipKumarCV.pdf";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };


  const handledocChange = (event) => {
    setRoleName(event.target.value);
  };
  const handleClick = (event) => {
    setRoleName(event.target.value);
  };
  const [inputRows, setInputRows] = useState([{ id: 1 }]);
  const handleAddRow = () => {
    const newRow = { id: inputRows.length + 1 };
    setInputRows([...inputRows, newRow]);
  };

  const handleRemoveRow = (index) => {
    if (inputRows.length > 1) {
      const newRows = inputRows.filter((_, i) => i !== index);
      setInputRows(newRows);
    }
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography component="h1" variant="h5" align="left" sx={{ mb: 1 }}>
                Upload Document
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign={'right'}>
              <div role="presentation" onClick={handleClick}>
                <Breadcrumbs aria-label="breadcrumb" textAlign={'right'} sx={{ mt: 1 }}>
                  <Link underline="hover" color="inherit" href="/">
                    Employee Management
                  </Link>
                  <Typography color="text.primary">Upload Documentsss</Typography>
                </Breadcrumbs>
              </div>
            </Grid>
          </Grid>
        </Box>

        <Card>
          <Grid container alignItems="center" className='table-header-grid'>
            <Grid item xs={1} style={{ textAlign: 'center' }} className='grid-column-style'>
              <DialogTitle>S.No</DialogTitle>
            </Grid>
            <Grid item xs={5} className='grid-column-style'>
              <DialogTitle>Document Type</DialogTitle>
            </Grid>
            <Grid item xs={5} className='grid-column-style'>
              <DialogTitle>File Uploader</DialogTitle>
            </Grid>
            <Grid item xs={1} className='grid-column-style'>
              <DialogTitle>Actions</DialogTitle>
            </Grid>
          </Grid>

          {inputRows.map((row, index) => (
            <Grid container spacing={1} alignItems="center" key={row.id} className="input-row">
              <Grid item xs={1}>
                <Typography className="serial-number">{index + 1}</Typography>
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <Select
                    labelId="role-name-label"
                    id="role-name-select"
                    value={roleName}
                    label="Document Type"
                    onChange={handledocChange}
                  >
                    <MenuItem value={'Pdf'}>Pdf</MenuItem>
                    <MenuItem value={'JPEG'}>JPEG</MenuItem>
                    <MenuItem value={'PNG'}>PNG</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={1} className="flex-center">
                {index === inputRows.length - 1 ? (
                  <>
                    <button className="icon-btn-plus" onClick={handleAddRow}>
                      <AddIcon />

                    </button>
                    {index > 0 && (
                      <button className="icon-btn-minus" onClick={() => handleRemoveRow(index)}>
                        <RemoveIcon />
                      </button>
                    )}
                  </>
                ) : (
                  <button className="icon-btn-minus" onClick={() => handleRemoveRow(index)}>
                    <RemoveIcon />
                  </button>
                )}
              </Grid>
            </Grid>
          ))}
        </Card>
      </Box>
    </Box>
  )
}

export default UploadDocuments
