import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, TableSortLabel, TextField,
    IconButton, MenuItem, Select,
    Grid,
    styled, Card, Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Box } from '@mui/material';
import Loader from './Loader';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ConfirmationDialogBox from './ConfirmationDialogbox';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Stack } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';

const holidays = [
    { date: '2024-01-01', name: 'New Years Day' },
    { date: '2024-07-04', name: 'Republic Day' },
    { date: '2024-12-25', name: 'Christmas Day' },
    { date: '2024-11-28', name: 'Thanksgiving Day' },
    { date: '2024-05-27', name: 'Memorial Day' },
    { date: '2024-09-02', name: 'Labor Day' },
    { date: '2024-01-01', name: 'New Years Day' },
    { date: '2024-07-04', name: 'Holiday Day' },
    { date: '2024-12-25', name: 'Christmas Day' },
    { date: '2024-11-28', name: 'Thanksgiving Day' },
    { date: '2024-05-27', name: 'Memorial Day' },
    { date: '2024-09-02', name: 'Labor Day' },
    // Add more holidays as needed
];


const LeaveRequestMasterList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [roleText, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDiv, setShowDiv] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState({ skillId: 0, name: '' });
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const baseURL = 'https://staffcentral.azurewebsites.net/api';
    const alphabetRegex = /^[a-zA-Z ]*$/;
    const [age, setAge] = React.useState('');
    const handleChange = (event) => {
        setAge(event.target.value);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateRole()) {
            const isDuplicate = data.some(skill => skill.name.toLowerCase() === roleText.toLowerCase());
            if (isDuplicate) {
                setError('Skill already exists.');
                return;
            }
            try {
                setIsLoading(true);
                const payload = {
                    skillId: selectedSkill.skillId, // Use the selected skill's ID for updates
                    name: roleText,
                };
                const response = await axios.post(`${baseURL}/SkillMaster/SaveUpdateSkillMaster`, payload);
                if (response.data === 'Record Submit Successfully') {
                    toast.success(
                        selectedSkill.skillId === 0
                            ? 'Skill Master Created Successfully'
                            : 'Skill Master Updated Successfully',
                        {
                            position: 'top-center',
                            closeButton: false,
                        }
                    );
                    setSelectedSkill({ skillId: 0, name: '' });
                    setError('');
                    setShowDiv(false); // Hide the form
                    refreshList(); // Update the list of skills
                } else {
                    setError(response.data.message || 'Failed to create Skill Master');
                }
            } catch (err) {
                // Handle error
                console.error('Error creating Skill Master:', err);
            } finally {
                setIsLoading(false);
            }
        }
    };
    const handleRole = (e) => {
        
        setSelectedSkill({ ...selectedSkill, name: e.target.value });
        setRole(e.target.value);
        // Clear error as user types
        if (error) setError('');
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
        return true;
    };
    useEffect(() => {
        refreshList();
    }, []);

    const refreshList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/SkillMaster/GetAllSkill`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error fetching data', {
                position: 'top-center',
                closeButton: false,
            });
        } finally {
            setLoading(false);
        }
    };
    const filteredRows = data.filter(row =>
        (row.name && row.name.toLowerCase().includes(search.toLowerCase()))
    );

    const handleDeleteClick = (recordId) => {
        setSelectedRecordId(recordId);
        setIsDialogOpen(true);
    };

    const handleEditClick = (skill) => {
        setSelectedSkill(skill);
        setShowDiv(true);

        // Temporarily remove the selected skill from the list while editing
        const updatedData = data.filter((item) => item.skillId !== skill.skillId);
        setData(updatedData);
    };
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedRecordId(null);
    };
    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${baseURL}/SkillMaster/DeleteSkill?Id=${selectedRecordId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                toast.success('Skill Deleted Successfully', {
                    position: 'top-center',
                    closeButton: false,
                    autoClose: 2000
                });
                refreshList();
            } else {
                toast.error('Skill is assigned to an employee can not be deleted', {
                    position: 'top-center',
                    closeButton: false,
                    autoClose: 2000
                });
            }
        } catch (error) {
            toast.error('Error occurred while deleting data', {
                position: 'top-center',
                closeButton: false,
                autoClose: 2000
            });
        } finally {
            handleCloseDialog();
        }

    }
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const sortComparator = (a, b, orderBy) => {
        if (b[orderBy].toLowerCase() < a[orderBy].toLowerCase()) {
            return order === 'asc' ? -1 : 1;
        }
        if (b[orderBy].toLowerCase() > a[orderBy].toLowerCase()) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    };

    const sortedRows = [...filteredRows].sort((a, b) => sortComparator(a, b, orderBy));

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    const handleToggle = () => {
        setShowDiv((prevShowDiv) => !prevShowDiv);

        // Reset the form and error state when closing the form
        if (showDiv) {
            setSelectedSkill({ skillId: 0, name: '' }); // Reset form fields
            setRole(''); // Clear roleText
            setError(''); // Clear error message
        }
    };
    const handleCsvDownload = () => {
        return filteredRows.map(row => ({
            'Skill Name': row.name,
        }));
    };
    const downloadExcel = () => {
        const filteredData = filteredRows.map(row => ({ 'Skill Name': row.name }));
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Skills");
        XLSX.writeFile(wb, "skills.xlsx");
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Skill Name']],
            body: filteredRows.map(row => [row.name]),
        });
        doc.save('skills.pdf');
    };

    return (
        <>
            <ToastContainer />
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }} className='table-card'>
                        {showDiv && (
                            <Box >
                                <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
                                    <Grid>
                                        <Grid container className="inner-card">
                                            <Typography
                                                variant="h5"
                                                className="title-b"
                                                sx={{ mb: 2 }}
                                            >
                                                Employee Basic Details
                                            </Typography>
                                            <Grid item xs={6} sx={{ mt: 0, mb: 0, pl: 0, pr: 0 }}>
                                                <Typography >
                                                    Employee name : Bhawna Chaudhry
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ mt: 0, mb: 0, pl: 0, pr: 0 }}>
                                                <Typography >
                                                    Employee ID : TP/123
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ mt: 1, mb: 0, pl: 0, pr: 0 }}>
                                                <Typography >
                                                    Employee Designation : React Js Developer
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ mt: 1, mb: 0, pl: 0, pr: 0 }}>
                                                <Typography >
                                                    Employee DOJ : 00/00/0000
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ mt: 1, mb: 0, pl: 0, pr: 0 }}>
                                                <Typography >
                                                    Employee Email : bhawnachaudhry@techprocompsoft.com
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ mt: 1, mb: 0, pl: 0, pr: 0 }}>
                                                <Typography >
                                                    Employee Mobile : 8287552612
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <form onSubmit={handleSubmit} className='tondform-css'>
                                        <Grid container spacing={2}>
                                            {/* Leave Application Form */}
                                            <Grid item xs={8} sx={{ ml: 5, mt: 2 }} className="inner-card">
                                                <Typography variant="h5" className="title-b" sx={{ mb: 2 }}>
                                                    Apply Leave
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Select labelId="Account Type" id="Account Type" fullWidth value="">
                                                            <MenuItem value={0}>Select Account Type</MenuItem>
                                                            <MenuItem value={1}>Saving</MenuItem>
                                                            <MenuItem value={2}>Current</MenuItem>
                                                            <MenuItem value={3}>Salary</MenuItem>
                                                        </Select>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            fullWidth
                                                            id="fromdate"
                                                            variant="outlined"
                                                            type="date"
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Select labelId="Account Type" id="Account Type" fullWidth value="">
                                                            <MenuItem value={0}>Select Account Type</MenuItem>
                                                            <MenuItem value={1}>Saving</MenuItem>
                                                            <MenuItem value={2}>Current</MenuItem>
                                                            <MenuItem value={3}>Salary</MenuItem>
                                                        </Select>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            fullWidth
                                                            id="todate"
                                                            variant="outlined"
                                                            type="date"
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Select labelId="Account Type" id="Account Type" fullWidth value="">
                                                            <MenuItem value={0}>Select Account Type</MenuItem>
                                                            <MenuItem value={1}>Saving</MenuItem>
                                                            <MenuItem value={2}>Current</MenuItem>
                                                            <MenuItem value={3}>Salary</MenuItem>
                                                        </Select>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField fullWidth id="Totaldays" label="Total Days*" variant="outlined" />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            minRows={2}
                                                            id="description"
                                                            label="Description*"
                                                            variant="outlined"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} textAlign="right">
                                                        <Button variant="contained" color="primary" type="submit" disabled={isLoading} className="primary mr-10">
                                                            {isLoading ? 'Submitting...' : 'Submit'}
                                                        </Button>
                                                        <Button variant="contained" color="error" onClick={handleToggle} type="button" className="warning">
                                                            Cancel
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>


                                            <Grid item xs={3}>
                                                <Box
                                                    sx={{
                                                        maxHeight: '250px', // Set a max height for the scrollable area (reduced)
                                                        overflowY: 'auto',  // Enable vertical scrolling
                                                        border: '2px solid #ccc', // Add a border
                                                        borderRadius: '4px',
                                                        padding: '8px', // Padding for a smaller box
                                                        backgroundColor: '#f9f9f9',
                                                    }}
                                                >
                                                    <Typography variant="h6" sx={{ marginBottom: 1, color: 'black' }}> {/* Reduced margin */}
                                                        Holiday List
                                                    </Typography>
                                                    <List>
                                                        {holidays.map((holiday) => (
                                                            <ListItem key={holiday.date} sx={{ padding: '2px 0' }}> {/* Reduced padding for ListItem */}
                                                                <ListItemText
                                                                    primary={`${holiday.date} - ${holiday.name}`}
                                                                    sx={{ color: 'black' }} // Change text color if needed
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                    </form>
                                </Card>
                            </Box>
                        )}

                        <Grid container spacing={2} className='table-top-head'>
                            <Grid item xs={2} sx={{ mt: 0 }} className='file-upload'>
                                <Item>
                                    <IconButton className='addcss1' onClick={downloadExcel}>
                                        <img width="15" height="15" src="https://img.icons8.com/ios/50/ms-excel.png" alt="ms-excel" />
                                    </IconButton>
                                </Item>
                                <Item>
                                    <CSVLink data={handleCsvDownload()} filename={'skills.csv'}>
                                        <IconButton className='addcss2'>
                                            <img width="15" height="15" src="https://img.icons8.com/ios/50/csv.png" alt="csv" />
                                        </IconButton>
                                    </CSVLink>
                                </Item>
                                <Item>
                                    <IconButton className='addcss3' onClick={downloadPDF}>
                                        <img width="15" height="15" src="https://img.icons8.com/ios/50/pdf--v1.png" alt="pdf--v1" />
                                    </IconButton>
                                </Item>

                            </Grid>
                            <Grid item xs={5}>
                            </Grid>
                            <Grid item xs={2} textAlign={'right'}>
                                <Button sx={{ mt: 2 }} variant="contained" className='primary' onClick={handleToggle}>
                                    {showDiv ? '+ APPLY LEAVE' : '+ APPLY LEAVE '}
                                </Button>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    className='search-css'
                                    placeholder="Search Leave"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                                <SearchIcon className='search-icon' />
                            </Grid>
                        </Grid>
                        {/* -------Start-----------Delete Confrimation box */}
                        <ConfirmationDialogBox
                            open={isDialogOpen}
                            onClose={handleCloseDialog}
                            onConfirm={handleConfirmDelete}
                            title="Confirm Delete"
                            content="Are you sure, you want to delete this record?"
                        />
                        {/* --------End------- */}
                        <TableContainer className='shadow-none'>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: 50 }}>S.No</TableCell>
                                        <TableCell sortDirection={orderBy === 'name' ? order : false}>
                                            <TableSortLabel
                                                active={orderBy === 'name'}
                                                direction={orderBy === 'name' ? order : 'asc'}
                                                onClick={() => handleRequestSort('name')}
                                            >
                                                Leave Type
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>Total Leave</TableCell>
                                        <TableCell>From Date</TableCell>
                                        <TableCell>To Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedRows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow
                                                key={row.skillId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell component="th" scope="row">
                                                    SDL
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    20
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    10/10/2024
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    20/10/2024
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    Pending
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Stack spacing={2} direction="row" justifyContent="flex-end">
                                                        {/* View Button - Subtle Light Blue */}
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#cfe8fc',
                                                                color: '#1976d2',
                                                                '&:hover': {
                                                                    backgroundColor: '#90caf9', // Darker blue background on hover
                                                                    color: '#ffffff', // White text on hover
                                                                },
                                                            }}
                                                        >
                                                            View
                                                        </Button>

                                                        {/* Withdraw Button - Subtle Light Purple */}
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#e0cfe8',
                                                                color: '#673ab7',
                                                                '&:hover': {
                                                                    backgroundColor: '#b39ddb', // Darker purple background on hover
                                                                    color: '#ffffff', // White text on hover
                                                                },
                                                            }}
                                                        >
                                                            Withdraw
                                                        </Button>

                                                        {/* Cancel Button - Subtle Light Red */}
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#fce8e8',
                                                                color: '#d32f2f',
                                                                '&:hover': {
                                                                    backgroundColor: '#ef9a9a', // Darker red background on hover
                                                                    color: '#ffffff', // White text on hover
                                                                },
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Stack>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
            )}
        </>
    );
};

export default LeaveRequestMasterList;