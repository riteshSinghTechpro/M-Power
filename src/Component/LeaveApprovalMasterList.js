import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, TableSortLabel, TextField,
    IconButton, MenuItem, Select,
    Grid, DialogTitle,
    styled, Card, Typography,
} from '@mui/material';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
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
import { useNavigate } from 'react-router-dom'; 




const LeaveApprovalMasterList = () => {
    const [page, setPage] = useState(0);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
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
    const [age, setAge] = useState(0);

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

    const viewFun = ( ) => {
        navigate("/ViewLeaveApproval");
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
                                    <form onSubmit={handleSubmit} className="tondform-css">
                                        <Grid container spacing={2} className="inner-card">
                                            <Grid item xs={12}>
                                                <Typography variant="h5" className="title-b" sx={{ mb: 2 }}>
                                                    Add Holiday
                                                </Typography>
                                            </Grid>

                                            <Box sx={{ width: '100%', border: '0.2px solid #ccc', borderRadius: 2, p: 2 }}>
                                                <Grid container alignItems="center" spacing={1} className="table-header-grid">
                                                    <Grid item xs={2} style={{ textAlign: "center" }} className="grid-column-style">
                                                        <DialogTitle>Holiday Name*</DialogTitle>
                                                    </Grid>
                                                    <Grid item xs={2} className="grid-column-style">
                                                        <DialogTitle>Restricted/Optional Holiday*</DialogTitle>
                                                    </Grid>
                                                    <Grid item xs={1} className="grid-column-style">
                                                        <DialogTitle>Number Of Days*</DialogTitle>
                                                    </Grid>
                                                    <Grid item xs={2} className="grid-column-style">
                                                        <DialogTitle>From Date*</DialogTitle>
                                                    </Grid>
                                                    <Grid item xs={1} className="grid-column-style">
                                                        <DialogTitle>To Date*</DialogTitle>
                                                    </Grid>
                                                    <Grid item xs={2} className="grid-column-style">
                                                        <DialogTitle>Description</DialogTitle>
                                                    </Grid>
                                                    <Grid item xs={2} className="grid-column-style">
                                                        <DialogTitle>Actions*</DialogTitle>
                                                    </Grid>
                                                </Grid>

                                                {certificationRows.map((row, index) => (
                                                    <Grid container spacing={1} alignItems="center" key={row.id} className="input-row">
                                                        <Grid item xs={2}>
                                                            <TextField
                                                                fullWidth
                                                                id={`holidayname-${index}`}
                                                                label="Holiday Name*"
                                                                variant="outlined"
                                                                value={row.certificationName}
                                                                onChange={(e) => handleChange(index, "certificationName", e.target.value, "certification")}
                                                                error={!!errors[`certificationName-${index}`]}
                                                                helperText={errors[`certificationName-${index}`]}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <Select
                                                                fullWidth
                                                                labelId={`restrictedoptional-label-${index}`}
                                                                id={`restrictedoptional-${index}`}
                                                                value={row.restrictedOptional} // Ensure this value is defined in your state
                                                                onChange={(e) => handleChange(index, "restrictedOptional", e.target.value, "certification")}
                                                                error={!!errors[`restrictedOptional-${index}`]}
                                                            >
                                                                <MenuItem value="Yes">Yes</MenuItem>
                                                                <MenuItem value="No">No</MenuItem>
                                                            </Select>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <TextField
                                                                fullWidth
                                                                id={`numberofdays-${index}`}
                                                                label="Number Of Days*"
                                                                variant="outlined"
                                                                value={row.issuingOrganization}
                                                                onChange={(e) => handleChange(index, "issuingOrganization", e.target.value, "certification")}
                                                                error={!!errors[`issuingOrganization-${index}`]}
                                                                helperText={errors[`issuingOrganization-${index}`]}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <TextField
                                                                fullWidth
                                                                id={`fromdate-${index}`}
                                                                variant="outlined"
                                                                type="date"
                                                                value={row.issuedDate}
                                                                onChange={(e) => handleChange(index, "issuedDate", e.target.value, "certification")}
                                                                error={!!errors[`issuedDate-${index}`]}
                                                                helperText={errors[`issuedDate-${index}`]}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <TextField
                                                                fullWidth
                                                                id={`todate-${index}`}
                                                                variant="outlined"
                                                                type="date"
                                                                value={row.issuedDate}
                                                                onChange={(e) => handleChange(index, "issuedDate", e.target.value, "certification")}
                                                                error={!!errors[`issuedDate-${index}`]}
                                                                helperText={errors[`issuedDate-${index}`]}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <TextField
                                                                fullWidth
                                                                id={`description-${index}`}
                                                                placeholder="Description"
                                                                variant="outlined"
                                                                value={row.description}
                                                                onChange={(e) => handleChange(index, "description", e.target.value, "certification")}
                                                                error={!!errors[`description-${index}`]}
                                                                helperText={errors[`description-${index}`]}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={1} className="flex-center">
                                                            {index === certificationRows.length - 1 ? (
                                                                <>
                                                                    <AddCircleIcon className="plus-ic" onClick={() => handleAddRow("certification")} />
                                                                    {index > 0 && <RemoveCircleIcon onClick={() => handleRemoveRow(index, "certification")} className="minus-ic" />}
                                                                </>
                                                            ) : (
                                                                <RemoveCircleIcon onClick={() => handleRemoveRow(index, "certification")} className="minus-ic" />
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                                <Grid item xs={12} sx={{ mt: 5, mb: 2, pr: 2, textAlign: "right" }}>
                                                    <Button variant="contained" color="primary" type="submit" disabled={isLoading} className="primary mr-10">
                                                        {isLoading ? "Submitting..." : "Submit"}
                                                    </Button>
                                                    <Button variant="contained" color="error" onClick={handleToggle} type="button" className="warning">
                                                        Cancel
                                                    </Button>
                                                </Grid>
                                            </Box>


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
                            <Grid item xs={3} textAlign={'right'} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                                <Button sx={{ mt: 2, whiteSpace: 'nowrap' }} variant="contained" className='primary' onClick={handleToggle}>
                                    {showDiv ? 'APPROVED' : 'APPROVED '}
                                </Button>
                                <Button sx={{ mt: 2, whiteSpace: 'nowrap' }} variant="contained" className='primary' onClick={handleToggle}>
                                    {showDiv ? 'BULK APPROVED' : 'BULK APPROVED '}
                                </Button>
                            </Grid>
                            <Grid item xs={2}>
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
                                                Employee Name
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>    Leave Type </TableCell>
                                        <TableCell>From Date</TableCell>
                                        <TableCell>To Date</TableCell>
                                        <TableCell>Applied Date</TableCell>
                                        <TableCell>Approval Status</TableCell>
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
                                                  Joe Harris
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                 Privilege Leave
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    10/10/2024 Full Day
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    20/10/2024 First Half
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    25/10/2024 10:00AM
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    Approved 
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton className="viewcss" onClick={() => viewFun( )} >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="22"
                                                            height="22"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M15.58 12c0 1.98-1.6 3.58-3.58 3.58S8.42 13.98 8.42 12s1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58Z"
                                                                stroke="currentColor"
                                                                stroke-width="1.5"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            ></path>
                                                            <path
                                                                d="M12 20.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-2.29-3.6-5.58-5.68-9.11-5.68-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68Z"
                                                                stroke="currentColor"
                                                                stroke-width="1.5"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            ></path>
                                                        </svg>
                                                    </IconButton>
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

export default LeaveApprovalMasterList;