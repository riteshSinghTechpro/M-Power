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
import { Add, Delete, Edit } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Box } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function UserRoleAccessTable() {
  const baseURL = 'https://staffcentral.azurewebsites.net/api';
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('username');
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const refreshList = () => {
    axios.get(baseURL + '/UserRoleAccess/GetUserRoleAccess')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    refreshList();
  }, []);

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
    setPage(0);
  };

  const sortComparator = (a, b, orderBy) => {
    // if (b[orderBy] < a[orderBy]) {
    //   return order === 'asc' ? -1 : 1;
    // }
    // if (b[orderBy] > a[orderBy]) {
    //   return order === 'asc' ? 1 : -1;
    // }
    // return 0;
    if (order === "desc") {
      return a.empcode.localeCompare(b.empcode);
    } else {
      return b.empcode.localeCompare(a.empcode);
    }
  };

  const filteredRows = data.filter(row => 
    (row.username && row.username.toLowerCase().includes(search.toLowerCase())) ||
    (row.roleName && row.roleName.toLowerCase().includes(search.toLowerCase()))
  );
  
  const sortedRows = [...filteredRows].sort((a, b) => sortComparator(a, b, orderBy));

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const handleCsvDownload = () => {
    const csvData = filteredRows.map(row => ({
      'User Name': row.username,
      'Role': row.roleName,
      'Designation': row.designation,
      'Email Id': row.emailId,
    }));
    return csvData;
  };

  const downloadExcel = () => {
    const filteredData = filteredRows.map(row => ({ 'User Name': row.username, 'Role': row.roleName, 'Designation': row.designation, 'Email Id': row.emailId }));
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "UserRoleAccess");
    XLSX.writeFile(wb, "UserRoleAccess.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['User Name', 'Role', 'Designation', 'Email Id']],
      body: filteredRows.map(row => [row.username, row.roleName, row.designation, row.emailId]),
    });
    doc.save('UserRoleAccess.pdf');
  };

  return (
    <Paper className='table-card' sx={{ width: '100%', overflow: 'hidden' }}>
       <Grid container spacing={2} className='table-top-head'>
       <Grid item xs={2} className='file-upload'>
          <Item>
            <IconButton className='addcss1' onClick={downloadExcel}>
              <img width="15" height="15" src="https://img.icons8.com/ios/50/ms-excel.png" alt="ms-excel" />
            </IconButton>
          </Item>
          <Item>
            <CSVLink data={handleCsvDownload()} filename={'UserRoleAccess.csv'}>
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
        <Grid item xs={5}></Grid>
        <Grid item xs={2} textAlign={'right'}></Grid>
        <Grid item xs={3}>
          
            <TextField
              className='search-css'
              placeholder="Search User Role Access"
              variant="outlined"
              fullWidth
              margin="normal"
              value={search}
              onChange={handleSearchChange}
            />
            <SearchIcon className='search-icon' />
          
        </Grid>
      </Grid>

      <TableContainer className='shadow-none'>
        <Table sx={{ minWidth: 650 }} aria-label="enhanced table">
          <TableHead>
            <TableRow>
            <TableCell style={{ width: 50 }}>S.No</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'username'}
                  direction={orderBy === 'username' ? order : 'asc'}
                  onClick={() => handleRequestSort('username')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                Role Name
              </TableCell>
              {!isSmallScreen && (
                <>
                  <TableCell>
                    Designation
                  </TableCell>
                </>
              )}
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'emailId'}
                  direction={orderBy === 'emailId' ? order : 'asc'}
                  onClick={() => handleRequestSort('emailId')}
                >
                  Email-Id
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => (
              <TableRow key={row.empcode}>
                 <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                {!isSmallScreen && <TableCell>{row.roleName}</TableCell>}
                {!isSmallScreen && <TableCell>{row.designation}</TableCell>}
                <TableCell>{row.emailId}</TableCell>
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
}

export default UserRoleAccessTable;
