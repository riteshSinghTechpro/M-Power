import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
import Loader from "../Component/Loader";
import {
  Box,
  Button,
  Grid,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedObjectiveDetails } from "../feature/apiDataSlice";

const Objective = () => {
  const baseURL = "https://staffcentral.azurewebsites.net/api";
  const selectedEmployees = useSelector((state) => state.apiData.selectedEmployees);
  const datas = useSelector((state) => state.apiData.selectedObjectiveDetails);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(""); 
  const [objectiveName, setObjectiveName] = useState(
    localStorage.getItem("selectedObjectiveName") || ""
  ); 
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(
    JSON.parse(localStorage.getItem("isCheckboxChecked")) || false
  );
  const dispatch = useDispatch(); 
 
  const refreshList = () => {
    if (!isCheckboxChecked && selectedEmployees.length > 0) {
      const cachedData = JSON.parse(localStorage.getItem("objectiveData")) || [];
      
      const missingEmpCodes = selectedEmployees.filter(
        (empCode) => !cachedData.some(item => item.employeeCode === empCode)
      );
      
      if (missingEmpCodes.length > 0) {
        
        const empCodes = missingEmpCodes.join(",");
  
        axios
          .get(`${baseURL}/CreateEmployeeCV/GetEmployeeCVDetails`, { params: { empCodes } })
          .then((response) => {
            if (response.data?.employeeCVObjectiveDetails) {
              const newData = response.data.employeeCVObjectiveDetails;
  
              const updatedData = [...cachedData, ...newData];
  
              setData(updatedData);
              dispatch(setSelectedObjectiveDetails(updatedData));
              localStorage.setItem("objectiveData", JSON.stringify(updatedData));
              setLoading(false);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error.response || error.message);
            setLoading(false);
          });
      } else {
        setData(cachedData);
        setLoading(false);
      }
    } else {
      setLoading(false); 
    }
  };
  
  useEffect(() => {
    if (selectedEmployees.length === 0) {
      localStorage.removeItem("objectiveData");
      localStorage.removeItem("selectedObjectiveName");
      setData([]);
      setValue("");
      setObjectiveName("");
    } else {
      refreshList(); 
    }
  }, [selectedEmployees, isCheckboxChecked]);

  useEffect(() => {
    const savedData = localStorage.getItem("objectiveData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);
      const savedObjectiveName = localStorage.getItem("selectedObjectiveName");
      if (savedObjectiveName) {
        setObjectiveName(savedObjectiveName);
        const selectedObjective = parsedData.find(
          (item) => item.employeeCode === savedObjectiveName
        );
        if (selectedObjective) {
          setValue(selectedObjective.objectiveDescription || "");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (selectedEmployees.length > 0) {
      localStorage.setItem("objectiveData", JSON.stringify(data));
      localStorage.setItem("selectedObjectiveName", objectiveName);
      localStorage.setItem("isCheckboxChecked", JSON.stringify(isCheckboxChecked)); 
    }
  }, [data, objectiveName, selectedEmployees, isCheckboxChecked]);

  
  const handleModuleChange = (event) => {
    const selectedObjectiveName = event.target.value;
    setObjectiveName(selectedObjectiveName);
    const selectedObjective = data.find(
      (item) => item.employeeCode === selectedObjectiveName
    );
    if (selectedObjective) {
      const { objectiveDescription } = selectedObjective;
      setValue(objectiveDescription || "");
    } else {
      setValue("");
    }
    localStorage.setItem("selectedObjectiveName", selectedObjectiveName);
  };

  const handleClear = () => {
    setValue("");
    localStorage.removeItem("objectiveDescription");
  };

  const handleDescriptionChange = (content) => {
    setValue(content);
    const updatedData = data.map((item) =>
      item.employeeCode === objectiveName
        ? { ...item, objectiveDescription: content }
        : item
    );
    setData(updatedData);
    localStorage.setItem("objectiveData", JSON.stringify(updatedData));
    dispatch(setSelectedObjectiveDetails(updatedData));
  };

  if (loading) {
    return <Typography><Loader /></Typography>;
  }

  return (
    <Box  className="border-0">
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{ mt: 1, mb: 0, pl: 0, pr: 0 }}
          className="tondform-css"
        >
          <FormControl fullWidth>
            <InputLabel id="module-name-label">Select Objective</InputLabel>
            <Select
              labelId="module-name-label"
              id="module-name-select"
              value={objectiveName}
              label="Objective Name"
              onChange={handleModuleChange}
            >
              {data.map((item) => (
                <MenuItem key={item.employeeCode} value={item.employeeCode}>
                  {item.employeeObjective}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sx={{ mt: 1, mb: 0, pl: 0, pr: 0 }}>
          <Typography variant="h5" className="title-b" sx={{ mb: 2 }}>
            Description
          </Typography>
          <ReactQuill
            key={objectiveName}
            value={value}
            onChange={handleDescriptionChange}
            theme="snow"
            placeholder="Write something..."
            style={{ height: "200px", marginBottom: "20px" }}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 5 }}>
        <Button variant="contained" color="secondary" onClick={handleClear}>
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default Objective;
