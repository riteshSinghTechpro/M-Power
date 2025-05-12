import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
  IconButton,
  Grid,
  styled,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Add, Delete, Edit } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "./Loader";
import axios from "axios";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setSelectedEmployees } from '../feature/apiDataSlice';
import { useSelector, useDispatch } from 'react-redux';

const CreatecvEmployeeTable = () => {
  const dispatch = useDispatch();
  const baseURL = "https://staffcentral.azurewebsites.net/api";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("employeeName");
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [empCodeToRemove, setEmpCodeToRemove] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const refreshList = () => {
    axios
      .get(`${baseURL}/CreateEmployeeCV/GetAllEmployees`)
      .then((response) => {
        setData(response.data);
        setFilteredRows(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshList();
  }, []);

  // useEffect(() => {
  //   if (data && Array.isArray(data)) {
  //     setFilteredRows(
  //       data.filter(
  //         (row) =>
  //           row.employeeName &&
  //           row.employeeName.toLowerCase().includes(search.toLowerCase())
  //       )
  //     );
  //   }
  // }, [search, data]);
  useEffect(() => {
    setFilteredRows(
      data.filter(
        (row) =>
          row.employeeName &&
          row.employeeName.toLowerCase().includes(search.toLowerCase())
      )
    );
    setPage(0); // Jab bhi search change ho, page ko reset karein
  }, [search, data]);
  
  const navigate = useNavigate();
  const [flagData, setFlagData] = useState(true);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setFilteredRows(
      data.filter(
        (row) =>
          row.employeeName &&
          row.employeeName.toLowerCase().includes(search.toLowerCase())
      )
    );
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // const sortComparator = (a, b) => {
  //   return b.recId - a.recId;
  // };
  const sortComparator = (a, b) => {
    return b.empcode.localeCompare(a.empcode); // Descending order by empcode
  };
  const sortedRows = [...filteredRows]
  .sort(sortComparator)
  .filter(
    (row, index, self) =>
      index === self.findIndex((r) => r.empcode === row.empcode)
  );

  
  const handleCheckboxChange = (empCode) => {
    if (selectedEmployees.includes(empCode)) {
      setEmpCodeToRemove(empCode); // Set the empCode to be removed
      setOpenDialog(true); // Open the confirmation dialog
    } else {
      // Add employee to the selected list
      const updatedSelectedEmployees = [...selectedEmployees, empCode];
      dispatch(setSelectedEmployees(updatedSelectedEmployees));
    }
  };

  const selectedEmployees = useSelector((state) => state.apiData.selectedEmployees);

  const handleConfirm = () => {
    window.location.reload();
  };

  const handleCancel = () => {
    setOpenDialog(false); // Just close the dialog without action
  };
    useEffect(() => {
    if (selectedEmployees.length === 0) {
      localStorage.removeItem("employeeSkills");
      localStorage.removeItem("employeeTechnologies");
      localStorage.removeItem("employeeTools");
      localStorage.removeItem("experienceData");
      localStorage.removeItem("objectiveData");
      localStorage.removeItem("projectData");
      localStorage.removeItem("selectedObjectiveName");
      localStorage.removeItem("selectedRows");
      localStorage.removeItem("selectedSkills");
      localStorage.removeItem("selectedTechnologies");
      localStorage.removeItem("selectedTools");
    }
  }, [selectedEmployees]);
 
  
  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden", mb: 2 }}
      className="table-card"
    >
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <>
          <Grid container spacing={2} className="table-top-head">
            
            <Grid item xs={9} ></Grid>
            <Grid item xs={3} textAlign={"right"}>
              <TextField
                className="search-css"
                placeholder="Search Employee"
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={handleSearchChange}
              />
              
              <SearchIcon className="search-icon" />
            </Grid>
          </Grid>

          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="enhanced table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 50 }}>S.No</TableCell>
                  <TableCell style={{ width: 50 }}>Select</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "empName"}
                      direction={orderBy === "empName" ? order : "asc"}
                      onClick={() => handleRequestSort("empName")}
                    >
                      Employee Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Email ID</TableCell>
                  <TableCell align="right">Mobile Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={row.recId}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployees.includes(row.empcode)}
                          onChange={() => handleCheckboxChange(row.empcode)}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.employeeName}
                      </TableCell>
                      {!isSmallScreen && (
                        <TableCell>{row.email}</TableCell>
                      )}
                      <TableCell align="right">{row.mobileNo}</TableCell>
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

          {/* Confirmation Dialog */}
          <Dialog open={openDialog} onClose={handleCancel}>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to uncheck this employee? This will result in data loss.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirm} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Paper>
  );
};

export default CreatecvEmployeeTable;
