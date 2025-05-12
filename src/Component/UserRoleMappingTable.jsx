import React, { useState, useEffect } from "react";
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
  Box,
  Button,
  Stack
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  AddOutlined as AddOutlinedIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { UserRoleMappingForm } from "./UserRoleMappingForm";
import axios from "axios";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CachedIcon from "@mui/icons-material/Cached";
import ConfirmationDialogBox from "./ConfirmationDialogbox";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const UserRoleMappingTable = () => {
  const baseURL = "https://staffcentral.azurewebsites.net/api";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("roleId");
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  //const [sortedRows, setSortedRows] = useState([]);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleId, setSelectedRoleId] = useState(null);
  const [moduleId, setSelectedModuleId] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/LinkRoleMapping/GetAllLink-RoleMappingView`
      );
      setData(response.data);
      setFilteredRows(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredRows(
      data.filter((row) =>
        row.roleText.toLowerCase().includes(search.toLowerCase())
      )
    );
    setPage(0)
  }, [search, data]);

  // useEffect(() => {
  //   const sorted = [...filteredRows].sort((a, b) => {
  //     if (b[orderBy] < a[orderBy]) return order === "asc" ? -1 : 1;
  //     if (b[orderBy] > a[orderBy]) return order === "asc" ? 1 : -1;
  //     return 0;
  //   });
  //   setSortedRows(sorted);
  // }, [filteredRows, order, orderBy]);
  const sortComparator = (a, b) => {
    if (order=="desc") {
    return  a.linkRoleMappingId-b.linkRoleMappingId ;
    } else {
      return b.linkRoleMappingId - a.linkRoleMappingId;
    }
  };

  const sortedRows = [...filteredRows].sort(sortComparator);
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleEditClick = (linkRoleData) => {
    handleToggle();
    setTableData(linkRoleData);
  };

  const handleConfirmDelete = async () => {
    
    try {
      const response = await fetch(`${baseURL}/LinkRoleMapping/DeleteLinkRoleMappingAsync?RoleId=${roleId}&moduleId=${moduleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        toast.success("Link Role deleted successfully", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
        fetchData();
      } else {
        toast.error("Failed to delete data", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Error occurred while deleting data", {
        position: "top-center",
        closeButton: false,
        autoClose: 2000,
      });
    } finally {
      handleCloseDialog();
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
  const [showDiv, setShowDiv] = useState(false);
  const handleToggle = () => {
    setShowDiv(true);
    setTableData(null);
  };

  const handleCsvDownload = () => {
    return filteredRows.map((row) => ({
      "Role Name": row.roleText,
      "Module Name": row.name,
      "Link Name": row.linkNames,
    }));
  };

  const downloadExcel = () => {
    const filteredData = filteredRows.map((row) => ({
      "Role Name": row.roleText,
      "Module Name": row.name,
      "Link Name": row.linkNames,
    }));
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Roles");
    XLSX.writeFile(wb, "Link_Roles.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Role Name", "Module Name", "Link Name"]],
      body: filteredRows.map((row) => [row.roleText, row.name, row.linkNames]),
    });
    doc.save("Link_Roles.pdf");
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRoleId(null);
    setSelectedModuleId(null);
  };
  const deleteLinkRole = (roleId, moduleId) => {
    setSelectedRoleId(roleId);
    setSelectedModuleId(moduleId);
    setIsDialogOpen(true);
  };
 
  return (
    <Paper
      sx={{ width: "100%", overflow: "hidden", mb: 2 }}
      className="table-card"
    >
      <ToastContainer />
      <Box sx={{ mb: 0 }}>
        {showDiv ? (
          <UserRoleMappingForm
            showDivData={setShowDiv}
            roleData={tableData}
            refreshData={fetchData}
          />
        ) : null}
      </Box>

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
            <CSVLink data={handleCsvDownload()} filename={"Link_Roles.csv"}>
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
        <Grid item xs={5} />
        <Grid item xs={2} textAlign={"right"}>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            className="primary"
            onClick={handleToggle}
          >
            <AddOutlinedIcon className="add-icon" /> Add
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Box>
            <TextField
              className="search-css"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Search Link & Role Mapping"
              value={search}
              onChange={handleSearchChange}
            />
            <SearchIcon className="search-icon" />
          </Box>
        </Grid>
      </Grid>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "roleText"}
                  direction={orderBy === "roleText" ? order : "asc"}
                  onClick={() => handleRequestSort("roleText")}
                >
                  Role Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  Module Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Link Name</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{row.roleText}</TableCell>
                  <TableCell>{row.moduleName}</TableCell>
                  {!isSmallScreen && <TableCell>{row.linkNames}</TableCell>}
                  <TableCell align="right">
                    <Stack direction="row">
                      <IconButton
                        className="addcss"
                        onClick={() => handleEditClick(row)}
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
                        onClick={() => deleteLinkRole(row.roleId, row.moduleId)}
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
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={sortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ConfirmationDialogBox
        // isOpen={isDialogOpen}
        // onClose={() => setIsDialogOpen(false)}
        // onConfirm={handleConfirmDelete}
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        content="Are you sure, you want to delete this record?"
      />
    </Paper>
  );
};

export default UserRoleMappingTable;