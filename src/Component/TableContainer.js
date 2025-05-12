import React, { useEffect, useState } from "react";
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
  Button,
  Box,
  Typography,
  Card,
  DialogTitle,
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
import ConfirmationDialogBox from "./ConfirmationDialogbox";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Label } from "recharts";

const baseURL = "https://staffcentral.azurewebsites.net/api";

const ResponsiveTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("roleId");
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [roleText, setRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const alphabetRegex = /^[a-zA-Z ]*$/;
  const emp_Code = sessionStorage.getItem("empCode");
  const [isEdit, setIsEdit] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const refreshList = async () => {
    try {
      const response = await axios.get(`${baseURL}/RoleMaster/GetAllRole`);
      setData(response.data);
      setFilteredRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data", {
        position: "top-center",
        closeButton: false,
      });
    }
  };

  useEffect(() => {
    refreshList().then(() => setLoading(false));
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const handleDeleteClick = (recordId) => {
    setSelectedRecordId(recordId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRecordId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${baseURL}/RoleMaster/${selectedRecordId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Role deleted successfully", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
        refreshList();
      } else {
        toast.error("Role is assigned to an employee and can not be deleted", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error occurred while deleting data:", error);
      toast.error("Error occurred while deleting data", {
        position: "top-center",
        closeButton: false,
        autoClose: 2000,
      });
    } finally {
      handleCloseDialog();
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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
    // if (b[orderBy] < a[orderBy]) {
    //   return order === "asc" ? -1 : 1;
    // }
    // if (b[orderBy] > a[orderBy]) {
    //   return order === "asc" ? 1 : -1;
    // }
    // return 0;
  
    if (order=="desc") {
      return  a.roleId-b.roleId ;
      } else {
        return b.roleId - a.roleId;
      }
  };

  useEffect(() => {
    const filtered = data.filter((row) =>
      row.roleText.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRows(filtered);
    setPage(0)
  }, [search, data]);

  // const sortedRows = filteredRows.sort((a, b) => new Date(b.createdOn) - new Date(a.modifiedOn));

  const sortedRows = [...filteredRows].sort((a, b) =>
    sortComparator(a, b, orderBy)
  );

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const handleToggle = () => {
    setShowForm(true);
    setId(null);
    setRole("");
  };

  const handleEditClick = (roleId) => {
    setId(roleId);
    fetchRole(roleId);
    setIsEdit(true);
    setShowForm(true);
    setError("");
  };

  const handleCsvDownload = () => {
    return filteredRows.map((row) => ({
      "Role Name": row.roleText,
    }));
  };

  const downloadExcel = () => {
    const filteredData = filteredRows.map((row) => ({
      "Role Name": row.roleText,
    }));
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Roles");
    XLSX.writeFile(wb, "roles.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Role Name"]],
      body: filteredRows.map((row) => [row.roleText]),
    });
    doc.save("roles.pdf");
  };

  const fetchRole = async (roleId) => {
    try {
      const response = await axios.get(
        `${baseURL}/RoleMaster/GetRoleById/?id=${roleId}`
      );
      if (response.data) {
        setRole(response.data.roleText);
      }
    } catch (err) {
      setError("Failed to fetch role data");
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const validateRole = () => {
    if (roleText === "") {
      setError("Please enter role name");
      return false;
    }
    if (roleText.length > 50) {
      setError("Please enter role name below 50 character");
      return false;
    }
    if (!alphabetRegex.test(roleText)) {
      setError("Only alphabetic characters are allowed.");
      return false;
    }
    setError("");
    return true;
  };

  const spaceControlRoleMasterName = (roleName) => {
    return roleName.trim().replace(/\s+/g, " ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateRole()) {
      const normalizedRoleText = spaceControlRoleMasterName(roleText);
      const isDuplicate = data.some((role) => {
        const existingRoleText = spaceControlRoleMasterName(role.roleText);
        return existingRoleText === normalizedRoleText && role.roleId !== id;
      });

      if (isDuplicate) {
        setError("Role already exists.");
        return;
      }
      try {
        setIsLoading(true);
        const payload = {
          roleText: normalizedRoleText,
          createdBy: emp_Code,
        };

        let response;
        if (id) {
          payload.roleId = id;
          payload.modifiedBy = emp_Code;
          response = await axios.post(
            `${baseURL}/RoleMaster/SaveUpdateRole`,
            payload
          );

          if (response.data === "Record Submit Successfully") {
            toast.success("Role Master Updated Successfully", {
              position: "top-center",
              closeButton: false,
              autoClose: 2000,
            });
            setShowForm(false);
            refreshList();
            setError("");
            setIsEdit(false);
          } else {
            setError(response.data.message || "Failed to Update role master");
          }
        } else {
          response = await axios.post(
            `${baseURL}/RoleMaster/SaveUpdateRole`,
            payload
          );
          
          if (response.data === "Record Submit Successfully") {
            toast.success("Role Master Saved Successfully", {
              position: "top-center",
              closeButton: false,
              autoClose: 2000,
            });
            setShowForm(false);
            refreshList();
            setRole("");
            setError("");
          } else {
            setError("Failed to save role master");
          }
        }
      } catch (err) {
        setError("Role Master already exist");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEdit(false);
    setError("");
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <>
          {showForm && (
            <Paper
              sx={{ width: "100%", overflow: "hidden", mb: 2 }}
              className="form-card-css"
            >
              <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
                <form onSubmit={handleSubmit}>
                  <Grid container>
                    <Grid
                      item
                      xs={5}
                      sx={{ mt: 3, ml: 1, mb: 2, pl: 2, pr: 2 }}
                    >
                      <label>Role Master</label>
                      <TextField
                        fullWidth
                        id="rolename"
                        value={roleText}
                        onChange={handleRoleChange}
                        placeholder="Role Name"
                        variant="outlined"
                      />
                      <div fontSize={13} className="line-error">
                        {error}
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{ mt: -6, mb: 2, pl: 2, pr: 3 }}
                      textAlign={"right"}
                    >
                      <Button
                        variant="contained"
                        className="primary mr-10"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isEdit ? "Update" : "Submit"}
                      </Button>
                      <Button
                        variant="contained"
                        className="warning"
                        color="error"
                        onClick={handleCancel}
                        type="button"
                        sx={{ mt: 0, ml: 2 }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </Paper>
          )}
          <Paper
            className="table-card"
            sx={{ width: "100%", overflow: "hidden" }}
          >
            <Grid container spacing={2} className="table-top-head">
              <Grid item xs={2} className="file-upload">
                <Item>
                  <IconButton className="addcss1" onClick={downloadExcel}>
                    <img
                      width="15"
                      height="15"
                      src="https://img.icons8.com/ios/50/ms-excel.png"
                      alt="ms-excel"
                    />
                  </IconButton>
                </Item>
                <Item>
                  <CSVLink data={handleCsvDownload()} filename={"roles.csv"}>
                    <IconButton className="addcss2">
                      <img
                        width="15"
                        height="15"
                        src="https://img.icons8.com/ios/50/csv.png"
                        alt="csv"
                      />
                    </IconButton>
                  </CSVLink>
                </Item>
                <Item>
                  <IconButton className="addcss3" onClick={downloadPDF}>
                    <img
                      width="15"
                      height="15"
                      src="https://img.icons8.com/ios/50/pdf--v1.png"
                      alt="pdf--v1"
                    />
                  </IconButton>
                </Item>
              </Grid>
              <Grid item xs={5}></Grid>
              <Grid item xs={2} textAlign={"right"}>
                <Button
                  variant="contained"
                  className="primary"
                  onClick={handleToggle}
                >
                  <AddOutlinedIcon className="add-icon" /> Add
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Box className="">
                  <TextField
                    className="search-css"
                    autoFocus
                    placeholder="Search Role Master"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <SearchIcon className="search-icon" />
                </Box>
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

            <TableContainer component={Paper} className="shadow-none">
              <Table sx={{ minWidth: 650 }} aria-label="enhanced table">
                <TableHead>
                  <TableRow>
                    <TableCell>S.No.</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "roleId"}
                        direction={orderBy === "roleId" ? order : "asc"}
                        onClick={() => handleRequestSort("roleId")}
                      >
                        Role Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right"></TableCell>
                    {!isSmallScreen && (
                      <>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>
                      </>
                    )}
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row.roleId}>
                        <TableCell component="th" scope="row">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.roleText}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        {!isSmallScreen && (
                          <TableCell align="right"></TableCell>
                        )}
                        {!isSmallScreen && (
                          <TableCell align="right"></TableCell>
                        )}
                        <TableCell align="right">
                          <IconButton
                            className="addcss"
                            onClick={() => handleEditClick(row.roleId)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                              <path
                                d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                              <path
                                d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </svg>
                          </IconButton>
                          <IconButton
                            className="deletecss"
                            onClick={() => handleDeleteClick(row.roleId)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
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

export default ResponsiveTable;