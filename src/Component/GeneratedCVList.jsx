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
import { setSelectedEmployees, setCvEmployeeCode } from "../feature/apiDataSlice";
import { useSelector, useDispatch } from "react-redux";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SavePdf from "./CV/GeneratedCV/SavePdf";
const GeneratedCVList = () => {
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
      .get(`${baseURL}/GenerateCV/GetGenerateCVList`)
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
    return b.cvEmpCode.localeCompare(a.cvEmpCode); // Descending order by empcode
  };
  
  const sortedRows = [...filteredRows].sort(sortComparator);

  const selectedEmployees = useSelector(
    (state) => state.apiData.selectedEmployees
  );
const pdfFunCall = (newValue, gettemplateId) => {
    navigate('/SavePdf', { state: { cvEmpCodes: newValue, templateIds: gettemplateId } });
}
const saveDownloadFun = (newValue) => {
  dispatch(setCvEmployeeCode(newValue));
}


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
            <Grid item xs={9}></Grid>
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
                  {/* <TableCell style={{ width: 50 }}>Select</TableCell> */}
                  <TableCell
                    active={orderBy === "ClientName"}
                    direction={orderBy === "ClientName" ? order : "asc"}
                    onClick={() => handleRequestSort("ClientName")}
                  >
                    Client Name
                  </TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Template Name</TableCell>
                  <TableCell>Email ID</TableCell>

                  <TableCell>Mobile Number</TableCell>
                  <TableCell onClick={() => handleRequestSort("Action")} align="center">
                   
                    
                      Action
                    
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={row.recId}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell component="th" scope="row">
                        {row.clientName}
                      </TableCell>
                      {!isSmallScreen && (
                        <TableCell>{row.employeeName}</TableCell>
                      )}
                      <TableCell>{row.templateName}</TableCell>
                      <TableCell>{row.employeeEmailID}</TableCell>
                      <TableCell>{row.mobileNumber}</TableCell>
                      <TableCell>
                        <TableCell >
                          <IconButton className="viewAsPdfIconCss" onClick={() => pdfFunCall(row.cvEmpCode, row.templateId)}>
                            <PictureAsPdfIcon />
                          </IconButton>
                          <IconButton className="downloadIconCss" onClick={()=> saveDownloadFun(row.cvEmpCode)}>
                            {" "}
                            <FileDownloadIcon />
                          </IconButton>
                          <IconButton className="deletecss">
                            <svg
                              xmlns="http:www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </svg>
                          </IconButton>
                        </TableCell>
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
        </>
      )}
    </Paper>
  );
};

export default GeneratedCVList;
