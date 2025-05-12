import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Box,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { DialogTitle } from "@mui/material";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function UserRoleMappingForm(props) {
  const baseURL = "https://staffcentral.azurewebsites.net/api";
  const [roleName, setRoleName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [id, setId] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [moduleNames, setModuleNames] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState({});
  const [hide, setHide] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const rdata = props.roleData;

  // Fetch roles and module data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [rolesResponse, modulesResponse] = await Promise.all([
          fetch(`${baseURL}/RoleMaster/GetAllRole`),
          fetch(`${baseURL}/Module/GetAllModuleName`),
        ]);
        const rolesData = await rolesResponse.json();
        const modulesData = await modulesResponse.json();

        setMenuItems(rolesData);
        setModuleNames(modulesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Handle role data updates
  useEffect(() => {
    const fetchRoleData = async () => {
      if (rdata) {
        setIsEdit(true);
        setId(rdata.roleId);
        setRoleName(rdata.roleId);
        setModuleName(rdata.moduleId);

        try {
          const response = await fetch(
            `${baseURL}/LinkRoleMapping/GetLinkRoleMappingById?RoleId=${rdata.roleId}&ModuleId=${rdata.moduleId}`
          );
          const links_namedata = await response.json();

          const updatedOptions = links_namedata.map((link) => ({
            linkName: link.linkName,
            moduleLinkId: link.moduleLinkId.toString(),
            checked: true,
          }));

          setOptions(updatedOptions);
          setSelectedOptions(
            updatedOptions.map((link) => ({
              moduleLinkId: link.moduleLinkId.toString(),
              linkName: link.linkName,
            }))
          );
        } catch (error) {
          console.error("Error fetching role data:", error);
        }
      }
    };

    fetchRoleData();
  }, [rdata]);

  // Fetch module links based on the selected module
  useEffect(() => {
    const fetchModuleLinks = async () => {
      if (moduleName) {
        try {
          const response = await fetch(
            `${baseURL}/Module/GetModuleLinkById?moduleId=${moduleName}`
          );
          const data = await response.json();
          const newOptions = data.map((item) => ({
            linkName: item.linkName,
            moduleLinkId: item.moduleLinkId.toString(),
            checked: selectedOptions.some(
              (opt) => opt.moduleLinkId === item.moduleLinkId.toString()
            ),
          }));
          setOptions(newOptions);
        } catch (error) {
          console.error("Error fetching module links:", error);
        }
      }
    };

    fetchModuleLinks();
  }, [moduleName, selectedOptions]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const updatedOptions = options.map((option) => {
      if (option.moduleLinkId.toString() === value) {
        return { ...option, checked };
      }
      return option;
    });
    setOptions(updatedOptions);

    const updatedSelectedOptions = checked
      ? [
          ...selectedOptions,
          options.find((opt) => opt.moduleLinkId.toString() === value),
        ]
      : selectedOptions.filter((opt) => opt.moduleLinkId.toString() !== value);
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleRoleChange = (event) => {
    setRoleName(event.target.value);
  };

  const handleModuleChange = (event) => {
    setModuleName(event.target.value);
    const selectedModule = moduleNames.find(
      (module) => module.moduleId === event.target.value
    );
    if (selectedModule) {
      setId(selectedModule.moduleId);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setHide(false);
    props.showDivData(!hide);
  };

  const validateRole = () => {
    let errors = {};

    if (roleName === "") {
      errors.roleName = "Please Enter Role Name";
    }
    if (moduleName === "") {
      errors.moduleName = "Please Enter Module Name";
    }

    if (options.length != 0) {
      if (selectedOptions.length === 0) {
        errors.selectedOptions = "Please Select at least one Link Name";
      }
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateRole()) {
      setIsLoading(true);
      setIsEdit(false);
      let res;
      try {
        const payload = {
          roleId: parseInt(roleName),
          moduleId: parseInt(moduleName),
          moduleLinkIds: selectedOptions.map((option) =>
            parseInt(option.moduleLinkId, 10)
          ),
        };
        res = await axios.post(
          `${baseURL}/LinkRoleMapping/assign-linkRole`,
          payload
        );

        if (res.data === "Link assigned successfully.") {
          toast.success("Link And Role Mapping Saved Successfully", {
            position: "top-center",
            closeButton: false,
            autoClose: 2000,
          });
          props.refreshData();
          resetForm();
          setHide(false);
          props.showDivData(!hide);
          return false;
        }
        setError("");
      } catch (err) {
        setError({
          message:
            "User already assigned with various roles. You can update the users role.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setRoleName("");
    setModuleName("");
    setSelectedOptions([]);
    setOptions([]);
    setError("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        roleId: parseInt(roleName, 10),
        moduleId: parseInt(moduleName, 10),
        moduleLinkIds: selectedOptions.map((option) =>
          parseInt(option.moduleLinkId, 10)
        ),
      };
      
      const res = await axios.post(
        `${baseURL}/LinkRoleMapping/UpdateLinkRoleMapping`,
        payload
      );

      if (res.data === "Record updated successfully.") {
        toast.success("Role mapping updated successfully", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
        props.refreshData();
        props.showDivData(!hide);
        resetForm();
      } else {
        toast.error("Failed to update role mapping");
      }
    } catch (err) {
      console.error("Error:", err); // Log any caught errors for debugging
      setError(err.response?.data?.message || "Error updating role mapping");
    } finally {
      setIsLoading(false);
      // setHide(false);
      setIsEdit(false);
    }
  };
  

  useEffect(() => {
    const fetchRoleData = async () => {
      if (rdata) {
        setIsEdit(true);
        setId(rdata.roleId); // Set the ID for the record you want to update
        setRoleName(rdata.roleId); // Set the role name (ID)
        setModuleName(rdata.moduleId); // Set the module name (ID)

        try {
          const response = await fetch(
            `${baseURL}/LinkRoleMapping/GetLinkRoleMappingById?RoleId=${rdata.roleId}&ModuleId=${rdata.moduleId}`
          );
          const links_namedata = await response.json();

          const updatedOptions = links_namedata.map((link) => ({
            linkName: link.linkName,
            moduleLinkId: link.moduleLinkId.toString(),
            checked: true,
          }));

          setOptions(updatedOptions);
          setSelectedOptions(
            updatedOptions.map((link) => ({
              moduleLinkId: link.moduleLinkId.toString(),
              linkName: link.linkName,
            }))
          );
        } catch (error) {
          console.error("Error fetching role data:", error);
        }
      }
    };

    fetchRoleData();
  }, [rdata]);

  return (
    <div className="cart-border-10">
      {hide && (
        <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
          <form
            onSubmit={isEdit ? handleUpdate : handleSubmit}
            className="tondform-css"
          >
            <Grid container>
              <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                <FormControl fullWidth>
                  <InputLabel id="role-name-label">Role Name</InputLabel>
                  <Select
                    labelId="role-name-label"
                    id="role-name-select"
                    value={roleName}
                    label="Role Name"
                    onChange={handleRoleChange}
                  >
                    {menuItems.map((item) => (
                      <MenuItem key={item.roleId} value={item.roleId}>
                        {item.roleText}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {error.roleName && (
                  <Grid item xs={12} sx={{ mb: 1, pl: 0, pr: 2 }}>
                    <Typography fontSize={13} color="error">
                      {error.roleName}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 2, pr: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="module-name-label">Module Name</InputLabel>
                  <Select
                    labelId="module-name-label"
                    id="module-name-select"
                    value={moduleName}
                    label="Module Name"
                    onChange={handleModuleChange}
                  >
                    {moduleNames.map((item) => (
                      <MenuItem key={item.moduleId} value={item.moduleId}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {error.moduleName && (
                  <Grid item xs={12} sx={{ mb: 1, pl: 0, pr: 2 }}>
                    <Typography fontSize={13} color="error">
                      {error.moduleName}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Grid sx={{ ml: 2, mt: 1, pl: 2, pr: 4 }} className="linknamecss">
                <Typography>
                  {options.length != 0 ? "Link Names" : ""}
                </Typography>
                <Box sx={{ display: "inline-grid", ml: 1 }}>
                  {options.map((option) => (
                    <FormControlLabel
                      key={option.moduleLinkId}
                      control={
                        <Checkbox
                          checked={option.checked}
                          onChange={handleCheckboxChange}
                          value={option.moduleLinkId}
                        />
                      }
                      label={option.linkName}
                      sx={{ mr: 2 }}
                    />
                  ))}
                </Box>
                {error.selectedOptions && (
                  <Grid item xs={12} sx={{ mb: 1, pl: 0, pr: 2 }}>
                    <Typography fontSize={13} className="errorcss">
                      {error.selectedOptions}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              {error.message && (
                <Grid item xs={12} sx={{ mb: 1, pl: 4, pr: 2 }}>
                  <Typography color="error" sx={{ mt: 2 }}>
                    {error.message}
                  </Typography>
                </Grid>
              )}

              <Grid
                item
                xs={12}
                sx={{ mt: -2, mb: 2, pl: 2, pr: 3 }}
                textAlign={"right"}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className="primary mr-10"
                  disabled={isLoading}
                >
                  {isEdit ? "Update" : "Submit"}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  className="warning"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      )}
    </div>
  );
}