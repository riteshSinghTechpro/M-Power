import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Paper, Box, Card, Grid, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem, Typography, Button, IconButton,
  TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, TableSortLabel, TablePagination, useTheme, useMediaQuery
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from 'react-csv';
import SearchIcon from '@mui/icons-material/Search'; // Ensure you have this import


const ClientMasterList = () => {
  const baseURL = 'https://staffcentral.azurewebsites.net/api';

  // Pagination and Sorting States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  // Search State
  const [search, setSearch] = useState('');

  // Client Data States
  const [filteredRows, setFilteredRows] = useState([]);
  const [clients, setClients] = useState([]);

  // Dropdown Data States
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Form Data State
  const [clientFormData, setClientFormData] = useState({
    id: 0,
    name: "",
    countryId: "",
    stateId: "",
    cityId: "",
    address: ""
  });

  // Form Visibility and Edit Mode States
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Error States
  const [formError, setFormError] = useState('');

  // Theme and Responsiveness
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch Countries on Mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch Clients on Mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch Countries Function
  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${baseURL}/Country/GetAllCountry`);
      setCountries(response.data); // Assuming data is an array of country objects
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error('Failed to fetch countries.', {
        position: 'top-center',
        autoClose: 2000,
      });
    }
  };

  // Fetch States Function
  const fetchStates = async (countryId) => {
    if (!countryId) {
      setStates([]);
      setClientFormData((prev) => ({ ...prev, stateId: "", cityId: "" }));
      setCities([]);
      return;
    }
    try {
      const response = await axios.get(`${baseURL}/Country/GetStateByCountryId?CountryId=${countryId}`);
      setStates(response.data); // Assuming data is an array of state objects
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error('Failed to fetch states.', {
        position: 'top-center',
        autoClose: 2000,
      });
    }
  };

  // Fetch Cities Function
  const fetchCities = async (stateId) => {
    if (!stateId) {
      setCities([]);
      setClientFormData((prev) => ({ ...prev, cityId: "" }));
      return;
    }
    try {
      const response = await axios.get(`${baseURL}/Country/GetCityBystateId?StateId=${stateId}`);
      setCities(response.data); // Assuming data is an array of city objects
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error('Failed to fetch cities.', {
        position: 'top-center',
        autoClose: 2000,
      });
    }
  };

  // Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Reset form error if any
    setFormError('');

    // If country changes, fetch new states
    if (name === 'countryId') {
      fetchStates(value);
      setClientFormData((prev) => ({ ...prev, stateId: "", cityId: "" }));
      setCities([]);
    }

    // If state changes, fetch new cities
    if (name === 'stateId') {
      fetchCities(value);
      setClientFormData((prev) => ({ ...prev, cityId: "" }));
    }
  };

  // Validate Form
  const validateForm = () => {
    if (clientFormData.name.trim() === '') {
      setFormError('Please enter client name.');
      return false;
    }
    if (clientFormData.countryId === '') {
      setFormError('Please select a country.');
      return false;
    }
    if (clientFormData.stateId === '') {
      setFormError('Please select a state.');
      return false;
    }
    if (clientFormData.cityId === '') {
      setFormError('Please select a city/town.');
      return false;
    }
    if (clientFormData.address.trim() === '') {
      setFormError('Please enter client address.');
      return false;
    }
    setFormError('');
    return true;
  };

  // Fetch Clients Function
  const fetchClients = async () => {
    try {
      const response = await axios.get(`${baseURL}/Client/GetAllClient`);
      setClients(response.data); // Correctly set the clients state
      setFilteredRows(response.data);
     
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients.', {
        position: 'top-center',
        autoClose: 2000,
      });
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (validateForm()) {
      try {
        const payload = {
          id: isEdit ? clientFormData.id : 0, // Use existing ID for edits, 0 for new entries
          name: clientFormData.name,
          countryId: parseInt(clientFormData.countryId, 10),
          stateId: parseInt(clientFormData.stateId, 10),
          cityId: parseInt(clientFormData.cityId, 10),
          address: clientFormData.address,
        };

       

        const response = await axios.post(`${baseURL}/Client/SaveUpdateClient`, payload);
       

        if (response.status === 200 || response.status === 201) { // 201 Created is also common for POST
          // Show success message
          toast.success(isEdit ? 'Record Updated Successfully' : 'Record Submitted Successfully', {
            position: 'top-center',
            autoClose: 2000,
          });
          // Refresh the client list
          fetchClients();
          // Reset form and hide it
          handleCancel();
        } else {
          toast.error(response.data || 'An unexpected error occurred.', {
            position: 'top-center',
            autoClose: 2000,
          });
        }
      } catch (error) {
        const errorMessage = error.response?.data || 'An error occurred while submitting the form.';
        toast.error(errorMessage, {
          position: 'top-center',
          autoClose: 2000,
        });
        console.error('Submission Error:', error);
      }
    }
  };

  // Handle Cancel Action
  const handleCancel = () => {
    setIsEdit(false);
    setIsFormVisible(false);
    setClientFormData({
      id: 0,
      name: "",
      countryId: "",
      stateId: "",
      cityId: "",
      address: ""
    });
    setStates([]);
    setCities([]);
    setFormError('');
  };

  // Handle Edit Action
  const handleEdit = async (client) => {
    setIsEdit(true);
    setIsFormVisible(true);
    setClientFormData({
      id: client.id,
      name: client.name,
      countryId: client.countryId,
      stateId: client.stateId,
      cityId: client.cityId,
      address: client.address,
    });

    // Fetch states and cities based on existing client data
    await fetchStates(client.countryId);
    await fetchCities(client.stateId);
  };

  // Delete Client Function
  const deleteClient = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        // Assuming the API expects a DELETE request
        const response = await axios.delete(`${baseURL}/Client/DeleteClient?Id=${id}`);

        if (response.status === 200 || response.status === 204) { // 204 No Content is also common for DELETE
          toast.success('Client deleted successfully!', {
            position: 'top-center',
            autoClose: 2000,
          });
          fetchClients(); // Refresh the client list
        } else {
          toast.error('Failed to delete the client.', {
            position: 'top-center',
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        toast.error('An error occurred while deleting the client.', {
          position: 'top-center',
          autoClose: 2000,
        });
      }
    } else {
      // Optional: Inform the user that the deletion was canceled
      toast.info('Deletion canceled.', {
        position: 'top-center',
        autoClose: 2000,
      });
    }
  };

  // Handle Toggle Form Visibility (Add New Client)
  const handleToggle = () => {
    setIsFormVisible(true);
    setIsEdit(false); // Ensure it's in "add" mode
    setClientFormData({
      id: 0,
      name: "",
      countryId: "",
      stateId: "",
      cityId: "",
      address: ""
    });
    setStates([]);
    setCities([]);
    setFormError('');
  };

  // Handle Sorting Request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle Page Change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle Rows Per Page Change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Update Filtered Rows based on Search
  useEffect(() => {
    setFilteredRows(
      clients.filter(client =>
        client.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, clients]);

  // Helper Functions for Sorting
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orderComp = comparator(a[0], b[0]);
      if (orderComp !== 0) return orderComp;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  // Sorting and Pagination
  const sortedRows = useMemo(() => {
    return stableSort(filteredRows, getComparator(order, orderBy));
  }, [filteredRows, order, orderBy]);

  const sortedAndPagedRows = useMemo(() => {
    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  // Helper Functions to Get Names from IDs
  const getCountryName = (id) => {
    const country = countries.find((c) => c.id === id);
    return country ? country.name : 'N/A';
  };

  const getStateName = (id) => {
    const state = states.find((s) => s.stateId === id);
    return state ? state.stateText : 'N/A';
  };

  const getCityName = (id) => {
    const city = cities.find((c) => c.cityId === id);
    return city ? city.cityText : 'N/A';
  };

  // Placeholder Functions for Download (Implement as Needed)
  const downloadExcel = () => {
    // Implement Excel download logic
    toast.info('Excel download not implemented.', {
      position: 'top-center',
      autoClose: 2000,
    });
  };

  const downloadCsv = () => {
    // Implement CSV download logic
    return filteredRows; // Example
  };

  const downloadPDF = () => {
    // Implement PDF download logic
    toast.info('PDF download not implemented.', {
      position: 'top-center',
      autoClose: 2000,
    });
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }} className='table-card'>
        <ToastContainer />

        {/* Form Section */}
        <Box className="form-bb">
          {isFormVisible && (
            <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
              <form className='tondform-css' onSubmit={handleSubmit}>
                <Grid container spacing={2}>

                  {/* Client Name */}
                  <Grid item xs={12} sm={4}>
                    <DialogTitle>Client Name</DialogTitle>
                    <TextField
                      fullWidth
                      label="Client Name"
                      required
                      variant="outlined"
                      name="name"
                      value={clientFormData.name}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Country */}
                  <Grid item xs={12} sm={4}>
                    <DialogTitle>Country</DialogTitle>
                    <FormControl fullWidth required>
                      <InputLabel id="country-label">Select Country*</InputLabel>
                      <Select
                        labelId="country-label"
                        id="country-select"
                        label="Select Country*"
                        name="countryId"
                        value={clientFormData.countryId}
                        onChange={handleInputChange}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.id} value={country.id}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* State */}
                  <Grid item xs={12} sm={4}>
                    <DialogTitle>State</DialogTitle>
                    <FormControl fullWidth required>
                      <InputLabel id="state-label">Select State*</InputLabel>
                      <Select
                        labelId="state-label"
                        id="state-select"
                        label="Select State*"
                        name="stateId"
                        value={clientFormData.stateId}
                        onChange={handleInputChange}
                        disabled={!clientFormData.countryId}
                      >
                        {states.length > 0 ? (
                          states.map((state) => (
                            <MenuItem key={state.stateId} value={state.stateId}>
                              {state.stateText}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="" disabled>
                            {clientFormData.countryId ? 'No states available' : 'Select a country first'}
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* City/Town */}
                  <Grid item xs={12} sm={4}>
                    <DialogTitle>City/Town</DialogTitle>
                    <FormControl fullWidth required>
                      <InputLabel id="city-label">Select City/Town*</InputLabel>
                      <Select
                        labelId="city-label"
                        id="city-select"
                        label="Select City/Town*"
                        name="cityId"
                        value={clientFormData.cityId}
                        onChange={handleInputChange}
                        disabled={!clientFormData.stateId}
                      >
                        {cities.length > 0 ? (
                          cities.map((city) => (
                            <MenuItem key={city.cityId} value={city.cityId}>
                              {city.cityText}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="" disabled>
                            {clientFormData.stateId ? 'No cities available' : 'Select a state first'}
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Client Address */}
                  <Grid item xs={12} sm={6}>
                    <DialogTitle>Client Address</DialogTitle>
                    <TextField
                      fullWidth
                      label="Client Address"
                      required
                      multiline
                      minRows={4}
                      placeholder='Enter client address'
                      variant="outlined"
                      name="address"
                      value={clientFormData.address}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Form Error */}
                  {formError && (
                    <Grid item xs={12} sm={6}>
                      <Typography color="error">{formError}</Typography>
                    </Grid>
                  )}

                  {/* Action Buttons */}
                  <Grid item xs={12} sx={{ mt: 2, mb: 2, pl: 2, pr: 3 }} textAlign={'right'}>
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
        </Box>

        {/* Controls Section */}
        <Grid container spacing={2} className='table-top-head' alignItems="center">
          <Grid item xs={12} sm={2} className='file-upload'>
            <IconButton className='addcss1' onClick={downloadExcel}>
              <img width="20" height="20" src="https://img.icons8.com/ios/50/ms-excel.png" alt="ms-excel" />
            </IconButton>
            <IconButton className='addcss2'>
              <CSVLink data={downloadCsv()} filename={'Client_Master.csv'}>
                <img width="20" height="20" src="https://img.icons8.com/ios/50/csv.png" alt="csv" />
              </CSVLink>
            </IconButton>
            <IconButton className='addcss3' onClick={downloadPDF}>
              <img width="20" height="20" src="https://img.icons8.com/ios/50/pdf--v1.png" alt="pdf--v1" />
            </IconButton>
          </Grid>

          <Grid item xs={12} sm={5}>
            {/* Placeholder for additional controls or information */}
          </Grid>

          <Grid item xs={2} textAlign={'right'}>
            <Button sx={{ mt: 2 }} variant="contained" className='primary' onClick={handleToggle}>
              {isFormVisible ? '+ Add' : '+ Add'}
            </Button>
          </Grid>

          <Grid item xs={3}>
            <TextField
              className='search-css'
              placeholder="Search Client"
              variant="outlined"
              fullWidth
              margin="normal"
              value={search}
              onChange={handleSearchChange}

            />
            <SearchIcon className='search-icon' />
          </Grid>

        </Grid>

        {/* Clients Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="clients table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 50 }}>S.No</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Client Name
                  </TableSortLabel>
                </TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell>Country</TableCell>
                   
                    <TableCell>Address</TableCell>
                  </>
                )}
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAndPagedRows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  {!isSmallScreen && (
                    <>
                      <TableCell>{getCountryName(row.countryId)}</TableCell>
                     
                      <TableCell>{row.address}</TableCell>
                    </>
                  )}
                  <TableCell align="right">
                    <IconButton className='addcss' onClick={() => handleEdit(row)}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg></IconButton>
                    <IconButton className='deletecss' onClick={() => deleteClient(row.id)}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></IconButton>
                  </TableCell>

                </TableRow>
              ))}
              {sortedAndPagedRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isSmallScreen ? 4 : 6} align="center">
                    No clients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default ClientMasterList;
