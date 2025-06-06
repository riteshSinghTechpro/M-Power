import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, TableSortLabel, TextField,
    IconButton, MenuItem, Select,
    Grid, DialogTitle,
    styled, Card, Typography,
} from '@mui/material';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Checkbox, } from '@mui/material';

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




const LeaveTypeMasterList = () => {

    const [page, setPage] = useState(0);
    const [errors, setErrors] = useState({});
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
    const [leaveType, setLeaveType] = useState('');
    const [leaveProvided, setLeaveProvided] = useState('SixMonth');
    const [leaveLimit, setLeaveLimit] = useState('HalfOfTotal');
    const [applyForLOP, setApplyForLOP] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            leaveType,
            leaveProvided,
            leaveLimit,
            applyForLOP,
        };
        
        // Perform form submission or further processing here
    };
    const handleChange = (event) => {
        setAge(event.target.value);
    };
    const handleRemoveRow = (index, type) => {
        const rows =
            type === "input"
                ? [...inputRows]
                : type === "certification"
                    ? [...certificationRows]
                    : [...achievementsRows];
        rows.splice(index, 1);
        type === "input"
            ? setInputRows(rows)
            : type === "certification"
                ? setCertificationRows(rows)
                : setAchievementsRows(rows);
        const newErrors = { ...errors };
        Object.keys(newErrors).forEach((key) => {
            if (key.endsWith(`-${index}`)) {
                delete newErrors[key];
            }
        });
        setErrors(newErrors);
    };

    const [achievementsRows, setAchievementsRows] = useState([
        { id: 1, achievementTitle: "", adescription: "" },
    ]);

    const handleAddRow = (type) => {
        const newRow =
            type === "input"
                ? {
                    id: inputRows.length + 1,
                    instituteName: "",
                    courseName: "",
                    university: "",
                    percentage: "",
                    passingYear: "",
                }
                : type === "certification"
                    ? {
                        id: certificationRows.length + 1,
                        certificationName: "",
                        issuingOrganization: "",
                        issuedDate: "",
                        expirationDate: "",
                        description: "",
                    }
                    : {
                        id: achievementsRows.length + 1,
                        achievementTitle: "",
                        adescription: "",
                    };
        type === "input"
            ? setInputRows([...inputRows, newRow])
            : type === "certification"
                ? setCertificationRows([...certificationRows, newRow])
                : setAchievementsRows([...achievementsRows, newRow]);
    };

    const [inputRows, setInputRows] = useState([
        {
            id: 1,
            instituteName: "",
            courseName: "",
            university: "",
            percentage: "",
            passingYear: "",
            otherUniversity: "",
        },
    ]);

    const [certificationRows, setCertificationRows] = useState([
        {
            id: 1,
            certificationName: "",
            issuingOrganization: "",
            issuedDate: "",
            expirationDate: "",
            description: "",
        },
    ]);


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (validateRole()) {
    //         const isDuplicate = data.some(skill => skill.name.toLowerCase() === roleText.toLowerCase());
    //         if (isDuplicate) {
    //             setError('Skill already exists.');
    //             return;
    //         }
    //         try {
    //             setIsLoading(true);
    //             const payload = {
    //                 skillId: selectedSkill.skillId, // Use the selected skill's ID for updates
    //                 name: roleText,
    //             };
    //             const response = await axios.post(`${baseURL}/SkillMaster/SaveUpdateSkillMaster`, payload);
    //             if (response.data === 'Record Submit Successfully') {
    //                 toast.success(
    //                     selectedSkill.skillId === 0
    //                         ? 'Skill Master Created Successfully'
    //                         : 'Skill Master Updated Successfully',
    //                     {
    //                         position: 'top-center',
    //                         closeButton: false,
    //                     }
    //                 );
    //                 setSelectedSkill({ skillId: 0, name: '' });
    //                 setError('');
    //                 setShowDiv(false); // Hide the form
    //                 refreshList(); // Update the list of skills
    //             } else {
    //                 setError(response.data.message || 'Failed to create Skill Master');
    //             }
    //         } catch (err) {
    //             // Handle error
    //             console.error('Error creating Skill Master:', err);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    // };
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
                                    <form onSubmit={handleSubmit} className="tondform-css">
                                        <Grid container spacing={2}>
                                            <Grid item xs={11.5}>
                                                <Typography
                                                    variant="h5"
                                                    className="title-b"
                                                    sx={{ mb: 5, mt: 2, ml: 5 }}
                                                >
                                                    Leave Type
                                                </Typography>

                                                <Grid container direction="column" spacing={3} sx={{ ml: 1.5, }} className="inner-card">
                                                    {/* Employee Name */}
                                                    <Grid container spacing={2} alignItems="center">
                                                        {/* Leave Type Field */}
                                                        <Grid item>
                                                            <Typography component="h2" sx={{ color: 'black', ml: 3, }}>
                                                                Leave Type:
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <TextField
                                                                id="LeaveType"
                                                                label="Leave Type"
                                                                variant="outlined"
                                                                sx={{ width: '300px' }}
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                    {/* Leave Provided Field */}
                                                    <Grid item>
                                                     
                                                        <Typography component="h2" sx={{ color: 'black', mb: 1, }}>
                                                        Leave Provided :
                                                            </Typography>
                                                        <FormControl component="fieldset" sx={{ marginBottom: 3, marginLeft: 5 }}>
                                                            <RadioGroup
                                                                row  // Set radio buttons in a single row
                                                                value={leaveProvided}
                                                                onChange={(e) => setLeaveProvided(e.target.value)}
                                                            >
                                                                <FormControlLabel
                                                                    value="SixMonth"
                                                                    control={<Radio />}
                                                                    label="Six Month"
                                                                />
                                                                <FormControlLabel value="Yearly" control={<Radio />} label="Yearly" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Grid>

                                                    {/* Leave Applied Limit */}
                                                    <Grid item>
                                                       
                                                        <Typography component="h2" sx={{ color: 'black', mb: 1, }}>
                                                        Leave Applied Limit :
                                                            </Typography>
                                                        <FormControl component="fieldset" sx={{ marginBottom: 0, marginLeft: 5 }}>
                                                            <RadioGroup
                                                                row  // Set radio buttons in a single row
                                                                value={leaveLimit}
                                                                onChange={(e) => setLeaveLimit(e.target.value)}
                                                            >
                                                                <FormControlLabel
                                                                    value="HalfOfTotal"
                                                                    control={<Radio />}
                                                                    label="Half of Total"
                                                                />
                                                                <FormControlLabel value="Input" control={<Radio />} label="Input" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                       
                                                    </Grid>
                                                    <Grid item>
                                                        <FormLabel sx={{ color: 'black', marginLeft: 10 }}></FormLabel>
                                                        <TextField
                                                                id="LeaveType"
                                                            
                                                           
                                                                variant="outlined"
                                                                sx={{ width: '60px' }}
                                                            />
                                                       
                                                    </Grid>
                                                    {/* Apply for LOP */}
                                                    <Grid item  sx={{ ml: 2, mb: 5 }} >
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={applyForLOP}
                                                                    onChange={(e) => setApplyForLOP(e.target.checked)}
                                                                />
                                                            }
                                                            label="Apply for LOP leaves"
                                                        />
                                                    </Grid>
                                                    <Grid container spacing={2} alignItems="center">
                                                        {/* Leave Type Field */}
                                                        <Grid item>
                                                            <Typography component="h2" sx={{ color: 'black', ml: 3, }}>
                                                                Number Of Leaves Applied:
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <TextField
                                                                id="LeaveType"
                                                               
                                                                variant="outlined"
                                                                sx={{ width: '60px' }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} sx={{ mt: 0, mb: 0, pr: 2, textAlign: "right" }}>
                                                        <Button variant="contained" color="primary" type="submit" disabled={isLoading} className="primary mr-10">
                                                            {isLoading ? "Submitting..." : "Submit"}
                                                        </Button>
                                                        <Button variant="contained" color="error" onClick={handleToggle} type="button" className="warning">
                                                            Cancel
                                                        </Button>
                                                    </Grid>
                                                </Grid>
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
                                    {showDiv ? '+ LEAVE BALANCE' : '+ LEAVE BALANCE '}
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
                                                Employee ID
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>      Employee Name</TableCell>
                                        <TableCell>Leave Type</TableCell>
                                        <TableCell>Leave Provided</TableCell>
                                      
                                        <TableCell>NO LOP Leaves Applied</TableCell>
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
                                                    TP/01
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    David
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    PL
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    Six Month
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    5
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton className='addcss' ><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg></IconButton>
                                                    <IconButton className='deletecss' ><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></IconButton>
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

export default LeaveTypeMasterList;