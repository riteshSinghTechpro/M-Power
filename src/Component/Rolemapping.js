import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TableSortLabel, TextField,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Add, Delete, Edit } from '@mui/icons-material';

const createData = (RoleName, Action) => {
  return { RoleName, Action };
}

const rows = [
  createData('Master 1'),
  createData('Master 2'),
  // Add more rows as needed
];

const Rolemapping = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('RoleName');
  const [search, setSearch] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setFilteredRows(
      rows.filter(row => row.RoleName.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

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
    if (b[orderBy] < a[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (b[orderBy] > a[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  };

  const sortedRows = [...filteredRows].sort((a, b) => sortComparator(a, b, orderBy));

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TextField
        label="Search Role Master"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearchChange}
      />
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="enhanced table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'RoleName'}
                  direction={orderBy === 'RoleName' ? order : 'asc'}
                  onClick={() => handleRequestSort('RoleName')}
                >
                  Role Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                
              </TableCell>
              {!isSmallScreen && (
                <>
                  <TableCell align="right">
                   
                  </TableCell>
                  <TableCell align="right">
                
                  </TableCell>
                </>
              )}
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'Action'}
                  direction={orderBy === 'Action' ? order : 'asc'}
                  onClick={() => handleRequestSort('Action')}
                >
                 Action
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.RoleName}>
                <TableCell component="th" scope="row">
                  {row.RoleName}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                {!isSmallScreen && <TableCell align="right"></TableCell>}
                {!isSmallScreen && <TableCell align="right"></TableCell>}
                <TableCell align="right">
                  <IconButton className='addcss'><Edit /></IconButton>
                  <IconButton className='deletecss'><Delete /></IconButton>
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

export default Rolemapping;
