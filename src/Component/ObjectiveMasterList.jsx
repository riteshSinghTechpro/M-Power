
import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TableSortLabel, TextField,
  IconButton,
  Grid,
  styled
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Add, Delete, Edit, } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Box } from '@mui/material';
import { UserRoleMappingForm } from './UserRoleMappingForm';
import DesignationForm from './DesignationForm';
import DocumentTypeForm from './DocumentTypeForm';
import ObjectiveMasterForm from './ObjectiveMasterForm';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const ObjectiveMasterList = () => {
  const baseURL = 'https://staffcentral.azurewebsites.net/api';
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('objectiveName');
  const [search, setSearch] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [formData, setFormData] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchObjectives();
  }, []);

  useEffect(() => {
    setFilteredRows(
      objectives.filter(obj =>
        obj.objectiveName.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  const fetchObjectives = async () => {
    try {
      const response = await axios.get(`${baseURL}/ObjectiveMaster/GetAllObjective`);
      setObjectives(response.data);
      setFilteredRows(response.data);
    } catch (error) {
      console.log('Error during fetching objectives: ', error);
    }
  }

  const [showDiv, setShowDiv] = useState(false);
  const handleToggle = () => {
    setFormData(null); // Reset formData to null
    setShowDiv(true);
  };

  const editObjective = (data) => {
    handleToggle();
    setFormData(data);
  }

  const deleteObjective = async (id) => {
    if (window.confirm('Are you sure you want to delete this data?')) {
      try {
        const response = await axios.post(`${baseURL}/ObjectiveMaster/DeleteObjective?Id=${id}`);
        if (response.status == 200) {
          toast.success('Record Deleted Successfully', {
            position: 'top-center',
            closeButton: false
          });
          fetchObjectives();
        }
        else {
          toast.error('Failed to delete objective', {
            position: 'top-center',
            closeButton: false
          });
        }
      } catch (error) {
        toast.error('Error occured while deleting data', {
          position: 'top-center',
          closeButton: false
        });
      }
    } else {
      toast.error('Delete action cancelled sucessfully', {
        position: 'top-center',
        closeButton: false
      });
    }

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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortComparator = (a, b, orderBy, order) => {
    if (a[orderBy].toLowerCase() < b[orderBy].toLowerCase()) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy].toLowerCase() > b[orderBy].toLowerCase()) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  };

  const sortedRows = [...filteredRows].sort((a, b) => sortComparator(a, b, orderBy, order));

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const downloadExcel = () => {
    const filteredData = filteredRows.map(row => ({
      'Objective Name': row.objectiveName,
      'Employee Name': row.empName,
      'Description': row.objectiveDescription
    }));

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Objective_Master");
    XLSX.writeFile(wb, "Objective_Master.xlsx");
  };

  const downloadCsv = () => {
    const csvData = filteredRows.map(row => ({
      'Objective Name': row.objectiveName,
      'Employee Name': row.empName,
      'Description': row.objectiveDescription
    }));
    return csvData;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Objective Name', 'Employee Name', 'Description']],
      body: filteredRows.map(row => [row.objectiveName, row.empName, row.objectiveDescription]),
    });
    doc.save('Objective_Master.pdf');
  };


  const sortedAndPagedRows = [...sortedRows]
    .sort((a, b) => b.objectiveId - a.objectiveId) // Sort in descending order
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage); // Apply pagination



  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }} className='table-card'>
      <ToastContainer />
      {showDiv && (
        <Box className="form-bb">
          <ObjectiveMasterForm showDivData={setShowDiv} refreshTable={fetchObjectives} formData={formData} />
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
            <CSVLink data={downloadCsv()} filename={'Objective_Master.csv'}>
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
            {showDiv ? '+ Add' : '+ Add'}
          </Button>
        </Grid>
        <Grid item xs={3}>
          <TextField
            className='search-css'
            placeholder="Search Objective"
            // label="Search Objective"
            variant="outlined"
            fullWidth
            margin="normal"
            value={search}
            onChange={handleSearchChange}
          />
          <SearchIcon className='search-icon' />
        </Grid>
      </Grid>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="enhanced table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 50 }}>S.No</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'objectiveName'}
                  direction={orderBy === 'objectiveName' ? order : 'asc'}
                  onClick={() => handleRequestSort('objectiveName')}
                >
                  Objective Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Employee Name</TableCell>
              {!isSmallScreen && <TableCell>Description</TableCell>}
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={row.objectiveId}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell component="th" scope="row">
                  {row.objectiveName}
                </TableCell>
                {!isSmallScreen && <TableCell>{row.empName}</TableCell>}
                {!isSmallScreen && <TableCell>{row.objectiveDescription}</TableCell>}
                <TableCell align="right">
                  <IconButton className='addcss' onClick={() => editObjective(row)}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg></IconButton>
                  <IconButton className='deletecss' onClick={() => deleteObjective(row.objectiveId)}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></IconButton>
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
  );
};

export default ObjectiveMasterList;
