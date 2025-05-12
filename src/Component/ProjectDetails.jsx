import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
  Checkbox,
  TextField,
  IconButton,
  Select,
  MenuItem,
  ListItemText,
  Chip,
  OutlinedInput,
  FormControl,
} from "@mui/material";
import Loader from "../Component/Loader";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { setSelectedProjectDetails } from "../feature/apiDataSlice";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const baseURL = "https://staffcentral.azurewebsites.net/api";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [roleOptions, setRoleOptions] = useState([]);
  const selectedEmployees = useSelector(
    (state) => state.apiData.selectedEmployees
  );

  const groupByEmpCode = (records) => {
    return records.reduce((acc, record) => {
      const empCode = record.empCode;
      if (!acc[empCode]) {
        acc[empCode] = [];
      }
      acc[empCode].push(record);
      return acc;
    }, {});
  };

  const refreshList = () => {
    const empCodes = selectedEmployees.join(",");
    const cachedRows = JSON.parse(localStorage.getItem("projectData")) || [];

    const filteredCachedRows = cachedRows.filter((row) =>
      selectedEmployees.includes(row.empCode)
    );

    const uncachedEmpCodes = selectedEmployees
      .filter(
        (empCode) => !filteredCachedRows.some((row) => row.empCode === empCode)
      )
      .join(",");

    if (uncachedEmpCodes) {
      axios
        .get(`${baseURL}/CreateEmployeeCV/GetProjectDetailsByEmpCodes`, {
          params: { empCodes: uncachedEmpCodes },
        })
        .then((response) => {
          const allData = [
            ...filteredCachedRows,
            ...response.data.map((item) => ({
              ...item,
              isChecked: false,
            })),
          ];
          setData(allData);
          localStorage.setItem("projectData", JSON.stringify(allData));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    } else {
      setData(filteredCachedRows);
      localStorage.setItem("projectData", JSON.stringify(filteredCachedRows));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEmployees.length > 0) {
      refreshList();
    } else {
      localStorage.removeItem("projectData");
      setData([]);
    }
  }, [selectedEmployees]);

  const fetchCompanyRoles = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/CompanyProject/GetAllCompanyRole`
      );
      const roles = response.data.map((role) => role.name);
      setRoleOptions(roles);
    } catch (error) {
      console.error("Error fetching company roles:", error);
    }
  };

  useEffect(() => {
    fetchCompanyRoles();
  }, []);

  const handleCheckboxChange = (item) => {
    const updatedData = data.map((row) =>
      row.empCode === item.empCode && row.projectName === item.projectName
        ? { ...row, isChecked: !row.isChecked }
        : row
    );
    setData(updatedData);
    const updatedSelectedRows = updatedData.filter((row) => row.isChecked);
    dispatch(setSelectedProjectDetails(updatedSelectedRows));
    localStorage.setItem("projectData", JSON.stringify(updatedData));
  };

  const isRowSelected = (item) => item.isChecked;

  const handleEditClick = (item) => {
    setEditingRow(`${item.empCode}-${item.projectName}`);
    setEditValues({
      projectName: item.projectName,
      projectRole:
        typeof item.projectRole === "string"
          ? item.projectRole.split(",").filter((role) => role.trim() !== "")
          : item.projectRole || [],
      fromDate: item.fromDate,
      toDate: item.toDate,
      projectDescription: item.projectDescription,
    });
  };

  const handleSaveClick = (empCode, projectName) => {
    const cleanedProjectRole = editValues.projectRole
      .filter((role) => role.trim() !== "")
      .join(",")
      .replace(/^,/, "");
    const updatedData = data.map((item) =>
      item.empCode === empCode && item.projectName === projectName
        ? {
            ...item,
            ...editValues,
            projectRole: cleanedProjectRole,
            isChecked: false,
          }
        : item
    );
    setData(updatedData);
    setEditingRow(null);
    localStorage.setItem("projectData", JSON.stringify(updatedData));
  };

  const handleCancelClick = () => {
    setEditingRow(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      projectRole: value || [],
    }));
  };

  const groupedData = groupByEmpCode(data);

  return (
    <Box>
      {loading ? (
        <Loader />
      ) : (
        <>
          {Object.keys(groupedData).map((empCode) => (
            <Container key={empCode}>
              <TableContainer
                className="pd-0 table-experience-details-section"
                component={Paper}
              >
                <Typography
                  variant="h7"
                  sx={{ minWidth: 275, mt: 0, pl: 2, pt: 2, pb: 1 }}
                  component="div"
                  gutterBottom
                >
                  Employee Name : {groupedData[empCode][0].employeeName}
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>S.No</TableCell>
                      <TableCell style={{ width: '200px' }}>Project Name</TableCell>
                      <TableCell>Description</TableCell> 
                      <TableCell>Role</TableCell>
                      <TableCell>From Date</TableCell>
                      <TableCell>To Date</TableCell>
                      <TableCell>Selected</TableCell>
                      <TableCell>Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedData[empCode].map((item, rowIndex) => (
                      <TableRow key={`${item.empCode}-${item.projectName}`}>
                        <TableCell>{rowIndex + 1}</TableCell>
                        <TableCell>
                          {editingRow ===
                          `${item.empCode}-${item.projectName}` ? (
                            <TextField
                              name="projectName"
                              value={editValues.projectName}
                              onChange={handleInputChange}
                              style={{ width: '200px' }}
                            />
                          ) : (
                            item.projectName
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow ===
                          `${item.empCode}-${item.projectName}` ? (
                            <TextField
                              name="projectDescription"
                              value={editValues.projectDescription}
                              onChange={handleInputChange}
                              multiline
                              style={{ width: '200px' }}
      rows={4} 
                            />
                          ) : (
                            item.projectDescription
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow ===
                          `${item.empCode}-${item.projectName}` ? (
                            <FormControl fullWidth>
                              <Select
                                labelId={`companyRole-select-${item.empCode}`}
                                multiple
                                displayEmpty
                                value={editValues.projectRole || []}
                                onChange={handleRoleChange}
                                input={<OutlinedInput />}
                                
                                renderValue={(selected) =>
                                  selected.length > 0 ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                      }}
                                    >
                                      {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                      ))}
                                    </Box>
                                  ) : (
                                    <em
                                      style={{ color: "rgba(0, 0, 0, 0.54)" }}
                                    >
                                      Please select a role
                                    </em>
                                  )
                                }
                              >
                                {roleOptions.length > 0 ? (
                                  roleOptions.map((role) => (
                                    <MenuItem key={role} value={role}>
                                      <Checkbox
                                        checked={editValues.projectRole.includes(
                                          role
                                        )}
                                      />
                                      <ListItemText primary={role} />
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem disabled>
                                    No roles available
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          ) : (
                            item.projectRole
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow ===
                          `${item.empCode}-${item.projectName}` ? (
                            <TextField
                              type="date"
                              name="fromDate"
                              value={moment(editValues.fromDate).format(
                                "YYYY-MM-DD"
                              )}
                              onChange={handleInputChange}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          ) : (
                            moment(item.fromDate).format("YYYY-MM-DD")
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow ===
                          `${item.empCode}-${item.projectName}` ? (
                            <TextField
                              type="date"
                              name="toDate"
                              value={moment(editValues.toDate).format(
                                "YYYY-MM-DD"
                              )}
                              onChange={handleInputChange}
                              InputProps={{
                                inputProps: {
                                  min: moment(editValues.fromDate).format(
                                    "YYYY-MM-DD"
                                  ),
                                },
                              }}
                            />
                          ) : (
                            moment(item.toDate).format("YYYY-MM-DD")
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Checkbox
                            checked={isRowSelected(item)}
                            onChange={() => handleCheckboxChange(item)}
                          />
                        </TableCell>
                        <TableCell>
                          {editingRow ===
                          `${item.empCode}-${item.projectName}` ? (
                            <>
                              <IconButton
                                onClick={() =>
                                  handleSaveClick(
                                    item.empCode,
                                    item.projectName
                                  )
                                }
                              >
                                <SaveIcon />
                              </IconButton>
                              <IconButton onClick={handleCancelClick}>
                                <CancelIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton onClick={() => handleEditClick(item)}>
                              <EditIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          ))}
        </>
      )}
    </Box>
  );
};

export default ProjectDetails;
